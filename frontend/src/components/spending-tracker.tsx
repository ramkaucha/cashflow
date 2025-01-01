'use client' 

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Trash2, ArrowUpDown, Search, ArrowUp, TruckIcon, Pencil, Tangent } from 'lucide-react';
import { flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, useReactTable, createColumnHelper, ColumnDef, Column, CellContext } from "@tanstack/react-table";
import Papa from 'papaparse';
import _, { conforms, head } from 'lodash';

const PREDEFINED_CATEGORIES = [
  'Rent', 
  'Utilities',
  'Food and Drinks',
  'Transport',
  'Health',
  'Clothing',
  'Debt',
  'Leisure'
];

const DEFAULT_CATEGORY_RULES = {
  'WOOLWORTHS': 'Food and Drinks',
  'COLES': 'Food and Drinks',
  'ALDI': 'Food and Drinks',
  'UBER EATS': 'Food and Drinks',
  'UBER *': 'Transport',
  'NETFLIX': 'Leisure',
  'SPOTIFY': 'Leisure',
  'MEDICARE': 'Health',
  'CHEMIST': 'Health',
};

interface RawTransaction {
  date: string;
  credit_debit: number | string;
  company_name: string;
  balance: string | number;
}

interface ProcessedTransaction extends RawTransaction {
  category: string;
  amount: number;
}
type CategoryRule = Record<string, string>;
const STORAGE_KEY = 'SpendingTrackerRules';

