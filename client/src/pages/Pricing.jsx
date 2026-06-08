
import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle, FaWallet, FaSpinner, FaTimesCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { updateCredits } from "../redux/userSlice";
function Pricing() {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { userData } = useSelector(
    (state) => state.user
  )

  const [selectedPlan, setSelectedPlan] = useState("free")
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [addedCredits, setAddedCredits] = useState(0)
  
  // Local wallet simulation matching your navbar display
  const currentCredits =
  Number(localStorage.getItem("credits")) ||
  userData?.credits ||
  100;
  const plans = [
    {
      id: "free",
      name: "Free Trial",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking"
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History"
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing"
      ],
      badge: "Best Value",
    }
  ]

  const handleMockPayment = (plan) => {

  setLoading(true);

  setTimeout(() => {

    const currentCredits =
      Number(localStorage.getItem("credits")) ||
      userData?.credits ||
      100;

    const newCredits =
      currentCredits + plan.credits;

    localStorage.setItem(
      "credits",
      newCredits
    );

    dispatch(updateCredits(newCredits));

    setAddedCredits(plan.credits);

    setLoading(false);

    setShowSuccessModal(true);

  }, 1500);

};

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-16 px-6 relative font-sans select-none'>
      
      {/* Top Navigation Bar */}
      <div className='max-w-6xl mx-auto mb-6 flex justify-between items-center'>
        <button 
          onClick={() => navigate("/")} 
          className='p-3 rounded-full bg-white shadow hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-100'
        >
          <FaArrowLeft className='text-gray-600' />
        </button>
        
        {/* Sync Wallet View */}
        <div className='flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 font-medium text-gray-700'>
          <FaWallet className='text-emerald-500' />
          <span>Credits:</span>
          <span className='font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md text-sm animate-bounce'>
{userData?.credits || 0}
          </span>
        </div>
      </div>

      {/* Header Area */}
      <div className='text-center mb-16'>
        <span className='text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/60 px-4 py-1.5 rounded-full'>
          Pricing Options
        </span>
        <h1 className='text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mt-4'>
          Choose Your Plan
        </h1>
        <p className='mt-4 text-lg text-gray-600 max-w-xl mx-auto leading-relaxed'>
          Select a package to securely top up your credits and unlock high-tier AI processing.
        </p>
      </div>

      {/* Grid Layout */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch'>
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id

          return (
            <div 
              key={plan.id}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-8 transition-all duration-300 transform border flex flex-col justify-between ${
                isSelected 
                  ? "border-emerald-600 shadow-2xl bg-white scale-[1.03] z-10" 
                  : "border-gray-200/80 bg-white shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-300"
              } ${plan.default ? "cursor-default" : "cursor-pointer"}`}
            >
              <div>
                {plan.badge && (
                  <span className="absolute top-6 right-6 bg-emerald-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                )}
                {plan.default && (
                  <span className="absolute top-6 right-6 bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                    Active
                  </span>
                )}

                <h3 className="text-xl font-bold text-gray-800">
                  {plan.name}
                </h3>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-emerald-600 tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">/ package</span>
                </div>
                
                <div className="mt-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg inline-block">
                  +{plan.credits} AI Interview Credits
                </div>

                <p className="text-gray-500 mt-5 text-sm leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-8 space-y-3.5 text-left border-t border-gray-100 pt-6">
  {plan.features.map((feature, i) => (
    <div key={i} className="flex items-start gap-3">
      <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 flex-shrink-0" />
      <span className="text-gray-600 text-sm font-medium">
        {feature}
      </span>
    </div>
  ))}
</div>
              </div>

              {!plan.default && (
                <button 
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation() 
                    if (isSelected) {
                      handleMockPayment(plan)
                    } else {
                      setSelectedPlan(plan.id)
                    }
                  }}
                  className={`w-full mt-8 py-3.5 rounded-2xl font-bold transition-all duration-200 flex justify-center items-center gap-2 tracking-wide text-sm ${
                    isSelected
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg shadow-emerald-600/20"
                      : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200"
                  } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading && isSelected ? (
                    <>
                      <FaSpinner className="animate-spin text-lg" />
                      Securing Transaction...
                    </>
                  ) : isSelected ? (
                    "Proceed to Pay (Sandbox)"
                  ) : (
                    "Select Package Plan"
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Beautiful Checkout Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimesCircle className="text-xl" />
            </button>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-600 mt-2 text-sm">
              Your test environment transaction completed perfectly. We've added <strong>{addedCredits} credits</strong> to your wallet.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false)
                navigate("/")
              }}
              className="mt-6 w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Back to Interview Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Pricing