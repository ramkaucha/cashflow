"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useTransaction from "./components/use-transaction";
import { Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import TransactionTable from "@/app/dashboard/components/transaction-table";
import CategoryModal from "@/app/dashboard/components/category-modal";
import ErrorAlert from "@/components/error-alert";
import CategoryTotals from "./components/category-totals";

export default function DashboardPage() {
  const {
    transactions,
    categoryTotals,
    error,
    uncategorisedTransactions,
    editingTransaction,
    handleFileUpload,
    setError,
    handleDeleteTransaction,
    handleEditCategory,
    handleCategorySelect,
    handleEditCategorySelect,
    clearSavedRules,
    handleOnCloseModal,
    fileInputRef,
    handleFileSelect,
  } = useTransaction();

  const [globalFilter, setGlobalFilter] = useState("");

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
        <div className="mb-6 flex items-center space-x-2">
          {/* <div className="flex-1"> */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {/* </div> */}
          <button
            className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleFileUpload}
          >
            Upload
          </button>
        </div>
        {error && <ErrorAlert message={error} handleClose={() => setError(null)} />}
        <div className="mb-6">
          <CategoryTotals categoryTotals={categoryTotals} />
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search transactions..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <TransactionTable
          transactions={transactions}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onEdit={handleEditCategory}
          onDelete={handleDeleteTransaction}
        />

        <CategoryModal
          transaction={uncategorisedTransactions}
          title="Categorise Transaction"
          onSelect={handleCategorySelect}
          onDelete={handleDeleteTransaction}
          onClose={handleOnCloseModal}
        />
        <CategoryModal
          transaction={editingTransaction}
          title="Editing Transaction"
          onSelect={handleEditCategorySelect}
          onDelete={handleDeleteTransaction}
          onClose={handleOnCloseModal}
        />
      </CardContent>
    </Card>
  );
}
