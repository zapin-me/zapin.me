import React, { useEffect, useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export default function ConfettiExplosion() {
  const { width, height } = useWindowSize();
  const colors = ["#E640A3", "#5A2D83", "#A059CF", "#E7E4E8", "#FFD700"];

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !width || !height) return null;

  return (
    <Confetti
      width={width - 10}
      height={height}
      colors={colors}
      opacity={0.75}
      gravity={0.05}
      recycle={false}
      tweenDuration={15000}
      numberOfPieces={1000}
    />
  );
}
