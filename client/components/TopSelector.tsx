import { useState } from "react";

interface TopSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TopSelector({ value, onChange }: TopSelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <label htmlFor="top" className="text-sm font-medium">Show Top:</label>
      <input
        type="number"
        min={1}
        id="top"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 border p-1 rounded"
      />
    </div>
  );
}
