"use client";

import { useState } from "react";
import { Card } from "@/shared/components/Cards";

interface ChatbotProduct {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  currentPledge: string;
  lifetimeSupport: {
    value: string;
    change: string;
    isPositive: boolean;
  };
  storage: {
    used: number;
    total: number;
  };
}

const timeframes = ["1D", "1W", "1M", "1Y", "All time"];

const products: ChatbotProduct[] = [
  {
    id: "1",
    name: "EchoBot",
    type: "GPT4-based",
    icon: (
      <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">B</span>
      </div>
    ),
    currentPledge: "$80.00",
    lifetimeSupport: {
      value: "$512.00",
      change: "12%",
      isPositive: true,
    },
    storage: {
      used: 128,
      total: 512,
    },
  },
  {
    id: "2",
    name: "EchoBot",
    type: "GPT4-based",
    icon: (
      <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">||</span>
      </div>
    ),
    currentPledge: "$160.00",
    lifetimeSupport: {
      value: "$256.00",
      change: "12%",
      isPositive: true,
    },
    storage: {
      used: 128,
      total: 512,
    },
  },
];

export function EarningsCard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

  return (
    <Card
      title="Earnings"
      headerAction={
        <div className="flex gap-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                selectedTimeframe === timeframe
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 text-sm font-medium text-gray-600">
          <div className="col-span-4">Chatbot</div>
          <div className="col-span-2">Current pledge</div>
          <div className="col-span-3">Lifetime support</div>
          <div className="col-span-3">Available storage</div>
        </div>

        {/* Table Rows */}
        {products.map((product) => {
          const storagePercentage = (product.storage.used / product.storage.total) * 100;

          return (
            <div
              key={product.id}
              className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 last:border-0"
            >
              {/* Chatbot */}
              <div className="col-span-4 flex items-center gap-3">
                {product.icon}
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.type}</p>
                </div>
              </div>

              {/* Current pledge */}
              <div className="col-span-2">
                <p className="font-medium text-gray-900">{product.currentPledge}</p>
              </div>

              {/* Lifetime support */}
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {product.lifetimeSupport.value}
                  </span>
                  <span
                    className={`text-xs font-medium flex items-center gap-1 ${
                      product.lifetimeSupport.isPositive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.lifetimeSupport.isPositive ? (
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {product.lifetimeSupport.change}
                  </span>
                </div>
              </div>

              {/* Available storage */}
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-800 rounded-full"
                      style={{ width: `${storagePercentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {product.storage.used}/{product.storage.total} Gb
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

