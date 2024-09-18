import {
  GithubIcon,
  InfoIcon,
  MapPinCheckInside,
  MapPinPlusIcon,
  Tv,
  Menu, // Import the Menu icon
} from "lucide-react";

import Tooltip from "@/components/Tooltip";
import Link from "next/link";
import MotionNumber from "motion-number";

const Header = ({
  setShowModal,
  usersConnected,
  totalPins,
  activePins,
  version,
  setSidebarOpen, // Receive setSidebarOpen as a prop
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  usersConnected: number;
  totalPins: number;
  activePins: number;
  version: string;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>; // Add setSidebarOpen to props type
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center px-4 sm:px-8 py-2 w-full bg-indigo-700 shadow-2xl h-auto md:h-[56px] space-y-1 sm:space-y-0">
      <div className="flex md:justify-between md:items-center w-full md:w-auto">
        {/* Menu button for mobile devices */}
        <button
          className="md:hidden mr-2 order-4"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} className="text-white" />
        </button>
        <div className="grow order-3"></div>
        <Link href="/" className="flex items-center order-1">
          <h1 className="text-3xl lg:text-3xl font-bold text-white ">
            zapin.me
          </h1>
        </Link>
        <span className="text-pink-100 text-[10px] ml-1 md:pt-[14px] order-2">
          v{version}
        </span>
      </div>
      <div className="flex-1 mt-0" />
      <div className="flex w-full justify-between md:justify-end pt-0 md:pt-0">
        <div className="flex text-white flex-row flex-wrap items-center justify-center sm:justify-end space-x-4 sm:space-x-6 gap-1">
          <Link
            href={"/about"}
            className="text-white hover:text-pink-100 transition duration-200"
          >
            <div className="flex flex-row items-center">
              <InfoIcon size={20} className="text-purple-300" />
              <span className="ml-2 text-sm sm:text-base hidden lg:block">
                About
              </span>
            </div>
          </Link>
          <Link
            href={"https://github.com/miguelmedeiros/zapin.me"}
            target="_blank"
            className="text-white hover:text-pink-100 transition duration-200"
          >
            <div className="flex flex-row items-center">
              <GithubIcon size={20} className="text-purple-300" />
              <span className="ml-2 text-sm sm:text-base hidden lg:block">
                Contribute
              </span>
            </div>
          </Link>
          <Tooltip tooltipText={`Active pins: ${activePins}`}>
            <div className="flex flex-row items-center">
              <MapPinCheckInside size={20} className="text-purple-300" />
              <span className="ml-2 text-sm sm:text-base tabular-nums">
                <MotionNumber
                  value={totalPins}
                  format={{ notation: "compact" }}
                  locales="en-US"
                />
              </span>
            </div>
          </Tooltip>
          <Tooltip tooltipText={`Users online`}>
            <div className="flex flex-row items-center">
              <Tv size={20} className="text-purple-300" />
              <span className="ml-2 text-sm sm:text-base tabular-nums">
                <MotionNumber
                  value={usersConnected}
                  format={{ notation: "compact" }}
                  locales="en-US"
                />
              </span>
            </div>
          </Tooltip>
        </div>
        <div className="mt-0 ml-0 md:ml-6">
          <button
            className="flex items-center flex-row text-white bg-pink-500 px-3 sm:px-4 py-2 rounded-full hover:bg-pink-600 transition duration-200"
            onClick={() => setShowModal(true)}
          >
            <MapPinPlusIcon size={18} className="mr-2 text-white" />
            <span className="text-sm sm:text-base">Pin a message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
