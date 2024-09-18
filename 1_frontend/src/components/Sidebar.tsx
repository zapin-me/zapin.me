"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Filter,
  X,
  Zap,
  Link as LinkIcon,
  SquareArrowOutUpRight,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Input } from "./ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import MotionNumber from "motion-number";

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

type SortOption = "dateAsc" | "dateDesc" | "satsAsc" | "satsDesc";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  messages: Message[];
  setActiveMarkerId: (id: number) => void;
  activeMarkerId: number;
};

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  messages,
  setActiveMarkerId,
  activeMarkerId,
}: SidebarProps) {
  const [filters, setFilters] = useState({
    search: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    status: "all",
    minSats: 0,
  });
  const [sortOption, setSortOption] = useState<SortOption>("dateDesc");
  const [copied, setCopied] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const placeholderMessages = [
    "Search for messages...",
    "Looking for something?",
    "Type to search messages",
    "Find a specific message",
    "Search by keywords...",
    "What are you searching for?",
    "Filter messages here...",
  ];

  const [randomPlaceholder] = useState(() => {
    const randomIndex = Math.floor(Math.random() * placeholderMessages.length);
    return placeholderMessages[randomIndex];
  });

  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout>;

    if (charIndex < randomPlaceholder.length) {
      typingTimeout = setTimeout(() => {
        setDisplayedPlaceholder((prev) => prev + randomPlaceholder[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, randomPlaceholder]);

  const processedMessages = useMemo(() => {
    return messages.map((msg) => {
      const date = new Date(msg.updated_at);
      const deactivateAt = new Date(parseInt(msg.deactivate_at) * 1000);
      const active = deactivateAt > new Date();

      return {
        ...msg,
        date,
        active,
      };
    });
  }, [messages]);

  const resetFilters = () => {
    setFilters({
      search: "",
      startDate: undefined,
      endDate: undefined,
      status: "all",
      minSats: 0,
    });
    setIsPopoverOpen(false);
  };

  const filteredMessages = processedMessages.filter((message) => {
    const matchesSearch = message.message
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && message.active) ||
      (filters.status === "inactive" && !message.active);

    const matchesMinSats = message.amount >= filters.minSats;

    const matchesDateRange =
      (!filters.startDate || message.date >= filters.startDate) &&
      (!filters.endDate || message.date <= filters.endDate);

    return matchesSearch && matchesStatus && matchesMinSats && matchesDateRange;
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    switch (sortOption) {
      case "dateAsc":
        return a.date.getTime() - b.date.getTime();
      case "dateDesc":
        return b.date.getTime() - a.date.getTime();
      case "satsAsc":
        return a.amount - b.amount;
      case "satsDesc":
        return b.amount - a.amount;
      default:
        return 0;
    }
  });

  const isFiltersApplied =
    filters.search !== "" ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined ||
    filters.status !== "all" ||
    filters.minSats !== 0;

  return (
    <div
      className={`fixed top-0 left-0 h-[calc(100vh-56px)] bg-indigo-800 border-r border-indigo-700 flex flex-col py-1 px-2 transition-transform duration-300 z-40 md:-z-1 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 md:w-80`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-white md:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-2 p-2 mt-2">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={displayedPlaceholder}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-grow bg-white text-indigo-800 placeholder:text-indigo-800"
          />
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className={`p-2 ${
                  isFiltersApplied ? "text-pink-500" : "text-white"
                } hover:text-pink-500 transition-colors duration-200`}
              >
                <Filter className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-100 bg-indigo-800 border border-indigo-700 text-white">
              <div className="space-y-4 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="flex items-center px-2 py-1 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md transition-colors duration-200"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Status
                  </label>
                  <select
                    className="w-full mt-1 rounded-md border bg-indigo-700 text-white px-3 py-2 text-sm"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 flex flex-row">
                    Minimum Amount:{" "}
                    <span>
                      <Zap className="w-3 h-5 text-yellow-500 ml-2" />
                    </span>
                    <span className="ml-1 tabular-nums">
                      <MotionNumber
                        value={filters.minSats}
                        format={{ notation: "compact" }}
                        locales="en-US"
                      />
                    </span>
                  </label>
                  <Slider
                    min={0}
                    max={2000}
                    step={100}
                    value={[filters.minSats]}
                    onValueChange={(value) =>
                      setFilters({ ...filters, minSats: value[0] })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Date Range
                  </label>
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: filters.startDate,
                      to: filters.endDate,
                    }}
                    onSelect={(range) => {
                      if (range) {
                        const { from, to } = range;
                        setFilters({
                          ...filters,
                          startDate: from,
                          endDate: to,
                        });
                      } else {
                        setFilters({
                          ...filters,
                          startDate: undefined,
                          endDate: undefined,
                        });
                      }
                    }}
                    className="rounded-md border bg-indigo-700 text-white mt-1"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-full bg-white text-indigo-800">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white text-indigo-800">
            <SelectItem value="dateDesc">Date (Newest First)</SelectItem>
            <SelectItem value="dateAsc">Date (Oldest First)</SelectItem>
            <SelectItem value="satsDesc">Sats (Highest First)</SelectItem>
            <SelectItem value="satsAsc">Sats (Lowest First)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-grow overflow-auto p-2 space-y-2">
        {messages.length === 0 ? (
          <div className="flex justify-start mt-10 items-center flex-col">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
            <p className="text-white ml-2">Loading...</p>
          </div>
        ) : (
          sortedMessages.map((message, index) => {
            const isActive = message.id === activeMarkerId;
            const backgroundColorClass = isActive
              ? "bg-indigo-600"
              : message.active
              ? "bg-pink-500"
              : "bg-indigo-700";

            return (
              <div
                key={index}
                onClick={() => setActiveMarkerId(message.id)}
                className={`relative px-3 py-3 text-white rounded-lg shadow-md w-full min-w-[200px] cursor-pointer transition-colors duration-200 ${backgroundColorClass} ${
                  !isActive ? "hover:bg-indigo-600" : ""
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
                  </div>
                </div>
                <h2 className="text-sm font-medium break-words">
                  {message.message}
                </h2>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;
