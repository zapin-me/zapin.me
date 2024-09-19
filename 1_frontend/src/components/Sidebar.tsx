/* Sidebar.tsx */
import React, { useState, useMemo, useEffect } from "react";
import { Filter, X, Zap, Loader2, RotateCcw } from "lucide-react";
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
import MessageItem from "./MessageItem";

type Message = {
  id: number;
  message: string;
  amount: number;
  lat_long: string;
  nostr_link: string;
  deactivate_at: string; // Unix timestamp in seconds as string
  updated_at: string; // ISO string
  date: Date;
  active: boolean;
};

type SortOption = "dateAsc" | "dateDesc" | "satsAsc" | "satsDesc";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMessages: Message[];
  inactiveMessages: Message[];
  loadingActive: boolean;
  loadingInactive: boolean;
  setActiveMarkerId: (id: number) => void;
  activeMarkerId: number;
};

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeMessages,
  inactiveMessages,
  loadingActive,
  loadingInactive,
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
  const [sortOption, setSortOption] = useState<SortOption>("satsDesc");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const placeholderMessages = [
    "Search for markers...",
    "Looking for something?",
    "Type to search markers",
    "Find a specific marker",
    "Search by keywords...",
    "What are you searching for?",
    "Filter markers here...",
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

  // Combine active and inactive messages for processing
  const combinedMessages = useMemo(() => {
    return [...activeMessages, ...inactiveMessages].map((msg) => {
      const date = new Date(msg.updated_at);
      const deactivateAt = new Date(parseInt(msg.deactivate_at, 10) * 1000);
      const isActive = deactivateAt > new Date();

      return {
        ...msg,
        date,
        active: isActive,
      };
    });
  }, [activeMessages, inactiveMessages]);

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

  const filteredMessages = useMemo(() => {
    return combinedMessages.filter((message) => {
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

      return (
        matchesSearch && matchesStatus && matchesMinSats && matchesDateRange
      );
    });
  }, [combinedMessages, filters]);

  const sortedMessages = useMemo(() => {
    return [...filteredMessages].sort((a, b) => {
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
  }, [filteredMessages, sortOption]);

  const isFiltersApplied =
    filters.search !== "" ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined ||
    filters.status !== "all" ||
    filters.minSats !== 0;

  const sortedActiveMessages = useMemo(() => {
    return sortedMessages.filter((msg) => msg.active);
  }, [sortedMessages]);

  const sortedInactiveMessages = useMemo(() => {
    return sortedMessages.filter((msg) => !msg.active);
  }, [sortedMessages]);

  return (
    <div
      className={`fixed overflow-x-hidden top-0 left-0 h-[calc(100vh-56px)] bg-indigo-800 border-r border-indigo-700 flex flex-col py-1 px-2 transition-transform duration-300 z-40 md:-z-1 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 md:w-80`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-white md:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Filters and Sorting */}
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

      {/* Markers List */}
      <div className="flex-grow overflow-auto p-2 space-y-4">
        {/* Active Markers Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">Active</h2>
          </div>
          {loadingActive ? (
            <div className="flex justify-start mt-2 items-center flex-col">
              <Loader2 className="w-6 h-6 text-white animate-spin mb-1" />
              <p className="text-white text-sm">Loading active markers...</p>
            </div>
          ) : sortedActiveMessages.length === 0 ? (
            <div className="flex justify-start mt-2 items-center flex-col">
              <p className="text-white text-sm">No active markers found.</p>
            </div>
          ) : (
            sortedActiveMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isSelected={message.id === activeMarkerId}
                setActiveMarkerId={setActiveMarkerId}
              />
            ))
          )}
        </div>

        {/* Inactive Markers Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">Inactive</h2>
          </div>
          {loadingInactive ? (
            <div className="flex justify-start mt-2 items-center flex-col">
              <Loader2 className="w-6 h-6 text-white animate-spin mb-1" />
              <p className="text-white text-sm">Loading inactive markers...</p>
            </div>
          ) : sortedInactiveMessages.length === 0 ? (
            <div className="flex justify-start mt-2 items-center flex-col">
              <p className="text-white text-sm">No inactive markers found.</p>
            </div>
          ) : (
            sortedInactiveMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isSelected={message.id === activeMarkerId}
                setActiveMarkerId={setActiveMarkerId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
