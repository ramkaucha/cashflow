"use client";

import React, { useEffect, useState } from "react";
import { CategoryRule, ProcessedTransaction, Transaction } from "./types";
import { DEFAULT_CATEGORY_RULES, STORAGE_KEY } from "./constants";
import _ from "lodash";
import Papa from "papaparse";

export default function useTransaction() {
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [uncategorisedTransactions, setUncategorisedTransactions] =
    useState<ProcessedTransaction | null>(null);
  const [uncategorisedQueue, setUncategorisedQueue] = useState<ProcessedTransaction[]>([]);
  const [categoryRules, setCategoryRules] = useState<CategoryRule>(DEFAULT_CATEGORY_RULES);
  const [editingTransaction, setEditingTransaction] = useState<ProcessedTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<string[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedRules = localStorage.getItem(STORAGE_KEY);
    setCategoryRules({
      ...DEFAULT_CATEGORY_RULES,
      ...(savedRules ? JSON.parse(savedRules) : {}),
    });
  }, []);

  const categoriseTransaction = (companyName: string): string => {
    const upperName = companyName.toUpperCase();

    for (const [keyword, category] of Object.entries(categoryRules)) {
      if (upperName.includes(keyword)) {
        return category;
      }
    }

    return "Uncategorised";
  };

  const processTransactions = (transactionData: ProcessedTransaction[]) => {
    const totals = _.groupBy(transactionData, "category");
    const categorySums = Object.entries(totals).reduce(
      (acc, [category, items]) => ({
        ...acc,
        [category]: _.sumBy(items, "amount"),
      }),
      {}
    );

    setCategoryTotals(categorySums);
    setTransactions(transactionData);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (uploadFiles.includes(file.name)) {
        setError("File already uploaded");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      setError("No File detected");
      return;
    }

    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      setError("Please upload a .csv file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) {
        setError("File has no content");
        return;
      }

      Papa.parse<Transaction>(e.target?.result as string, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: (result) => {
          const newTransaction = result.data.map(
            (transaction: Transaction): ProcessedTransaction => ({
              ...transaction,
              category: categoriseTransaction(transaction.company_name || ""),
              amount: parseFloat(transaction.credit_debit.toString() || "0"),
              fileSource: selectedFile.name,
            })
          );

          const updatedTransactions = [...transactions, ...newTransaction];
          setTransactions(updatedTransactions);

          const uncategorised = updatedTransactions.filter((t) => t.category === "Uncategorised");
          setUncategorisedQueue(uncategorised);
          setUncategorisedTransactions(uncategorised.length > 0 ? uncategorised[0] : null);
          processTransactions(updatedTransactions);

          setUploadFiles((prev) => [...prev, selectedFile.name]);

          // reset file input
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      });
    };

    reader.readAsText(selectedFile);
  };

  const saveRule = (name: string, category: string) => {
    const newRules = {
      ...categoryRules,
      [name.toUpperCase()]: category,
    };

    setCategoryRules(newRules);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRules));
  };

  const clearSavedRules = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCategoryRules(DEFAULT_CATEGORY_RULES);
  };

  const handleDeleteTransaction = (transaction: ProcessedTransaction | Transaction) => {
    const updatedTransactions = transactions.filter(
      (t) => t.company_name !== transaction.company_name || t.date !== transaction.date
    );

    processTransactions(updatedTransactions);

    if (
      uncategorisedTransactions &&
      uncategorisedTransactions.company_name === transaction.company_name &&
      uncategorisedTransactions.date === transaction.date
    ) {
      const newQueue = uncategorisedQueue.filter(
        (t) => t.company_name !== uncategorisedTransactions.company_name
      );
      setUncategorisedQueue(newQueue);
      setUncategorisedTransactions(newQueue.length > 0 ? newQueue[0] : null);
    }
    setEditingTransaction(null);
  };

  const handleOnCloseModal = (transaction: ProcessedTransaction | Transaction) => {
    if (
      uncategorisedTransactions &&
      uncategorisedTransactions.company_name === transaction.company_name &&
      uncategorisedTransactions.date === transaction.date
    ) {
      const newQueue = uncategorisedQueue.filter(
        (t) => t.company_name !== uncategorisedTransactions.company_name
      );
      setUncategorisedQueue(newQueue);
      setUncategorisedTransactions(newQueue.length > 0 ? newQueue[0] : null);
    }
    setEditingTransaction(null);
  };

  const handleEditCategory = (transaction: ProcessedTransaction) => {
    setEditingTransaction(transaction);
  };

  const updateTransactionCategory = (
    companyName: string,
    selectedCategory: string,
    matchDate?: string
  ) => {
    const updatedTransactions = transactions.filter((t) =>
      t.company_name === companyName && (!matchDate || t.date === matchDate)
        ? { ...t, category: selectedCategory }
        : t
    );

    processTransactions(updatedTransactions);
    saveRule(companyName, selectedCategory);
  };

  const handleEditCategorySelect = (selectedCategory: string) => {
    if (!editingTransaction) return;
    updateTransactionCategory(
      editingTransaction.company_name,
      selectedCategory,
      editingTransaction.date
    );
    setEditingTransaction(null);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    if (!uncategorisedTransactions) return;
    updateTransactionCategory(uncategorisedTransactions.company_name, selectedCategory);

    const newQueue = uncategorisedQueue.filter(
      (t) => t.company_name !== uncategorisedTransactions.company_name
    );
    setUncategorisedQueue(newQueue);
    setUncategorisedTransactions(newQueue.length > 0 ? newQueue[0] : null);
  };

  return {
    transactions,
    categoryTotals,
    error,
    uncategorisedTransactions,
    editingTransaction,
    setError,
    handleFileUpload,
    handleDeleteTransaction,
    handleEditCategory,
    handleCategorySelect,
    handleEditCategorySelect,
    clearSavedRules,
    handleOnCloseModal,
    handleFileSelect,
    fileInputRef,
  };
}
