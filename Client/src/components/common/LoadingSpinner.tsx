import React from "react";
import { Loader } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
};
