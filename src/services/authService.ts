import {
  SignInWithApple,
  SignInWithAppleOptions,
  SignInWithAppleResponse,
} from "@capacitor-community/apple-sign-in";
import { Capacitor } from "@capacitor/core";
import { supabase } from "../config/supabase";

export class AuthService {
  static async handleAppleSignIn() {
    if (!Capacitor.isNativePlatform()) {
      console.log("Apple Sign In is only available on native platforms");
      return null;
    }

    const options: SignInWithAppleOptions = {
      clientId: "com.catnnect.ios",
      //      redirectURI: "https://sqttehzyiacxmmiqsovw.supabase.co/auth/v1/callback",
      redirectURI: "io.catnnect.connect://oauth",
      scopes: "email name",
    };

    try {
      // Request Apple authentication
      const appleResponse: SignInWithAppleResponse =
        await SignInWithApple.authorize(options);

      if (!appleResponse?.response?.identityToken) {
        throw new Error("No identity token received from Apple");
      }

      // Sign in with Supabase using the Apple token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: appleResponse.response.identityToken,
      });

      if (error) {
        throw error;
      }

      if (!data.session?.user?.email) {
        throw new Error("No email received from authentication");
      }

      return {
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      console.error("Apple Sign In error:", error);
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }
}
