"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthInit() {
  useEffect(() => {
    const initUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        await supabase.auth.signInAnonymously();
      }
    };

    initUser();
  }, []);

  return null;
}