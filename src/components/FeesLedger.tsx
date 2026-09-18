import React, { useState } from 'react';
import { Student, FeeHead, FeeTransaction, Role } from '../types';
import { PrintableReceipt } from './PrintableReceipt';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  ArrowUpRight,
  Receipt,
  Sparkles,
  Smartphone,
  Building,
  Check
} from 'lucide-react';

interface FeesLedgerProps {
  student: Student;
  feeHeads: FeeHead[];
  transactions: FeeTransaction[];
  currentRole: Role;
  onPayFee: (headId: string, amount: number, paymentMode: 'UPI' | 'Net Banking' | 'Debit Card' | 'Cash Voucher') => void;
  isHindi: boolean;
}

export const FeesLedger: React.FC<FeesLedgerProps> = ({
  student,
  feeHeads,
  transactions,
  currentRole,
  onPayFee,
  isHindi,
}) => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedFeeHeadId, setSelectedFeeHeadId] = useState<string>(
    feeHeads.find((f) => f.dueAmount > 0)?.id || feeHeads[0]?.id || ''
  );
  const [selectedPayMode, setSelectedPayMode] = useState<'UPI' | 'Net Banking' | 'Debit Card' | 'Cash Voucher'>('UPI');
  const [upiVpa, setUpiVpa] = useState('rajesh.sharma@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<FeeTransaction | null>(null);

  // Financial calculations
  const totalAnnualFee = feeHeads.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = feeHeads.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalDue = feeHeads.reduce((acc, curr) => acc + curr.dueAmount, 0);
  const paidPercent = totalAnnualFee > 0 ? Math.round((totalPaid / totalAnnualFee) * 100) : 0;

  const currentSelectedHead = feeHeads.find((f) => f.id === selectedFeeHeadId);
  const payAmount = currentSelectedHead ? currentSelectedHead.dueAmount : 0;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      onPayFee(selectedFeeHeadId, payAmount, selectedPayMode);
      setIsProcessing(false);
      setShowPayModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Financial Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Fee Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'सत्र कुल वार्षिक शुल्क' : 'Total Session Fees'}
            </span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ₹{totalAnnualFee.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {feeHeads.length} {isHindi ? 'मदें (Heads)' : 'fee components enrolled'}
          </div>
        </div>

        {/* Total Paid Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'कुल जमा राशि' : 'Total Paid to Date'}
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {paidPercent}% {isHindi ? 'भुगतान पूर्ण' : 'cleared'}
          </span>
        </div>

        {/* Outstanding Due Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'वर्तमान बकाया' : 'Outstanding Balance'}
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-800 mt-2">
            ₹{totalDue.toLocaleString('en-IN')}
          </div>
          <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
            {totalDue > 0 ? (isHindi ? 'देय तिथि 15 जनवरी' : 'Due by 15 Jan 2026') : (isHindi ? 'कोई बकाया नहीं' : 'All Clear')}
          </span>
        </div>

        {/* Quick Action Pay Button */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              {isHindi ? 'त्वरित ऑनलाइन भुगतान' : 'Instant Gateway'}
            </span>
            <h4 className="text-sm font-bold text-white mt-1">
              {isHindi ? 'बकाया शुल्क का भुगतान करें' : 'Clear Outstanding Dues'}
            </h4>
            <p className="text-[11px] text-indigo-200 mt-0.5">
              {isHindi ? 'UPI, नेट बैंकिंग व कार्ड द्वारा तुरंत रसीद' : 'Instant receipt & SMS alert on payment'}
            </p>
          </div>

          <button
            id="btn-open-pay-modal"
            disabled={totalDue <= 0}
            onClick={() => setShowPayModal(true)}
            className="mt-3 w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isHindi ? 'अभी भुगतान करें' : 'Pay Online Now'}</span>
          </button>
        </div>

      </div>

      {/* Main Breakdown & Ledger Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fee Heads Structure Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              {isHindi ? 'शुल्क संरचना एवं श्रेणी' : 'Fee Structure by Head'}
            </h3>
            <span className="text-xs text-slate-500">Academic 25–26</span>
          </div>

          <div className="space-y-3">
            {feeHeads.map((head) => (
              <div
                key={head.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{head.title}</h4>
                    <span className="text-[11px] text-slate-500">{head.quarter}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    head.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : head.status === 'partial'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {head.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 text-xs">
                  <div className="text-slate-500">
                    <span>Total: </span>
                    <span className="font-bold text-slate-900">₹{head.totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  {head.dueAmount > 0 ? (
                    <div className="text-amber-800 font-bold">
                      <span>Due: ₹{head.dueAmount.toLocaleString('en-IN')}</span>
                    </div>
                  ) : (
                    <div className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Cleared</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Transaction Ledger */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {isHindi ? 'भुगतान लेज़र व रसीद इतिहास' : 'Fee Payment Ledger & Transactions'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? 'हर भुगतान की अधिकृत रसीद देखें व डाउनलोड करें' : 'Audit trail with official printable receipts'}
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {transactions.length} {isHindi ? 'रसीदें' : 'receipts verified'}
            </span>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Fee Head</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Mode</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {tx.receiptNo}
                    </td>
                    <td className="p-3 text-slate-600">
                      <div>{tx.date}</div>
                      <span className="text-[10px] text-slate-400">{tx.time}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-800 max-w-[180px] truncate">
                      {tx.feeHead}
                    </td>
                    <td className="p-3 text-right font-black text-slate-900 text-sm">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tx.paymentMode}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedReceiptTx(tx)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors inline-flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                        title="View Official Receipt"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'रसीद' : 'Slip'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'सभी रसीदें बैंक गेटवे द्वारा एन्क्रिप्टेड व प्रमाणित हैं' : 'All receipts are digitally stamped & audit compliant'}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              CBSE Affiliation #2130894
            </span>
          </div>

        </div>

      </div>

      {/* Pay Online Simulator Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isHindi ? 'ऑनलाइन फीस भुगतान' : 'Pay Academic Fees Online'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Student: {student.name} ({student.class}-{student.section})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="mt-4 space-y-4">
              
              {/* Select Fee Head */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'शुल्क मद चुनें (Select Fee Head to Pay)' : 'Select Fee Component'}
                </label>
                <select
                  value={selectedFeeHeadId}
                  onChange={(e) => setSelectedFeeHeadId(e.target.value)}
                  className="w-full p-2.5 text-xs font-semibold border border-slate-300 rounded-lg focus:outline-indigo-600"
                >
                  {feeHeads.map((f) => (
                    <option key={f.id} value={f.id} disabled={f.dueAmount <= 0}>
                      {f.title} — {f.dueAmount > 0 ? `Due: ₹${f.dueAmount.toLocaleString('en-IN')}` : 'Already Paid'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount to pay */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    {isHindi ? 'भुगतान हेतु कुल राशि' : 'Payable Amount'}
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{payAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                  Zero Processing Surcharge
                </span>
              </div>

              {/* Payment Mode selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isHindi ? 'भुगतान का तरीका (Payment Mode)' : 'Select Payment Method'}
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPayMode('UPI')}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                      selectedPayMode === 'UPI'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI (GPay/PhonePe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPayMode('Debit Card')}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                      selectedPayMode === 'Debit Card'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Debit / Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPayMode('Net Banking')}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                      selectedPayMode === 'Net Banking'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Payment details input */}
              {selectedPayMode === 'UPI' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    required
                    placeholder="user@upi"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-indigo-600"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Supported: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay
                  </span>
                </div>
              )}

              {selectedPayMode === 'Debit Card' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Card Number (4532 •••• •••• 8821)"
                    defaultValue="4532 9182 3019 8821"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="08/28"
                      className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="771"
                      className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Instant Alert Guarantee */}
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {isHindi ? 'रियल-टाइम अलर्ट एवं रसीद जनरेशन' : 'Real-Time Alert Dispatch'}
                  </span>
                  <span className="text-[11px] text-indigo-800">
                    {isHindi 
                      ? 'भुगतान सफल होते ही अभिभावक व विद्यार्थी को रसीद के साथ तुरंत सूचना अलर्ट भेजा जाएगा।' 
                      : 'An instant push alert with receipt number will be dispatched to the parent.'}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || payAmount <= 0}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isHindi ? 'प्रक्रिया चल रही है...' : 'Verifying with Bank...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isHindi ? `₹${payAmount.toLocaleString('en-IN')} का भुगतान करें` : `Confirm Pay ₹${payAmount.toLocaleString('en-IN')}`}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptTx && (
        <PrintableReceipt
          transaction={selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
          isHindi={isHindi}
        />
      )}

    </div>
  );
};
