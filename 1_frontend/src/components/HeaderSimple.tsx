import { ArrowLeft } from "lucide-react";

import Link from "next/link";

const HeaderSimple = ({
  version,
}: {
  version: string;
  aboutLink: string;
  githubLink: string;
}) => {
  return (
    <div className="flex items-center px-8 py-2 w-full bg-indigo-700 shadow-2xl sticky top-0 h-[56px]">
      <Link href="/" className="flex items-center">
        <h1 className="text-3xl font-bold text-white">zapin.me</h1>
      </Link>
      <span className="text-pink-100 text-[10px] mt-3 ml-1">v{version}</span>
      <div className="flex-1" />
      <div className="flex items-center text-white space-x-6 gap-1">
        <Link
          href="/"
          className="text-white hover:text-pink-100 transition duration-200"
        >
          <div className="flex flex-row items-center">
            <ArrowLeft size={20} className="text-purple-300" />
            <span className="ml-2 tabular-nums">Back</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HeaderSimple;
