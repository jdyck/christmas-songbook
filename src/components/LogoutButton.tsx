import React from "react";
import { supabase } from "@/lib/supabaseClient";

type LogoutComponentProps = {
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setLoadingAction: React.Dispatch<React.SetStateAction<boolean>>;
  loadingAction: boolean;
};

const LogoutButton: React.FC<LogoutComponentProps> = ({
  setUser,
  setLoadingAction,
  loadingAction,
}) => {
  const handleLogout = async () => {
    setLoadingAction(true);
    try {
      await supabase.auth.signOut();
      setUser(null); // Clear the user state
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loadingAction}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
    >
      {loadingAction ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
