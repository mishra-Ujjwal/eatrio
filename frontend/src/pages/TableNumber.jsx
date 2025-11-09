import React, { useState } from "react";

const TableNumber = ({ onProceed }) => {
  const [tableNumber, setTableNumber] = useState("");

  const handleProceed = () => {
    if (!tableNumber) {
      alert("Please enter a table number");
      return;
    }
    if (onProceed) onProceed(tableNumber); // send table number to parent
    console.log("Table Number Selected:", tableNumber);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Enter Your Table Number</h2>
      <input
        type="number"
        placeholder="Table Number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        className="px-4 py-2 border rounded-lg mb-4 w-48 text-center"
      />
      <button
        onClick={handleProceed}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Proceed
      </button>
    </div>
  );
};

export default TableNumber;
