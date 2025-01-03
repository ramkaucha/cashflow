import AnimatedCloseButton from "./animated-close-button";

export default function ErrorAlert({
  message,
  handleClose,
}: {
  message: string;
  handleClose: () => void;
}) {
  return (
    <div
      className="flex justify-between bg-red-100 border border-red-400 text-red-700 px-4 rounded relative mb-4"
      role="alert"
    >
      <div className="py-3">
        <strong className="font-bold">ERROR! </strong>
        <span className="block sm:inline">{message}</span>
      </div>
      <div className="py-2">
        <AnimatedCloseButton onClick={handleClose} />
      </div>
    </div>
  );
}
