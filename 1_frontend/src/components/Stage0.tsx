/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Eraser, Send, Smile } from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { CreatePinMap } from "./MapComponent";
import EmojiPicker from "emoji-picker-react";
import { sendEvent } from "@/Utils/analytics";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Max message length is 500 characters."),
  amount: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(1000000, "Max amount is 1,000,000."),
});

const Stage0 = ({
  setShowModal,
  socketId,
  setStage,
  setInvoice,
  message,
  setMessage,
  amount,
  setAmount,
  setCenter,
  setMarker,
  center,
  marker,
}: {
  setShowModal: any;
  setStage: any;
  socketId: string | null;
  setInvoice: any;
  message: string;
  setMessage: any;
  amount: number;
  setAmount: any;
  setCenter: any;
  setMarker: any;
  center: any;
  marker: any;
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placeholder, setPlaceholder] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [loopNum, setLoopNum] = useState<number>(0);
  const [typingSpeed, setTypingSpeed] = useState<number>(150);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<number>(1440);

  const placeholders = [
    "What's your pin-worthy message?",
    "Drop a message, pin it to the map!",
    "What do you want the world to see? Pin it here!",
    "Type your thoughts, and they'll find their place on the map!",
    "Got a message? Pin it on the map!",
    "Your words, your pin—place it on the map!",
    "Say it here, pin it there!",
    "What will you pin on the map today?",
  ];

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % placeholders.length;
      const fullText = placeholders[i];
      setPlaceholder(
        isDeleting
          ? fullText.substring(0, placeholder.length - 1)
          : fullText.substring(0, placeholder.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);

    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, typingSpeed, loopNum]);

  const calculateActiveTime = (sats: number) => {
    const totalSeconds = sats * 60;

    const years = Math.floor(totalSeconds / (365 * 24 * 3600));
    const months = Math.floor(totalSeconds / (30 * 24 * 3600));
    let weeks = Math.floor((totalSeconds % (30 * 24 * 3600)) / (7 * 24 * 3600));
    let days = Math.floor((totalSeconds % (7 * 24 * 3600)) / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (sats == 40320) {
      weeks = 0;
      days = 0;
      return "1 month";
    }

    const timeUnits = [
      { value: years, label: "year" },
      { value: months, label: "month" },
      { value: weeks, label: "week" },
      { value: days, label: "day" },
      { value: hours, label: "hour" },
      { value: minutes, label: "minute" },
      { value: seconds, label: "second" },
    ];

    // Only show the top two largest non-zero units
    const filteredUnits = timeUnits.filter((unit) => unit.value > 0);

    const formattedUnits = filteredUnits
      .slice(0, 2) // Limit to the top two largest non-zero units
      .map((unit) => `${unit.value} ${unit.label}${unit.value > 1 ? "s" : ""}`)
      .join(", ");

    return formattedUnits || "less than a minute";
  };

  const fetchInvoice = async () => {
    const response = await axios.post(
      `${NEXT_PUBLIC_BACKEND_URL}/new-invoice`,
      {
        message,
        amount,
        websocket_id: socketId,
        lat_long: `${marker.lat},${marker.lng}`,
      }
    );
    setInvoice(response.data.invoiceData.serialized);
    sendEvent({
      action: "generate_invoice",
      category: "Ecommerce",
      label: "Invoice Generated",
    });
    setStage(1);
  };

  const handleSubmit = async () => {
    try {
      formSchema.parse({ message, amount });
      setErrors({});
      fetchInvoice();
    } catch (e: any) {
      const formattedErrors: Record<string, string> = {};
      e.errors.forEach((err: any) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
    }
  };

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage(message + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleTimeSelect = (value: number) => {
    setSelectedTime(value);
    setAmount(value);
  };

  return (
    <div className="flex flex-col space-y-2 w-full md:min-w-[600px] max-w-[700px] rounded-lg z-50">
      <h2 className="text-2xl font-bold text-white mb-2">
        Drop a pin on the map!
      </h2>

      <div className="">
        <textarea
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full text-gray-900 px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 h-32 resize-none"
        />

        <button
          type="button"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
          }}
          className="absolute bg-pink-400 rounded-full p-2 text-white mt-[8.5vh] -ml-[45px] hover:text-white hover:bg-pink-500"
        >
          <Smile size={20} />
        </button>

        {errors.message && (
          <p className="text-pink-500 text-sm">{errors.message}</p>
        )}

        {showEmojiPicker && (
          <div className="absolute z-10 ml-[250px]">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="number"
            placeholder="Sats"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="w-full text-gray-900 px-4 py-3 rounded-l-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
          />
          <span className="bg-purple-600 text-white px-4 py-3 rounded-r-md">
            sats
          </span>
        </div>

        {errors.amount && (
          <p className="text-pink-500 text-sm">{errors.amount}</p>
        )}

        <p className="text-indigo-200 text-sm">
          Marker will be active for:{" "}
          <span className="text-white font-bold">
            {calculateActiveTime(amount)}
          </span>
        </p>
      </div>

      <div className="flex space-x-2 justify-between mt-4">
        <button
          className={`w-full text-white px-4 py-2 rounded-full transition duration-200 ease-in-out flex items-center justify-center space-x-2 shadow-lg transform ${
            selectedTime === 1440
              ? "bg-gradient-to-r from-purple-600 to-pink-500"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => handleTimeSelect(1440)}
        >
          1 Day
        </button>
        <button
          className={`w-full text-white px-4 py-2 rounded-full transition duration-200 ease-in-out flex items-center justify-center space-x-2 shadow-lg transform ${
            selectedTime === 10080
              ? "bg-gradient-to-r from-purple-600 to-pink-500"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => handleTimeSelect(10080)}
        >
          1 Week
        </button>
        <button
          className={`w-full text-white px-4 py-2 rounded-full transition duration-200 ease-in-out flex items-center justify-center space-x-2 shadow-lg transform ${
            selectedTime === 40320
              ? "bg-gradient-to-r from-purple-600 to-pink-500"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => handleTimeSelect(40320)}
        >
          1 Month
        </button>
      </div>

      <CreatePinMap
        center={center}
        marker={marker}
        setCenter={setCenter}
        setMarker={setMarker}
      />

      <div className="flex space-x-2 flex-col md:flex-row gap-4">
        <button
          className="w-full text-gray-300 px-4 py-2 rounded-full hover:text-white transition duration-200 ease-in-out flex items-center justify-center space-x-2 transform"
          onClick={() => setShowModal(false)}
        >
          <Eraser className="w-5 h-5" />
          <span>Nevermind, abort!</span>
        </button>
        <button
          className="w-full text-white bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 rounded-full hover:from-purple-500 hover:to-pink-400 transition duration-200 ease-in-out font-semibold flex items-center justify-center space-x-2 shadow-lg transform"
          onClick={() => handleSubmit()}
        >
          <Send className="w-5 h-5" />
          <span>Drop a pin & send sats!</span>
        </button>
      </div>
    </div>
  );
};

export default Stage0;
