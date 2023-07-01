import React, { useState } from "react";

const Payment = () => {
  const [amount, setAmount] = useState(0);
  const handleSubmit = (e) => {
    e.preventDefault();

    // send user ndf badge page
    console.log(`Thanks for your contribution:\n${amount} ETH`);
    setAmount(0);
  };
  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="amount"
          >
            Choose Amount
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0.01}
            step={0.01}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
