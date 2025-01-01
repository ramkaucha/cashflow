'use client';

import {PredefinedTransactions, ProcessedTransaction, LucideIconName} from "@/app/dashboard/components/types";
import {AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogTitle} from "@/components/ui/alert-dialog";
import {PREDEFINED_EXPENSES, PREDEFINED_INCOME} from "@/app/dashboard/components/constants";
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useState } from "react";


interface CategoryModalProps {
	transaction: ProcessedTransaction | null;
	title: string;
	onSelect: (category: string) => void;
}

export default function CategoryModal({
	transaction,
	title,
	onSelect
}: CategoryModalProps
) {
	const [ showAll, setShowAll ] = useState(false);

	if (!transaction) return null;

	const renderIcon = (iconName: LucideIconName) => {
		const IconComponent = LucideIcons[iconName] as LucideIcon;
		
		return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
	}
	
	return (
		<AlertDialog open={!!transaction}>
			<AlertDialogContent>
				<div className="flex items-center justify-between mb-2">
					<AlertDialogTitle>
						{title}:
					</AlertDialogTitle>
					<button
						onClick={() => setShowAll(!showAll)}
						className="text-sm text-blue-800 hover:text-blue-500 underline"
					>
						{ showAll ? 'Show Default' : 'Show All'}
					</button>
				</div>
				<div>
					Transaction: {transaction.company_name}<br/>
					Date: {transaction.date} <br />
					Amount: {" "}
					<span className={transaction.amount <= 0 ? 'text-red-500' : 'text-green-500'}>
						$ {transaction.amount}
					</span>
				</div>
				{
					showAll ? (
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
										className='flex flex-col bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 h-20'
										onClick={() => onSelect(category.name)}
									>
										{renderIcon(category.logo)}
										<span>{category.name}</span>
									</AlertDialogAction>
								))}
							</div>
						</div>
					) : (
					 transaction.amount > 0 ? (
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
										className='flex flex-col bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 h-20'
										onClick={() => onSelect(category.name)}
									>
										{renderIcon(category.logo)}
										<span>{category.name}</span>
									</AlertDialogAction>
								))}
							</div>
						</div>
						)
					)
				}
			</AlertDialogContent>
		</AlertDialog>
	);
}