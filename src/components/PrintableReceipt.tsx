import React from 'react';
import { FeeTransaction } from '../types';
import { Printer, X, Shield, CheckCircle2 } from 'lucide-react';

interface PrintableReceiptProps {
  transaction: FeeTransaction;
  onClose: () => void;
  isHindi: boolean;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({
  transaction,
  onClose,
  isHindi,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-800 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">
              {isHindi ? 'अधिकारिक फीस रसीद वाउचर' : 'Official Fee Payment Receipt'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isHindi ? 'प्रिंट रसीद' : 'Print Receipt'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body */}
        <div className="p-6 sm:p-8 bg-white print:p-0">
          <div className="border-2 border-slate-800 p-6 rounded-xl bg-slate-50/30">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-900 text-amber-400 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">
                    Educate School Accounts
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Institutional Area, Sector 62, Noida (UP) • GST: 09AAATE1928L1Z8
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 uppercase">
                  Payment Verified
                </span>
                <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                  {transaction.receiptNo}
                </div>
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{transaction.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Class & Section</span>
                <span className="font-bold text-slate-900">{transaction.className}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
                <span className="font-medium text-slate-800">{transaction.date} at {transaction.time}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                <span className="font-bold text-indigo-700">{transaction.paymentMode}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction Reference ID</span>
                <span className="font-mono text-slate-800">{transaction.transactionRef}</span>
              </div>
            </div>

            {/* Fee Head Breakdown */}
            <div className="py-4 border-b border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="text-left pb-2">Description / Fee Category</th>
                    <th className="text-right pb-2">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">{transaction.feeHead}</td>
                    <td className="py-2.5 text-right font-black text-slate-900 text-sm">
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-800 font-black text-slate-900 text-sm">
                    <td className="pt-3 uppercase">Total Amount Received</td>
                    <td className="pt-3 text-right text-emerald-800 text-base">
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Remarks & Signatures */}
            <div className="pt-4 text-xs text-slate-600">
              <div className="p-2.5 rounded-lg bg-slate-100 text-[11px] mb-4">
                <span className="font-bold text-slate-800">Note: </span>
                {transaction.remarks}
              </div>

              <div className="flex items-end justify-between pt-4">
                <div>
                  <div className="w-32 h-8 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center font-serif italic text-slate-700">
                    Auto-Signed
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Authorized Accounts Desk</span>
                </div>

                <div className="text-right">
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-600/60 flex items-center justify-center text-[9px] font-bold text-emerald-800 uppercase text-center p-1 leading-tight ml-auto">
                    Educate PAID
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
