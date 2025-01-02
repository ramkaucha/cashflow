"use client";

import {
  PredefinedTransactions,
  ProcessedTransaction,
  LucideIconName,
  Transaction,
} from "@/app/dashboard/components/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PREDEFINED_EXPENSES, PREDEFINED_INCOME } from "@/app/dashboard/components/constants";
import * as LucideIcons from "lucide-react";
import { LucideIcon, X, Plus } from "lucide-react";
import { useState } from "react";
import AnimatedCloseButton from "@/components/animated-close-button";

interface CategoryModalProps {
  transaction: ProcessedTransaction | null;
  title: string;
  onSelect: (category: string) => void;
  onDelete: (transaction: ProcessedTransaction | Transaction) => void;
  onClose: (transaction: ProcessedTransaction | Transaction) => void;
}

export default function CategoryModal({
  transaction,
  title,
  onSelect,
  onDelete,
  onClose,
}: CategoryModalProps) {
  const [showAll, setShowAll] = useState(false);

  if (!transaction) return null;

  const renderIcon = (iconName: LucideIconName) => {
    const IconComponent = LucideIcons[iconName] as LucideIcon;

    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  return (
    <AlertDialog open={!!transaction}>
      <AlertDialogContent>
        <div className="flex justify-center">
          <AnimatedCloseButton onClick={() => onClose(transaction)} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <AlertDialogTitle>{title}:</AlertDialogTitle>
          <div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-800 hover:text-blue-500 underline"
            >
              {showAll ? "Show Default" : "Show All"}
            </button>
            <button
              type="button"
              className="ml-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg text-sm px-3 py-1.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => onDelete(transaction)}
            >
              Delete
            </button>
          </div>
        </div>
        <div>
          Transaction: {transaction.company_name}
          <br />
          Date: {transaction.date} <br />
          Amount:{" "}
          <span className={transaction.amount <= 0 ? "text-red-500" : "text-green-500"}>
            $ {transaction.amount}
          </span>
        </div>
        {showAll ? (
          <div>
            <h1 className="font-bold">Income:</h1>
            <div className="grid grid-cols-3 gap-4">
              {PREDEFINED_INCOME.map((category: PredefinedTransactions) => (
                <AlertDialogAction
                  key={category.name}
                  className="flex flex-col bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 h-20"
                  onClick={() => onSelect(category.name)}
                >
                  {renderIcon(category.logo)}
                  <span>{category.name}</span>
                </AlertDialogAction>
              ))}
            </div>
            <h1 className="font-bold">Expenses:</h1>
            <div className="grid grid-cols-3 gap-4 py-1">
              {PREDEFINED_EXPENSES.map((category: PredefinedTransactions) => (
                <AlertDialogAction
                  key={category.name}
                  className="flex flex-col bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 h-20"
                  onClick={() => onSelect(category.name)}
                >
                  {renderIcon(category.logo)}
                  <span>{category.name}</span>
                </AlertDialogAction>
              ))}
            </div>
          </div>
        ) : transaction.amount > 0 ? (
          <div>
            <h1 className="font-bold">Income:</h1>
            <div className="grid grid-cols-3 gap-4">
              {PREDEFINED_INCOME.map((category: PredefinedTransactions) => (
                <AlertDialogAction
                  key={category.name}
                  className="flex flex-col bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 h-20"
                  onClick={() => onSelect(category.name)}
                >
                  {renderIcon(category.logo)}
                  <span>{category.name}</span>
                </AlertDialogAction>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="font-bold">Expenses:</h1>
            <div className="grid grid-cols-3 gap-4 py-1">
              {PREDEFINED_EXPENSES.map((category: PredefinedTransactions) => (
                <AlertDialogAction
                  key={category.name}
                  className="flex flex-col bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 h-20"
                  onClick={() => onSelect(category.name)}
                >
                  {renderIcon(category.logo)}
                  <span>{category.name}</span>
                </AlertDialogAction>
              ))}
            </div>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
