import React from "react";
import { useAuthController } from "../../../controllers/AuthController";

const Dashboard: React.FC = () => {
  const { currentUser, userProfile, handleLogout } = useAuthController("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>

        {currentUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <p className="text-gray-900">{currentUser.email}</p>
            </div>

            {userProfile && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name:
                </label>
                <p className="text-gray-900">
                  {userProfile.name || "No name set"}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID:
              </label>
              <p className="text-gray-900 text-xs break-all">
                {currentUser.uid}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        {!currentUser && (
          <p className="text-center text-gray-600">Not logged in</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
