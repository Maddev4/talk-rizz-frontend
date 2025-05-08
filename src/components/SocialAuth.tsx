import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { logoGoogle, logoApple } from "ionicons/icons";
import { supabase } from "../config/supabase";
import { Provider } from "@supabase/supabase-js";
import { getPlatforms } from "@ionic/react";
import "./SocialAuth.css";

interface SocialAuthProps {
  mode: "signin" | "signup";
  onError: (error: string) => void;
}

const SocialAuth: React.FC<SocialAuthProps> = ({ mode, onError }) => {
  const handleSocialAuth = async (provider: Provider) => {
    try {
      console.log("provider", provider);
      const platforms = getPlatforms();
      console.log("platforms", platforms);
      const isAndroid = platforms.includes("android");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: isAndroid
            ? "io.catnnect.connect://oauth"
            : `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from authentication");
      }
    } catch (err) {
      console.error(`${provider} authentication error:`, err);
      onError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  return (
    <div className="social-auth-buttons">
      <IonButton
        expand="block"
        fill="outline"
        onClick={() => handleSocialAuth("google")}
        className="google-btn"
      >
        <IonIcon slot="start" icon={logoGoogle} />
        {mode === "signin" ? "Sign in" : "Sign up"} with Google
      </IonButton>

      <IonButton
        expand="block"
        fill="outline"
        onClick={() => handleSocialAuth("apple")}
        className="apple-btn"
      >
        <IonIcon slot="start" icon={logoApple} />
        {mode === "signin" ? "Sign in" : "Sign up"} with Apple
      </IonButton>
    </div>
  );
};

export default SocialAuth;
