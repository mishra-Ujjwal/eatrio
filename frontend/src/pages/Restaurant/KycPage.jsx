// KycPage.jsx (WITH SKELETON LOADING UI)

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

  // ------------------ WITHDRAW MONEY ------------------
  const handleWithdraw = async () => {
    if (Number(amount) <= 0) return alert("Enter valid amount");

    setLoading(true);

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/wallet/withdraw`,
      { restaurantId, amount },
      { withCredentials: true }
    );

    setLoading(false);

    if (res.data.success) {
      alert("Withdrawal Successful");
      setAmount("");
      fetchWallet();
    } else {
      alert(res.data.message);
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
      <div className="sm:w-1/2   w-full flex justify-center items-center relative">

        {/* LEFT ARROW */}
        {!isLoadingBank && (
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="absolute -left-3 sm:left-10 z-50 !bg-transparent !text-gray-700"
          >
            <FaChevronLeft size={26} />
          </button>
        )}

        {/* IF LOADING → SKELETON CARD */}
        {isLoadingBank ? (
          <SkeletonBox className="w-80 h-60 rounded-xl" />
        ) : bankCards.length > 0 ? (
          <div
            onClick={handleCardClick}
            className="cursor-pointer bg-gradient-to-br from-red-600 to-orange-500 
            text-white w-80 h-60 rounded-xl shadow-xl p-6 relative"
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
              className="absolute top-4 right-4 !bg-white p-2 rounded-full"
            >
              <FiTrash2 size={18} className="text-black" />
            </div>
          </div>
        ) : (
          <p>No bank accounts added</p>
        )}

        {/* RIGHT ARROW */}
        {!isLoadingBank && (
          <button
            disabled={current === bankCards.length - 1}
            onClick={() => setCurrent(current + 1)}
            className="absolute -right-3 sm:right-5 !bg-transparent !text-gray-700"
          >
            <FaChevronRight size={26} />
          </button>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:w-1/2 w-[100vw] sm:px-0 px-8 md:mt-10">
        <h2 className="text-3xl font-bold mb-5">Bank Details</h2>

        {/* BALANCE SKELETON */}
        {isLoadingWallet ? (
          <SkeletonBox className="h-6 w-40 mb-6" />
        ) : (
          <p className="text-xl text-gray-700 mb-3">
            Balance: ₹{wallet.availableBalance || 0}
          </p>
        )}

        {/* WITHDRAW INPUT */}
        <input
          type="number"
          className="border-b text-lg mb-4 "
          placeholder="Withdraw Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleWithdraw}
          className="bg-green-600 text-white py-2 px-6 rounded-lg"
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>

        {/* ADD BANK FORM */}
        <div className="mt-10 flex w-full flex-col gap-5">
          {isLoadingBank ? (
            <>
              <SkeletonBox className="h-10 w-full" />
              <SkeletonBox className="h-10 w-full" />
              <SkeletonBox className="h-10 w-full" />
            </>
          ) : (
            <>
              <input type="text" placeholder="Account Holder Name" className="border-b" value={form.accountHolderName} onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })} />
              <input type="text" placeholder="Account Number" className="border-b" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
              <input type="text" placeholder="IFSC Code" className="border-b" value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value })} />
              <input type="text" placeholder="Bank Name" className="border-b" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
              <input type="text" placeholder="PAN Number" className="border-b" value={form.panNumber} onChange={(e) => setForm({ ...form, panNumber: e.target.value })} />

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.makeDefault} onChange={(e) => setForm({ ...form, makeDefault: e.target.checked })} />
                Make Default Account
              </label>

              <button className="bg-red-500 text-white py-3 rounded-lg" onClick={handleAddBank}>
                ADD BANK ACCOUNT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycPage;
