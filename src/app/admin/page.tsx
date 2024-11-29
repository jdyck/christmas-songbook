"use client";

import { useState, useEffect } from "react";
import PageDesign from "@/components/PageDesign";
import { supabase } from "@/lib/supabaseClient";
import LoggedOut from "@/components/LoggedOut";
import LoggedIn from "@/components/LoggedIn";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in and set up auth state listener
  useEffect(() => {
    const getUserData = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setLoading(false);
    };

    getUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getUserData();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <PageDesign>
      {user ? (
        <LoggedIn
          setUser={setUser}
          setLoadingAction={setLoadingAction}
          setError={setError}
          loadingAction={loadingAction}
        />
      ) : (
        <LoggedOut
          setUser={setUser}
          setLoadingAction={setLoadingAction}
          setError={setError}
          loadingAction={loadingAction}
          error={error}
        />
      )}
    </PageDesign>
  );
}
