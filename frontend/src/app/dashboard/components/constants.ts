import { PredefinedTransactions } from "./types";

export const PREDEFINED_INCOME: PredefinedTransactions[] = [
  {
    name: "Wage",
    logo: "CircleDollarSign",
  },
  {
    name: "Extra",
    logo: "Banknote",
  },
  {
    name: "Investments",
    logo: "ChartLine",
  },
];

export const PREDEFINED_EXPENSES: PredefinedTransactions[] = [
  {
    name: "Rent",
    logo: "House",
  },
  {
    name: "Utilities",
    logo: "Plug",
  },
  {
    name: "Food and Drinks",
    logo: "Apple",
  },
  {
    name: "Transport",
    logo: "Car",
  },
  {
    name: "Health",
    logo: "HeartPulse",
  },
  {
    name: "Clothing",
    logo: "Shirt",
  },
  {
    name: "Debt",
    logo: "Landmark",
  },
  {
    name: "Leisure",
    logo: "Cat",
  },
];

export const DEFAULT_CATEGORY_RULES = {
  WOOLWORTHS: "Food and Drinks",
  COLES: "Food and Drinks",
  ALDI: "Food and Drinks",
  "UBER EATS": "Food and Drinks",
  "UBER *": "Transport",
  NETFLIX: "Leisure",
  SPOTIFY: "Leisure",
  MEDICARE: "Health",
  CHEMIST: "Health",
  AMZNPRIMEAU: "Utilities",
  BAKERY: "Food and Drinks",
  "ANYTIME FITNESS": "Health",
  KFC: "Food and Drinks",
  SALARY: "Wage",
  PAYPAL: "Extra",
  STAKE: "Investments",
};

export const STORAGE_KEY = "SpendingTrackerRules";
