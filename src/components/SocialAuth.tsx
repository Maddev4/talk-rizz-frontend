import React, { useState } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { logoGoogle, logoApple } from "ionicons/icons";
import { supabase } from "../config/supabase";
import { Provider } from "@supabase/supabase-js";
import { getPlatforms } from "@ionic/react";
import { Capacitor } from "@capacitor/core";
import { 
  SignInWithApple, 
  SignInWithAppleOptions, 
  SignInWithAppleResponse 
} from "@capacitor-community/apple-sign-in";
import "./SocialAuth.css";

interface SocialAuthProps {
  onError: (error: string) => void;
  onSuccess?: (data: any) => void;
}

const SocialAuth: React.FC<SocialAuthProps> = ({ onError, onSuccess }) => {
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const saveSessionData = (session: any) => {
    // Store session data in localStorage or your preferred storage
    localStorage.setItem('supabase.auth.token', JSON.stringify(session));
  };

  const saveUserData = (email: string, userId: string) => {
    // Store user data in localStorage or your preferred storage
    localStorage.setItem('user.email', email);
    localStorage.setItem('user.id', userId);
  };

  const handleSuccessfulSignIn = (data: any) => {
    console.log("Successful sign in:", data);
    if (onSuccess) {
      onSuccess(data);
    }
    // Additional success handling logic here
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);

    if (Capacitor.isNativePlatform()) {
      let options: SignInWithAppleOptions = {
        clientId: "com.catnnect.ios",
        redirectURI: "https://sqttehzyiacxmmiqsovw.supabase.co/auth/v1/callback",
        scopes: "email name",
      };

      let appleResponse: SignInWithAppleResponse;

      try {
        appleResponse = await SignInWithApple.authorize(options);
      } catch (err) {
        console.log("Apple catch error: ", err);
        setIsAppleLoading(false);
        onError(err instanceof Error ? err.message : "Apple authentication failed");
        return;
      }

      try {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: appleResponse.response.identityToken,
        });

        if (error) {
          setIsAppleLoading(false);
          console.log("Apple login error: ", error);
          onError(error.message);
          return;
        }

        if (!data.session?.user?.email) {
          setIsAppleLoading(false);
          console.log("Apple login error: no email: ", data);
          onError("No email received from Apple Sign In");
          return;
        }

        const session = data.session;
        const userEmail = session.user.email!; // We already checked it exists above
        const userId = session.user.id;

        saveSessionData(session);
        saveUserData(userEmail, userId);

        if (data?.session?.access_token && data?.user?.email) {
          handleSuccessfulSignIn(data);
        }

        setIsAppleLoading(false);
      } catch (err) {
        setIsAppleLoading(false);
        console.error("Apple Sign In error:", err);
        onError(err instanceof Error ? err.message : "Apple authentication failed");
      }
    } else {
      // Fallback to web OAuth for web platform
      try {
        await handleSocialAuth("apple");
      } catch (err) {
        setIsAppleLoading(false);
        console.error("Apple web auth error:", err);
        onError(err instanceof Error ? err.message : "Apple authentication failed");
      }
    }
  };

  const handleSocialAuth = async (provider: Provider) => {
    try {
      if (provider === "google") {
        setIsGoogleLoading(true);
      }

      const platforms = getPlatforms();
      const isAndroid = platforms.includes("android");
      const isIOS = platforms.includes("ios");
      const isMobile = isAndroid || isIOS;
      
      // Determine redirect URL based on platform
      let redirectTo: string;
      
      if (isMobile) {
        redirectTo = "io.catnnect.connect://oauth";
      } else {
        // Web fallback
        redirectTo = `${window.location.origin}/auth/callback`;
      }

      console.log("Using redirect URL:", redirectTo);

      // Configure auth options based on provider
      const authOptions: any = {
        redirectTo,
      };

      // Provider-specific configurations
      if (provider === "google") {
        authOptions.queryParams = {
          access_type: "offline",
          prompt: "consent",
        };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: authOptions,
      });

      if (error) {
        throw error;
      }

      console.log("Auth data:", data);
      
      if (provider === "google") {
        setIsGoogleLoading(false);
      }
    } catch (err) {
      if (provider === "google") {
        setIsGoogleLoading(false);
      }
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
        disabled={isGoogleLoading || isAppleLoading}
      >
        <IonIcon slot="start" icon={logoGoogle} />
        {isGoogleLoading ? "Signing in..." : "Continue with Google"}
      </IonButton>

      <IonButton
        expand="block"
        fill="outline"
        onClick={handleAppleSignIn}
        className="apple-btn"
        disabled={isAppleLoading || isGoogleLoading}
      >
        <IonIcon slot="start" icon={logoApple} />
        {isAppleLoading ? "Signing in..." : "Continue with Apple"}
      </IonButton>
    </div>
  );
};

export default SocialAuth;
