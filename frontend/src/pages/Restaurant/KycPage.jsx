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
<div className="min-h-screen bg-slate-50 py-10 px-4">

<div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">

<div className="flex flex-col lg:flex-row gap-12">

{/* LEFT SIDE */}
<div className="lg:w-1/2 w-full flex flex-col items-center relative">

{!isLoadingBank && bankCards.length > 0 && (
<p className="mb-4 text-gray-600 font-semibold">
{current + 1} / {bankCards.length}
</p>
)}

{/* Left Arrow */}

{!isLoadingBank && (
<button
disabled={current === 0}
onClick={() => setCurrent(current - 1)}
className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
>
<FaChevronLeft size={24}/>
</button>
)}

{/* Card */}

{isLoadingBank ? (

<SkeletonBox className="w-80 h-56"/>

) : bankCards.length > 0 ? (

<div
onClick={handleCardClick}
className="cursor-pointer w-80 h-56 rounded-2xl p-6 text-white shadow-xl
bg-gradient-to-br from-emerald-500 to-green-700
hover:scale-105 transition"
>

<p className="text-xl font-bold">
{bankCards[current].accountHolderName}
</p>

<p className="mt-6 text-lg tracking-wider">
{bankCards[current].accountNumber}
</p>

<p className="mt-3">
IFSC: {bankCards[current].ifsc}
</p>

<p className="mt-1">
{bankCards[current].bankName}
</p>

<div
onClick={(e)=>{
e.stopPropagation();
handleDelete();
}}
className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
>

<FiTrash2 className="text-black"/>

</div>

</div>

):(

<p className="text-gray-500">
No bank accounts added
</p>

)}

{/* Right Arrow */}

{!isLoadingBank && (

<button
disabled={current === bankCards.length - 1}
onClick={() => setCurrent(current + 1)}
className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
>

<FaChevronRight size={24}/>

</button>

)}

</div>


{/* RIGHT SIDE */}

<div className="lg:w-1/2 w-full">

{/* Add Bank */}

<h2 className="text-2xl font-bold mb-6 text-slate-800">
Add Bank Details
</h2>

<div className="space-y-4">

{[
"accountHolderName",
"accountNumber",
"ifsc",
"bankName",
"panNumber"
].map((field)=>(

<input
key={field}
type="text"
placeholder={field.replace(/([A-Z])/g," $1")}
value={form[field]}

onChange={(e)=>
setForm({...form,[field]:e.target.value})
}

className="w-full border rounded-lg px-4 py-3
focus:ring-2 focus:ring-green-500
outline-none"
/>

))}

<button
onClick={handleAddBank}

className="w-full bg-green-600 text-white py-3
rounded-xl font-semibold
hover:bg-green-700 transition"
>

Add Bank Account

</button>

</div>


{/* Wallet */}

<h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">
Wallet
</h2>


{isLoadingWallet?(
<SkeletonBox className="h-6 w-40"/>
):(

<p className="text-lg font-semibold text-gray-700 mb-4">

Balance ₹{wallet.availableBalance || 0}

</p>

)}


<input
type="number"

placeholder="Withdraw Amount"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

className="w-full border rounded-lg px-4 py-3 mb-4
focus:ring-2 focus:ring-green-500 outline-none"
/>


<button

onClick={handleWithdraw}

className="w-full bg-emerald-600 text-white py-3
rounded-xl font-semibold
hover:bg-emerald-700 transition"
>

{loading ? "Processing..." : "Withdraw"}

</button>

</div>


</div>

</div>

</div>
);
};

export default KycPage;
