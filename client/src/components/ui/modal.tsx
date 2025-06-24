import clsx from "clsx";
import Button from "./button";
import { FaX } from "react-icons/fa6";

function ModalHeader({ onClose, className, children }: any) {
  return (
    <div className="p-4">
      <Button
        type="button"
        className="absolute top-3 right-0"
        onClick={onClose}
      >
        <FaX className="text-gray-600 text-sm" />
      </Button>
      <span className={clsx("text-xl font-bold text-gray-600", className)}>
        {children}
      </span>
    </div>
  );
}

function ModalFooter({ children }: any) {
  return (
    <div className="py-2 px-5 flex justify-end">
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

function ModalBody({ children }: any) {
  return (
    <div className="p-4 border-y border-gray-300 max-h-[80vh] overflow-x-hidden overflow-y-auto">
      {children}
    </div>
  );
}

function Modal({ isOpen, className, ref, children }: any) {
  if (!isOpen) return;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        ref={ref}
        className={clsx("bg-white min-w-sm w-2/6 rounded-md relative", className)}
      >
        <div>{children}</div>
      </div>
    </div>
  );
}

export { Modal, ModalHeader, ModalFooter, ModalBody };
