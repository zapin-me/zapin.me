import { useRef } from "react";

const PopUpModal = ({
  showModal,
  setShowModal,
  children,
  setInvoice,
  setStage,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  children: any;
  setInvoice: any;
  setStage: any;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowModal(false);
      setInvoice(null);
      setStage(0);
    }
  };

  if (!showModal) return null;
  return (
    <div
      className="fixed inset-0 bg-indigo-700 bg-opacity-80 flex items-center justify-center w-full m-auto overflow-y-auto z-50"
      onMouseDown={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-indigo-800 p-6 rounded-lg shadow-lg max-w-[720px] max-h-[90vh] overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default PopUpModal;
