import React from "react";
import { User, Bell, Shield, Globe } from "lucide-react";

export const Settings = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-white mb-8">Settings</h1>

      <div className="bg-gray-800/50 shadow-lg rounded-lg border border-gray-700">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {[
              {
                icon: User,
                title: "Account",
                description: "Manage your account settings and preferences",
              },
              {
                icon: Bell,
                title: "Notifications",
                description: "Choose what updates you want to receive",
              },
              {
                icon: Shield,
                title: "Privacy",
                description: "Control your privacy settings and data usage",
              },
              {
                icon: Globe,
                title: "Travel Preferences",
                description: "Update your travel style and preferences",
              },
            ].map((section, index) => (
              <div
                key={index}
                className="flex items-center p-6 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <section.icon className="h-6 w-6 text-blue-500 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-400">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
