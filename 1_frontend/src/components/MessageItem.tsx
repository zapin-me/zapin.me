import React, { useEffect } from "react";
import { Zap, Link as LinkIcon, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";
import { getRelativeTimeDifference } from "@/Utils/getRelativeTimeDifference";

type Message = {
  id: number;
  message: string;
  amount: number;
  lat_long: string;
  nostr_link: string;
  deactivate_at: string;
  updated_at: string;
  date: Date;
  active: boolean;
};

type MessageItemProps = {
  message: Message;
  isSelected: boolean;
  setActiveMarkerId: (id: number) => void;
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isSelected,
  setActiveMarkerId,
}) => {
  const [copied, setCopied] = useState(false);
  const [relativeDeactivateTime, setRelativeDeactivateTime] = useState(
    getRelativeTimeDifference(message.deactivate_at)
  );

  const backgroundColorClass = isSelected
    ? "bg-indigo-600"
    : message.active
    ? "bg-pink-500"
    : "bg-indigo-700 opacity-75";

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeDeactivateTime(
        getRelativeTimeDifference(message.deactivate_at)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [message.deactivate_at]);

  return (
    <div
      key={message.id}
      onClick={() => setActiveMarkerId(message.id)}
      className={`relative px-3 py-3 mb-2 text-white rounded-lg shadow-md w-full min-w-[200px] cursor-pointer transition-colors duration-200 ${backgroundColorClass} ${
        !isSelected ? "hover:bg-indigo-600" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <Zap className="w-3 h-3 text-yellow-500 mr-1" />
          <p className="text-xs text-yellow-500 font-semibold">
            {message.amount}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {message.nostr_link && (
            <div className="relative group">
              <a
                href={message.nostr_link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <SquareArrowOutUpRight className="w-3 h-3 cursor-pointer" />
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs rounded px-2 py-1">
                  Note
                </div>
              </a>
            </div>
          )}
          <div className="relative group">
            <LinkIcon
              className="w-3 h-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const url = `https://zapin.me/?pin=${message.id}`;
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs rounded px-2 py-1">
              {copied ? "Copied" : "Link"}
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-sm font-medium break-words">{message.message}</h2>

      <p className="text-[10px] text-gray-300 mt-1 text-right">
        {relativeDeactivateTime}
      </p>

      <div className="absolute top-2 right-2">
        {message.active ? (
          <span
            className="w-2 h-2 bg-green-400 rounded-full"
            title="Active"
          ></span>
        ) : (
          <span
            className="w-2 h-2 bg-gray-400 rounded-full"
            title="Inactive"
          ></span>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
