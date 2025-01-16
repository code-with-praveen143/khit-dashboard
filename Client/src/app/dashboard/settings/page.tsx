"use client";

import React from "react";
import Link from "next/link";

const settingsOptions = [
  {
    title: "Edit Terms of Service",
    description:
      "Update the Terms of Service to align with your application's policies and guidelines.",
    href: "/dashboard/settings/terms-of-service",
    icon: "📜",
  },
  {
    title: "Edit Privacy Policy",
    description:
      "Modify the Privacy Policy to ensure compliance with data protection regulations.",
    href: "/dashboard/settings/privacy-policy",
    icon: "🔒",
  },
  {
    title: "Change Logo",
    description:
      "Upload a new logo to give your application a fresh and updated look.",
    href: "/dashboard/settings/logo-changer",
    icon: "🖼️",
  },
];

const Settings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-8">
        Application Settings
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((option) => (
          <div
            key={option.title}
            className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
          >
            <div className="text-4xl mb-4">{option.icon}</div>
            <h2 className="text-lg font-bold text-center mb-2">{option.title}</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              {option.description}
            </p>
            <Link href={option.href}>
              <span className="text-blue-500 font-medium hover:underline">
                Go to {option.title.split(" ")[1]}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
