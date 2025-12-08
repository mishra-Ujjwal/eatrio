import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-300 animate-pulse rounded-md ${className}`}></div>
);

const KycPage = () => {
  const { id: restaurantId } = useParams();

  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(false);

  const [bankCards, setBankCards] = useState([]);
  const [current, setCurrent] = useState(0);

  const [isLoadingBank, setIsLoadingBank] = useState(true);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);

  const [focused, setFocused] = useState(null); // highlight active input

  const [form, setForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    panNumber: "",
    makeDefault: false,
  });

  // ------------------ FETCH BANKS ------------------
  const fetchBanks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wallet/${restaurantId}/banks`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setBankCards(res.data.bankAccounts);
        setCurrent(0);
      }
    } finally {
      setIsLoadingBank(false);
    }
  };

  // ------------------ FETCH WALLET ------------------
  const fetchWallet = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wallet/${restaurantId}`,
        { withCredentials: true }
      );
      if (res.data.success) setWallet(res.data.wallet);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  useEffect(() => {
    fetchBanks();
    fetchWallet();
  }, []);

  // ------------------ DELETE BANK ------------------
  const handleDelete = async () => {
    const bank = bankCards[current];
    if (!bank) return;

    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/wallet/${restaurantId}/bank/${bank._id}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      setBankCards(res.data.bankAccounts);
      setCurrent(0);
    }
  };

  // ------------------ ADD BANK ------------------
  const handleAddBank = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/wallet/add-bank`,
      { restaurantId, ...form },
      { withCredentials: true }
    );

    if (res.data.success) {
      setBankCards(res.data.bankAccounts);
      setForm({
        accountHolderName: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
        panNumber: "",
        makeDefault: false,
      });
      setCurrent(res.data.bankAccounts.length - 1);
    }
  };

const handleWithdraw = async () => {
  if (Number(amount) <= 0) return alert("Enter valid amount");

  const selectedBank = bankCards[current];
  if (!selectedBank) return alert("Please select a bank");

  setLoading(true);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/wallet/withdraw`,
      {
        restaurantId,
        amount,
        bankAccountId: selectedBank._id,
      },
      { withCredentials: true }
    );

    setLoading(false);

    if (res.data.success) {
      alert("Payout Initiated Successfully!");
      setAmount("");
      fetchWallet();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    setLoading(false);
    alert(err.response?.data?.error || "Withdrawal failed");
  }
};


  // ------------------ AUTO FILL FORM ------------------
  const handleCardClick = () => {
    const b = bankCards[current];
    if (!b) return;

    setForm({
      accountHolderName: b.accountHolderName,
      accountNumber: b.accountNumber,
      ifsc: b.ifsc,
      bankName: b.bankName,
      panNumber: b.panNumber,
      makeDefault: b.isDefault || false,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-10 py-10 ">

      {/* LEFT AREA */}
      <div className="sm:w-1/2 w-full flex flex-col justify-center items-center relative">
{!isLoadingBank && bankCards.length > 0 && (
    <p className="mb-3 text-gray-700 font-semibold text-lg">
      {current + 1} / {bankCards.length}
    </p>
  )}
        {!isLoadingBank && (
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="absolute -left-3 sm:left-10 text-gray-700"
          >
            <FaChevronLeft size={26} />
          </button>
        )}

        {/* BANK CARD DISPLAY */}
        {isLoadingBank ? (
          <SkeletonBox className="w-80 h-60 rounded-xl" />
        ) : bankCards.length > 0 ? (
            
          <div
            onClick={handleCardClick}
            className={`
              cursor-pointer bg-gradient-to-br from-red-600 to-orange-500
              text-white w-80 h-60 rounded-xl shadow-xl p-6 relative transition-all duration-300
              ${true ? "border-4 border-blue-400 scale-105 shadow-blue-400 shadow-lg" : ""}
            `}
          >
            <p className="text-xl font-bold">{bankCards[current].accountHolderName}</p>
            <p className="mt-4 font-semibold">{bankCards[current].accountNumber}</p>
            <p className="mt-4 font-semibold">{bankCards[current].ifsc}</p>
            <p className="mt-4 font-semibold">{bankCards[current].bankName}</p>

            <div
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="absolute top-4 right-4 bg-white p-2 rounded-full"
            >
              <FiTrash2 size={18} className="text-black" />
            </div>
          </div>
        ) : (
          <p>No bank accounts added</p>
        )}

        {!isLoadingBank && (
          <button
            disabled={current === bankCards.length - 1}
            onClick={() => setCurrent(current + 1)}
            className="absolute -right-3 sm:right-5 text-gray-700"
          >
            <FaChevronRight size={26} />
          </button>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:w-1/2 w-[100vw] sm:px-0 px-8 md:mt-10">
        <h2 className="text-3xl font-bold mb-5">Add Bank Details</h2>

       <div className="mt-10 flex w-full flex-col gap-5">
          {isLoadingBank ? (
            <>
              <SkeletonBox className="h-10 w-full" />
              <SkeletonBox className="h-10 w-full" />
              <SkeletonBox className="h-10 w-full" />
            </>
          ) : (
            <>
              {[
                "accountHolderName",
                "accountNumber",
                "ifsc",
                "bankName",
                "panNumber",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  className={`border-b outline-none transition-all duration-200 ${
                    focused === field ? "border-blue-500" : "border-gray-400"
                  }`}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  onFocus={() => setFocused(field)}
                  onBlur={() => setFocused(null)}
                />
              ))}

             

              <button
                className="!bg-red-500 text-white py-3 rounded-lg"
                onClick={handleAddBank}
              >
                ADD BANK ACCOUNT
              </button>
            </>
          )}
        </div>
        <h2 className="text-3xl font-bold mb-5">Bank Details</h2>

        {/* WALLET BALANCE */}
        {isLoadingWallet ? (
          <SkeletonBox className="h-6 w-40 mb-6" />
        ) : (
          <p className="text-xl text-gray-700 mb-3">
            Balance: ₹{wallet.availableBalance || 0}
          </p>
        )}

        {/* WITHDRAW */}
        
        <input
          type="number"
          className={`border-b text-lg mb-4 outline-none transition-all duration-200 ${
            focused === "amount" ? "border-blue-500" : "border-gray-400"
          }`}
          placeholder="Withdraw Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onFocus={() => setFocused("amount")}
          onBlur={() => setFocused(null)}
        />

        <button
          onClick={handleWithdraw}
          className="bg-green-600 text-white py-2 px-6 rounded-lg"
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>

       
      </div>
    </div>
  );
};

export default KycPage;
