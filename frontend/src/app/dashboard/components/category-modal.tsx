import {PredefinedTransactions, ProcessedTransaction, LucideIconName} from "@/app/dashboard/components/types";
import {AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogTitle} from "@/components/ui/alert-dialog";
import {PREDEFINED_EXPENSES, PREDEFINED_INCOME} from "@/app/dashboard/components/constants";
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';


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
	if (!transaction) return null;

	const renderIcon = (iconName: LucideIconName) => {
		const IconComponent = LucideIcons[iconName] as LucideIcon;
		
		return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
	}
	
	return (
		<AlertDialog open={!!transaction}>
			<AlertDialogContent>
				<AlertDialogTitle>
					{title}: {transaction.company_name} : {" "}
					<span className={transaction.amount <= 0 ? 'text-red-500' : 'text-green-500'}>
						$ {transaction.amount}
					</span>
				</AlertDialogTitle>
			{ transaction.amount > 0 ? (
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
			}
			</AlertDialogContent>
		</AlertDialog>
	);
}