export default function SpendingTracker() {
  const [ transactions, setTransactions ] = useState<ProcessedTransaction[]>([]);
  const [ categoryTotals, setCategoryTotals ] = useState<Record<string, number>>({});
  const [ uncategorisedTransactions, setUncategorisedTransactions] = useState<ProcessedTransaction | null>(null);
  const [ uncategorisedQueue, setUncategorisedQueue ] = useState<ProcessedTransaction[]>([]);
  const [ categoryRules, setCategoryRules ] = useState<CategoryRule>(DEFAULT_CATEGORY_RULES);
  const [ globalFilter, setGlobalFilter ] = useState('');
  const [ editingTransaction, setEditingTransaction ] = useState<ProcessedTransaction | null>(null);

  const columns: ColumnDef<ProcessedTransaction>[] = [
    {
      accessorKey: 'date',
      header: ({ column }: { column: Column<ProcessedTransaction> }) => (
        <button
          className='flex items-center gap-2'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className='h-4 w-4' />
        </button>
      ),
    },
    {
      accessorKey: 'company_name',
      header: ({ column }: { column: Column<ProcessedTransaction> }) => (
        <button
          className='flex items-center gap-2'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Description
          <ArrowUpDown className='h-4 w-4' />
        </button>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }: { column: Column<ProcessedTransaction> }) => (
        <button
          className='flex items-center gap-2'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className='h-4 w-4' />
        </button>
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }: { column: Column<ProcessedTransaction> }) => (
        <button
          className='flex items-center gap-2 ml-auto'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className='h-4 w-4' />
        </button>
      ),
      cell: (props: CellContext<ProcessedTransaction, unknown>) => {
        const value = props.getValue() as number;
        return (
          <div className='text-right'>
            ${Math.abs(value).toFixed(2)}
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2 justify-end'>
          <button
            onClick={() => handleEditCategory(row.original)}
            className='p-1 text-blue-600 hover:bg-blue-50 rounded-md'
          >
            <Pencil className='h-4 w-4' />
          </button>
          <button
            onClick={() => handleDeleteTransaction(row.original)}
            className='p-1 text-red-800 hover:bg-red-50 rounded-md'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </div>
      )
    }
  ]

  useEffect(() => {
    const savedRules = localStorage.getItem(STORAGE_KEY);
    setCategoryRules({
      ...DEFAULT_CATEGORY_RULES,
      ... (savedRules ? JSON.parse(savedRules) : {})
    });
  }, []);

  // saving new Rules
  const saveRule = ( merchantName: string, category: string ) => {
    const newRules = {
      ...categoryRules,
      [merchantName.toUpperCase()]: category
    };

    console.log(newRules);

    setCategoryRules(newRules);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRules));
  }

  const handleEditCategory = (transaction: ProcessedTransaction) => {
    setEditingTransaction(transaction);
  }

  const handleDeleteTransaction = (transaction: ProcessedTransaction) => {
    const updatedTransactions = transactions.filter(t =>
      t.company_name !== transaction.company_name || t.date !== transaction.date
    );

    processTransactions(updatedTransactions);
  }

  const handleEditCategorySelect = (selectedCategory: string) => {
    if (!editingTransaction) return;

    const updatedTransactions = transactions.map(t => 
      t.company_name === editingTransaction.company_name && t.date === editingTransaction.date
      ? { ...t, category: selectedCategory }
      : t
    );

    processTransactions(updatedTransactions);
    saveRule(editingTransaction.company_name, selectedCategory);
    setEditingTransaction(null);
  }

  // clearing saved Rules
  const clearSavedRules = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCategoryRules(DEFAULT_CATEGORY_RULES);
  };

  const categoriseTransaction = (companyName: string): string => {
    const upperName = companyName.toUpperCase()

    for (const [keyword, category] of Object.entries(categoryRules)) {
      if (upperName.includes(keyword)) {
        return category;
      }
    }

    return 'Uncategorised';
  };

  // processing transactions and update totals
  const processTransactions = ( transactionData: ProcessedTransaction[] ) => {
    const totals = _.groupBy(transactionData, 'category');
    const categorySums = Object.entries(totals).reduce((acc, [category, items]) => ({
      ...acc,
      [category]: _.sumBy(items, 'amount')
    }), {});

    setCategoryTotals(categorySums);
    setTransactions(transactionData);
  }

  type FileUploadEvent = React.ChangeEvent<HTMLInputElement>;

  const handleFileUpload = (event: FileUploadEvent) => {
    const file = event.target.files?.[0];

    if (!file) {
      console.log('No file selected');
      return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      console.error("Please upload csv file");
      return;
    }

    console.log("starting file read");
    const reader = new FileReader();

    reader.onerror = (error) => {
      console.error('File reader error:', error);
    }


    console.log('here');
    reader.onload = (e: ProgressEvent<FileReader>) => {
      console.log('File read complete');

      if (!e.target?.result) {
        console.error('No file content');
        return;
      }

      Papa.parse<RawTransaction>(e.target?.result as string, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: (result) => {


          const newTransaction = result.data.map((transaction: RawTransaction): ProcessedTransaction => ({
            ...transaction,
            category: categoriseTransaction(transaction.company_name || ''),
            amount: parseFloat(transaction.credit_debit.toString() || '0')
          }));
          
          const uncategorised = newTransaction.filter(t => t.category === "Uncategorised");

          setUncategorisedQueue(uncategorised);

          if (uncategorised.length > 0) {
            setUncategorisedTransactions(uncategorised[0]);
          }

          processTransactions(newTransaction);
        }

      })
    }

    console.log('starting readAsRext');
    reader.readAsText(file);
    console.log('readAsText called');
  };

  const table = useReactTable({
    data: transactions, 
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleCategorySelect = ( selectedCategory: string) => {
    if (!uncategorisedTransactions) return;

    saveRule(uncategorisedTransactions.company_name, selectedCategory);

    const updatedTransaction = transactions.map(t => 
      t.company_name === uncategorisedTransactions.company_name
        ? { ...t, category: selectedCategory }
        : t
    );

    const newQueue = uncategorisedQueue.filter(t => t.company_name !== uncategorisedTransactions.company_name);

    processTransactions(updatedTransaction);
    setUncategorisedQueue(newQueue);

    // showing next
    setUncategorisedTransactions(newQueue.length > 0 ? newQueue[0] : null);
  };


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Spending Tracker</CardTitle>
        <button 
          className="flex items-center gap-2 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
          onClick={clearSavedRules}
        >
          <Trash2 className="w-4 h-4" />
          Clear Rules
        </button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Category Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(categoryTotals).map(([category, total]: [string, number]) => (
              <div key={category} className="p-4 border rounded-lg">
                <div className="font-medium">{category}</div>
                <div className="text-lg">${Math.abs(total).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Search */}
        <div className='relative mb-4'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
          <Input
            placeholder='Search transactions...'
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className='pl-8'
          />
        </div>

        <div className='rounded-md border'>
          <table className='w-full'>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className='border-b bg-gray-50'>
                  { headerGroup.headers.map(header => (
                    <th key={header.id} className='px-4 py-2 text-left font-medium text-gray-500'>
                      {header.isPlaceholder
                        ? null 
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className='border-b'>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className='px-4 py-2'>
                      { flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Category selection Modal */}
        <AlertDialog open={!!uncategorisedTransactions}>
          <AlertDialogContent>
            <AlertDialogTitle>
              Categorise Transaction: {uncategorisedTransactions?.company_name} : $ {uncategorisedTransactions?.amount}
            </AlertDialogTitle>
            <div className='grid grid-cols-3 gap-4 py-4'>
              {PREDEFINED_CATEGORIES.map((category) => (
                <AlertDialogAction
                  key={category}
                  className='bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 h-20'
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </AlertDialogAction>
              )
            )}
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Category editing modal */}
        <AlertDialog open={!!editingTransaction}>
          <AlertDialogContent>
            <AlertDialogTitle>
              Editing Transaction: {editingTransaction?.company_name} : $ {editingTransaction?.amount}
            </AlertDialogTitle>
            <div className='grid grid-cols-3 gap-4 py-4'>
              {PREDEFINED_CATEGORIES.map((category) => (
                <AlertDialogAction
                  key={category}
                  className='bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 h-20'
                  onClick={() => handleEditCategorySelect(category)}
                >
                  {category}
                </AlertDialogAction>
              ))}
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
