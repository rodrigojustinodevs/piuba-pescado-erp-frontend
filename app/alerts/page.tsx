"use client";

import { DashboardLayout } from "@/shared/components/Layout";
import { Alert } from "@/shared/components/Alert";
import { useAlertModal } from "@/shared/components/AlertModal";
import Link from "next/link";

export default function AlertsPage() {
  const { showSuccess, showError, showWarning, showInfo } = useAlertModal();
  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Alerts</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>

        {/* Success Alert Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Success Alert</h2>
          <div className="space-y-4">
            <Alert
              type="success"
              title="Success Message"
              message="Be cautious when performing this action."
              learnMoreLink="#"
            />
            <Alert
              type="success"
              title="Success Message"
              message="Be cautious when performing this action."
            />
          </div>
        </div>

        {/* Warning Alert Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Warning Alert</h2>
          <div className="space-y-4">
            <Alert
              type="warning"
              title="Warning Message"
              message="Be cautious when performing this action."
              learnMoreLink="#"
            />
            <Alert
              type="warning"
              title="Warning Message"
              message="Be cautious when performing this action."
            />
          </div>
        </div>

        {/* Error Alert Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Error Alert</h2>
          <div className="space-y-4">
            <Alert
              type="error"
              title="Error Message"
              message="Be cautious when performing this action."
              learnMoreLink="#"
            />
            <Alert
              type="error"
              title="Error Message"
              message="Be cautious when performing this action."
            />
          </div>
        </div>

        {/* Alert Modal Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Alert Modal</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() =>
                showSuccess(
                  "Success Alert!",
                  "Your action was completed successfully. All changes have been saved."
                )
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Success Modal
            </button>
            <button
              onClick={() =>
                showError(
                  "Danger Alert!",
                  "Lorem ipsum dolor sit amet consectetur. Feugiat ipsum libero tempor felis risus nisi non. Quisque eu ut tempor curabitur."
                )
              }
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Error Modal
            </button>
            <button
              onClick={() =>
                showWarning(
                  "Warning Alert!",
                  "Please be cautious when performing this action. Make sure you understand the consequences."
                )
              }
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
            >
              Warning Modal
            </button>
            <button
              onClick={() =>
                showInfo(
                  "Info Alert!",
                  "This is an informational message. You can use this to provide additional context or details."
                )
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Info Modal
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


