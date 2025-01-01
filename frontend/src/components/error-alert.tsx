import { X } from 'lucide-react'

export default function ErrorAlert({ message, handleClose } : { message: string, handleClose: () => void }) {
	return (
		<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
			<strong className="font-bold">Error!</strong>
			<span className="block sm:inline">{message}</span>
			<button className="top-0 bottom-0 right-0 px-4 py-3" onClick={handleClose}>
				<X className="h-4 w-4" />
			</button>
		</div>
	)
}