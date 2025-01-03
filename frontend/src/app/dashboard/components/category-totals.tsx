"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleDollarSign,
  Banknote,
  ChartLine,
  House,
  Plug,
  Apple,
  Car,
  HeartPulse,
  Shirt,
  Landmark,
  Cat,
  LucideIcon,
} from "lucide-react";
import React from "react";
import { PREDEFINED_EXPENSES, PREDEFINED_INCOME } from "./constants";

interface CategoryTotals {
  [key: string]: number;
}

type CategoryIcons = {
  [key: string]: LucideIcon;
};

interface CategoryTotalsProps {
  categoryTotals: CategoryTotals;
}

const CategoryTotals: React.FC<CategoryTotalsProps> = ({ categoryTotals }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const incomeTotal: CategoryTotals = {};
  const expenseTotal: CategoryTotals = {};
  let totalIncome: number = 0;
  let totalExpense: number = 0;

  const incomeCategories: string[] = ["Wage", "Extra", "Ivestments"];

  Object.entries(categoryTotals).forEach(([category, amount]) => {
    if (incomeCategories.includes(category)) {
      incomeTotal[category] = amount;
      totalIncome += amount;
    } else {
      expenseTotal[category] = amount;
      totalExpense += amount;
    }
  });

  const icons: CategoryIcons = {
    Wage: CircleDollarSign,
    Extra: Banknote,
    Investments: ChartLine,
    Rent: House,
    Utilities: Plug,
    "Food and Drinks": Apple,
    Transport: Car,
    Health: HeartPulse,
    Clothing: Shirt,
    Debt: Landmark,
    Leisure: Cat,
  };

  const getIcon = (category: string): React.ReactNode => {
    const IconComponent = icons[category];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const netAmount = totalIncome + totalExpense;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <div className="flex-col space-y-2">
              <div>
                <p className="text font-semibold text-right">
                  Total Income
                  <span className="text-lg font-bold ml-3 text-green-600">
                    + {formatCurrency(totalIncome)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm  font-semibold text-right">
                  Total Expense
                  <span className="text-lg font-bold ml-3 text-red-600">
                    {formatCurrency(totalExpense)}
                  </span>
                </p>
              </div>
              <hr />
              <div>
                <p className="text-sm  font-semibold text-right">
                  Net Amount (Profit)
                  <span
                    className={`text-lg font-bold ml-3 ${
                      netAmount >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(netAmount)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Income categories */}
        <Card>
          <CardHeader>
            <CardTitle>Income Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PREDEFINED_INCOME.map((category) => {
                const amount = incomeTotal[category.name] || 0;
                return (
                  <div key={category.name} className="flex justify-between">
                    <div className="flex items-center gap-2">
                      {getIcon(category.name)}
                      <span>{category.name}</span>
                    </div>
                    <span className="font-semibold text-green-600">{formatCurrency(amount)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Expense categories */}
        <Card>
          <CardHeader>
            <CardTitle>Income Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PREDEFINED_EXPENSES.map((category) => {
                const amount = expenseTotal[category.name] || 0;
                return (
                  <div key={category.name} className="flex justify-between">
                    <div className="flex items-center gap-2">
                      {getIcon(category.name)}
                      <span>{category.name}</span>
                    </div>
                    <span className="font-semibold text-green-600">{formatCurrency(amount)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryTotals;
