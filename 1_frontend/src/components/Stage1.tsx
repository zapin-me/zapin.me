import { ArrowLeft, Loader } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

const Stage1 = ({
  invoice,
  setStage,
  setInvoice,
}: {
  invoice: string | null;
  setStage: (stage: number) => void;
  setInvoice: (invoice: string | null) => void;
}) => {
  const hoverTextDefault = "Scan the QR code or click on it to copy.";

  const [hoverText, setHoverText] = useState(hoverTextDefault);
  const [isCopied, setIsCopied] = useState(false);

  const handleMouseEnter = () => {
    setHoverText("Click to copy to clipboard.");
  };

  const handleMouseLeave = () => {
    if (!isCopied) {
      setHoverText(hoverTextDefault);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(invoice || "");
    setIsCopied(true);
    setHoverText("Copied to clipboard!");

    setTimeout(() => {
      setIsCopied(false);
      setHoverText(hoverTextDefault);
    }, 4000);
  };

  return (
    <>
      {invoice ? (
        <div className="flex flex-col items-center bg-indigo-800 rounded-lg p-4 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3 text-center">
            Your invoice is ready!
          </h2>

          <div className="flex items-center justify-center mb-4">
            <Loader className="animate-spin text-purple-300" size={22} />
            <p className="text-purple-300 ml-2">Waiting for payment...</p>
          </div>

          <div
            className="bg-indigo-700 p-4 rounded-lg shadow-lg mb-6 cursor-pointer"
            onClick={handleCopy}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <QRCode
              value={invoice}
              size={256}
              fgColor="#ffffff"
              bgColor="#4C51BF"
            />
          </div>
          <p className="text-sm text-purple-300 mb-0 text-center">
            {hoverText}
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-400">Generating invoice...</p>
        </div>
      )}
      <div className="w-full flex justify-center mt-2">
        <button
          className="w-full text-gray-300 px-4 py-2 rounded-full hover:text-white transition duration-200 ease-in-out flex items-center justify-center space-x-2"
          onClick={() => {
            setStage(0);
            setInvoice(null);
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>
    </>
  );
};

export default Stage1;
