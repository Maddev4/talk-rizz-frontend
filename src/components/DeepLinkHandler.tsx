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
      console.log("Deep link received:", url);
      
      if (url.includes("io.catnnect.connect://oauth") && !isProcessing) {
        isProcessing = true;
        console.log("Processing OAuth callback...");
        
        try {
          // Parse the URL to extract parameters
          const urlObj = new URL(url);
          const code = urlObj.searchParams.get("code");
          const error = urlObj.searchParams.get("error");
          const errorDescription = urlObj.searchParams.get("error_description");

          // Handle OAuth errors
          if (error) {
            console.error("OAuth error:", error, errorDescription);
            // You might want to show a toast or navigate to an error page
            history.replace("/auth/error?error=" + encodeURIComponent(error));
            return;
          }

          if (!code) {
            console.error("No authorization code found in URL");
            history.replace("/auth/error?error=no_code");
            return;
          }

          console.log("Exchanging code for session...");
          
          // Exchange the authorization code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error("Code exchange error:", exchangeError);
            history.replace("/auth/error?error=" + encodeURIComponent(exchangeError.message));
            return;
          }

          if (!data.session) {
            console.error("No session returned from code exchange");
            history.replace("/auth/error?error=no_session");
            return;
          }

          console.log("Session created successfully:", {
            user: data.session.user.email,
            provider: data.session.user.app_metadata?.provider
          });

          // Handle the auth callback to set up user profile
          await handleAuthCallback();
          
          // Navigate to the main app
          history.replace("/app/profile");
          
        } catch (err) {
          console.error("Error processing OAuth callback:", err);
          history.replace("/auth/error?error=" + encodeURIComponent("callback_processing_failed"));
        } finally {
          isProcessing = false;
        }
      }
    });

    // Cleanup listener on unmount
    return () => {
      App.removeAllListeners();
    };
  }, [handleAuthCallback, history]);

  return null; // This component doesn't render anything
};
