import {ProcessedTransaction} from "@/app/dashboard/components/types";
import {AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogTitle} from "@/components/ui/alert-dialog";
import {PREDEFINED_EXPENSES} from "@/app/dashboard/components/constants";


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
	if (!transaction) return;
	
	return (
		<AlertDialog open={!!transaction}>
			<AlertDialogContent>
				<AlertDialogTitle>{title}: {transaction.company_name} : ${transaction.amount}</AlertDialogTitle>
			<div className="grid grid-cols-3 gap-4 py-4">
				{PREDEFINED_EXPENSES.map((category) => (
					<AlertDialogAction
						key={category}
						className='bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 h-20'
						onClick={() => onSelect(category)}
					>
						{category}
					</AlertDialogAction>
				))}
			</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}