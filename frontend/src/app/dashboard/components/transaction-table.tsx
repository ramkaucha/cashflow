import { ProcessedTransaction } from "@/app/dashboard/components/types";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  Column,
  ColumnDef,
  CellContext,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import React from "react";

interface TransactionTableProps {
  transactions: ProcessedTransaction[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onEdit: (transaction: ProcessedTransaction) => void;
  onDelete: (transaction: ProcessedTransaction) => void;
}

export default function TransactionTable({
  transactions,
  globalFilter,
  onGlobalFilterChange,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const columns: ColumnDef<ProcessedTransaction>[] = [
    {
      accessorKey: "date",
      header: ({ column }: { column: Column<ProcessedTransaction> }) => (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
    },
    {
      accessorKey: "company_name",
      header: ({ column }: { column: Column<ProcessedTransaction> }) => (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }: { column: Column<ProcessedTransaction> }) => (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }: { column: Column<ProcessedTransaction> }) => (
        <button
          className="flex items-center gap-2 ml-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: (props: CellContext<ProcessedTransaction, unknown>) => {
        const value = props.getValue() as number;
        return <div className="text-right">${Math.abs(value).toFixed(2)}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onEdit(row.original)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(row.original)}
            className="p-1 text-red-800 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange,
  });

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left font-medium text-gray-500">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => {
                const isAmountColumn = cell.column.id === "amount";
                const amount = isAmountColumn ? parseFloat(cell.getValue() as string) : 0;

                return (
                  <td
                    key={cell.id}
                    className={`px-4 py-2 ${
                      isAmountColumn ? (amount > 0 ? "text-green-600" : "text-red-600") : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
