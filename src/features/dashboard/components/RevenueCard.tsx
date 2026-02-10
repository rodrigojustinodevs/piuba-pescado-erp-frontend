"use client";

export function RevenueCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-xl font-semibold text-gray-900">$4,050,12,300</p>
          <p className="text-xs text-gray-500">Life time sales</p>
        </div>
        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
          +12.5%
        </span>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-teal-400 rounded-xl p-4 text-white relative overflow-hidden">
        <div className="absolute right-3 top-3 w-10 h-10 bg-white/20 rounded-full" />
        <div className="absolute right-8 top-8 w-6 h-6 bg-white/10 rounded-full" />
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold tracking-widest">VISA</span>
          <span className="text-[10px] uppercase">Premium Account</span>
        </div>
        <div className="text-lg tracking-widest font-semibold mb-4">5789 •••• •••• 2847</div>
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="text-white/80">Card Holder</p>
            <p className="font-semibold">Mike Smith</p>
          </div>
          <div>
            <p className="text-white/80">Expiry</p>
            <p className="font-semibold">06/21</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Website Visitors</p>
          <p className="text-lg font-semibold text-gray-900">750K</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">New Customers</p>
          <p className="text-lg font-semibold text-gray-900">7,500</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          View Project
        </button>
        <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          Analytics
        </button>
      </div>
    </div>
  );
}




