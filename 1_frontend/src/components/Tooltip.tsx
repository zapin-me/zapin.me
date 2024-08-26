import React, { useState } from "react";

const Tooltip = ({
  children,
  tooltipText,
}: {
  children: React.ReactNode;
  tooltipText: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block hover:cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {isHovered && (
        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-pink-400 text-white text-xs py-1 px-2 rounded-md shadow-lg z-10 whitespace-nowrap text-center">
          {tooltipText}
          <div className="absolute top-[-5px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-0 border-b-[5px] border-b-pink-400 border-x-[5px] border-x-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
