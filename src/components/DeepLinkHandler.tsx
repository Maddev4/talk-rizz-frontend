// src/components/DeepLinkHandler.tsx
import { useEffect } from "react";
import { App } from "@capacitor/app";
import { supabase } from "../config/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

export const DeepLinkHandler = () => {
  const { handleAuthCallback } = useAuth();
  const history = useHistory();
  useEffect(() => {
    let isProcessing = false;

    App.addListener("appUrlOpen", async ({ url }) => {
      if (url.includes("io.catnnect.connect://oauth") && !isProcessing) {
        isProcessing = true;
        try {
          // Extract the code from the URL
          const urlObj = new URL(url);
          const code = urlObj.searchParams.get("code");

          if (!code) {
            console.error("No code found in URL");
            return;
          }

          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            console.error("Auth error:", error);
            return;
          }

          await handleAuthCallback();
          history.replace("/app/profile");

          console.log("Session data:", data.user.email);
        } catch (err) {
          console.error("Error processing URL:", err);
        } finally {
          isProcessing = false;
        }
      }
    });

    // Cleanup listener on unmount
    return () => {
      App.removeAllListeners();
    };
  }, []);

  return null; // This component doesn't render anything
};
