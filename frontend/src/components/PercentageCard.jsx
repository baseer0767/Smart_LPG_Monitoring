import React, { useState, useEffect } from "react";
import LPGCylinderLevel from "./LPGCylinderLevel";

const PercentageCard = ({ level }) => {
  // const [gasLevel, setGasLevel] = useState(level);

  return (
    <div
      className="relative overflow-hidden rounded-xl p-6 border border-black/20 
        shadow-lg backdrop-blur-lg bg-white/5 transition-all duration-300 
        hover:-translate-y-1 hover:shadow-xl 
  
        before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1"
    >
      {/* Header */}
      <div className="flex justify-between items-center ">
        <h3 className="text-black text-xl font-semibold">Current Percentage</h3>
        <div className="text-black/80 text-2xl">%</div>
      </div>

      {/* Value */}
      <LPGCylinderLevel
        level={level}
        height={300}
        width={150}
        showPercentage={true}
        showStatus={true}
      />
    </div>
  );
};

export default PercentageCard;
