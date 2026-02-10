
import React, { useState } from 'react';
import { CHARITY_INFO } from '../constants';

type DonationStep = 'select' | 'details' | 'processing' | 'success';

const Charity: React.FC = () => {
  const [step, setStep] = useState<DonationStep>('select');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '' });
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvv: '' });

  const finalAmount = selectedTier || parseFloat(customAmount) || 0;
  const progress = (CHARITY_INFO.current / CHARITY_INFO.goal) * 100;

  const handleNextStep = () => {
    if (step === 'select' && finalAmount > 0) setStep('details');
    else if (step === 'details') {
      setStep('processing');
      // Realistic simulation of payment processing
      setTimeout(() => {
        setStep('success');
      }, 3000);
    }
  };

  const handleBack = () => {
    if (step === 'details') setStep('select');
  };

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <div className="animate-fadeIn">
            <h4 className="text-2xl font-serif font-bold text-white mb-8 text-center">Choose Your Impact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {CHARITY_INFO.tiers.map((tier) => (
                <button
                  key={tier.amount}
                  onClick={() => {
                    setSelectedTier(tier.amount);
                    setCustomAmount('');
                  }}
                  className={`p-6 rounded-2xl border transition-all text-center group ${
                    selectedTier === tier.amount 
                      ? 'gold-bg text-black border-transparent scale-105' 
                      : 'bg-black/40 text-gray-400 border-white/10 hover:border-amber-400/50'
                  }`}
                >
                  <span className="block text-2xl font-bold mb-1">${tier.amount}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-80">{tier.label}</span>
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block text-center">Or Enter Custom Amount</label>
              <div className="relative max-w-[200px] mx-auto">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400">$</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedTier(null);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-6 text-white text-center focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-white/5 mb-8 min-h-[80px] flex items-center justify-center">
              {selectedTier ? (
                <p className="text-gray-300 text-sm italic text-center animate-slideUp">
                  "{CHARITY_INFO.tiers.find(t => t.amount === selectedTier)?.impact}"
                </p>
              ) : customAmount ? (
                <p className="text-gray-300 text-sm italic text-center animate-slideUp">
                  Your contribution of ${customAmount} will support our general education fund.
                </p>
              ) : (
                <p className="text-gray-500 text-sm text-center">Select an amount to see the impact of your gift.</p>
              )}
            </div>

            <button 
              onClick={handleNextStep}
              disabled={finalAmount <= 0}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${
                finalAmount > 0 
                  ? 'gold-bg text-black hover:scale-[1.02] shadow-gold/20' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Continue to Details</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        );

      case 'details':
        return (
          <div className="animate-fadeIn space-y-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={handleBack} className="text-amber-400 text-xs uppercase tracking-widest hover:underline">
                <i className="fas fa-arrow-left mr-2"></i> Back
              </button>
              <span className="text-white font-serif font-bold">Total: ${finalAmount}</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Full Name</label>
                  <input 
                    type="text"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                    placeholder="Jane Doe"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-amber-400 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Email Address</label>
                  <input 
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                    placeholder="jane@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500">Card Number</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-amber-400 outline-none pl-12"
                  />
                  <i className="fas fa-credit-card absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Expiry (MM/YY)</label>
                  <input 
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={paymentInfo.expiry}
                    onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-amber-400 outline-none text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">CVV</label>
                  <input 
                    type="text"
                    placeholder="***"
                    maxLength={3}
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-amber-400 outline-none text-center"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleNextStep}
              className="w-full py-4 rounded-xl gold-bg text-black font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-xl shadow-gold/20 flex items-center justify-center gap-3"
            >
              <i className="fas fa-lock text-xs"></i>
              <span>Complete Donation</span>
            </button>
            <p className="text-center text-[9px] text-gray-600 uppercase tracking-widest">Your payment is encrypted and secured by CrownPay Gateway</p>
          </div>
        );

      case 'processing':
        return (
          <div className="py-20 flex flex-col items-center justify-center animate-pulse">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-amber-400/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-crown text-amber-400 text-2xl"></i>
              </div>
            </div>
            <h4 className="text-xl font-serif text-white mb-2">Verifying Transaction</h4>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Please do not refresh the page...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8 animate-fadeIn">
            <div className="w-20 h-20 gold-bg rounded-full flex items-center justify-center mx-auto mb-6 text-black text-3xl shadow-xl shadow-gold/30">
              <i className="fas fa-check"></i>
            </div>
            <h4 className="text-3xl font-serif font-bold text-white mb-2">Transaction Successful</h4>
            <p className="text-amber-400 text-sm mb-8 font-medium">Thank you for your grace and generosity, {donorInfo.name || 'Darling'}.</p>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3 mb-8">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 uppercase tracking-widest">Receipt No.</span>
                <span className="text-white">#QC-{Math.floor(Math.random() * 900000 + 100000)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 uppercase tracking-widest">Amount</span>
                <span className="text-white">${finalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/10 pt-3">
                <span className="text-gray-500 uppercase tracking-widest">Initiative</span>
                <span className="text-white">Queen's Education Fund</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setStep('select');
                setSelectedTier(null);
                setCustomAmount('');
                setDonorInfo({ name: '', email: '' });
                setPaymentInfo({ cardNumber: '', expiry: '', cvv: '' });
              }}
              className="text-amber-400 text-xs uppercase tracking-[0.2em] font-bold hover:underline"
            >
              Make Another Impact
            </button>
          </div>
        );
    }
  };

  return (
    <section id="charity" className="py-24 px-4 md:px-8 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Content Side */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-amber-400 text-sm tracking-[0.4em] uppercase mb-4">Philanthropy</h2>
              <h3 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
                Grace In <br /> Every Giving
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                {CHARITY_INFO.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-white font-bold uppercase tracking-widest text-xs">Community Impact Goal</span>
                <span className="text-amber-400 font-serif text-2xl">${CHARITY_INFO.current.toLocaleString()} / ${CHARITY_INFO.goal.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full gold-bg transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-gray-500 text-xs italic">Current goal for the 2024 academic cycle.</p>
            </div>
          </div>

          {/* Realistic Donation Interaction Side */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group min-h-[550px]">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/5 blur-3xl rounded-full group-hover:bg-amber-400/10 transition-colors"></div>
              
              {renderStep()}

            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
      `}</style>
    </section>
  );
};

export default Charity;
