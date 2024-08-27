import {
  GithubIcon,
  InfoIcon,
  MapPinCheckInside,
  MapPinPlusIcon,
  Tv,
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
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  usersConnected: number;
  totalPins: number;
  activePins: number;
  version: string;
}) => {
  return (
    <div className="flex items-center px-8 py-2 w-full bg-indigo-700 shadow-2xl h-[56px]">
      <Link href="/" className="flex items-center">
        <h1 className="text-3xl font-bold text-white">zapin.me</h1>
      </Link>
      <span className="text-pink-100 text-[10px] mt-3 ml-1">v{version}</span>
      <div className="flex-1" />
      <div className="flex items-center text-white space-x-6 gap-1">
        <Link
          href={"/about"}
          className="text-white hover:text-pink-100 transition duration-200"
        >
          <div className="flex flex-row items-center">
            <InfoIcon size={20} className="text-purple-300" />
            <span className="ml-2 tabular-nums">About</span>
          </div>
        </Link>
        <Link
          href={"https://github.com/miguelmedeiros/zapin.me"}
          target="_blank"
          className="text-white hover:text-pink-100 transition duration-200"
        >
          <div className="flex flex-row items-center">
            <GithubIcon size={20} className="text-purple-300" />
            <span className="ml-2 tabular-nums">Contribute</span>
          </div>
        </Link>
        <Tooltip tooltipText={`Active pins: ${activePins}`}>
          <div className="flex flex-row items-center">
            <MapPinCheckInside size={20} className="text-purple-300" />
            <span className="ml-2 tabular-nums">
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
            <span className="ml-2 tabular-nums">
              <MotionNumber
                value={usersConnected}
                format={{ notation: "compact" }}
                locales="en-US"
              />
            </span>
          </div>
        </Tooltip>
      </div>
      <div className="ml-8">
        <button
          className="flex items-center flex-row text-white bg-pink-500 px-4 py-2 rounded-full hover:bg-pink-600 transition duration-200"
          onClick={() => setShowModal(true)}
        >
          <MapPinPlusIcon size={20} className="mr-2 text-white" />
          Pin a message
        </button>
      </div>
    </div>
  );
};

export default Header;
