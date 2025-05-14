import React from "react";

interface ProgressProps {
    value: number;
    className?: string;
    indicatorClassName?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className, indicatorClassName }) => {
    return (
      <div className={`w-full h-2 bg-gray-300 rounded-full ${className}`}>
        <div
          className={`h-full rounded-full ${indicatorClassName}`}
          style={{ width: `${value}%` }}
        />
      </div>
    );
  };
  
export default Progress;
