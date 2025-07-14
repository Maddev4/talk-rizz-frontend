import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.catnnect.connect",
  // appId: "com.catnnect.ios",
  appName: "Catnnect Connect",
  webDir: "dist",
  server: {
    androidScheme: "https",
    iosScheme: "https",
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    // BLOCKED: AdMob configuration - commented out to disable Google ads
    /*
    AdMob: {
      appId: "ca-app-pub-7556755881195797~4201273301",
      bannerAdId: "ca-app-pub-7556755881195797/2273722777",
      interstitialAdId: "ca-app-pub-7556755881195797/2273722777",
      rewardedAdId: "ca-app-pub-7556755881195797/2273722777",
      isTesting: true,
    },
    */
    SignInWithApple: {
      clientId: "com.catnnect.ios",
      redirectURI: "App://oauth",
      scopes: "email name",
    },
    // Firebase messaging configuration (Android only - excluded from iOS via includePlugins)
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"],
      icon: "notification_icon",
      iconColor: "#488AFF",
      sound: "default",
      platform: "android",
    },
    LocalNotifications: {
      smallIcon: "ic_launcher_foreground",
      iconColor: "#488AFF",
      sound: "default",
    },
    CapacitorHttp: {
      enabled: true,
    },
    App: {
      appUrlOpen: {
        enabled: true,
      },
    },
  },
  ios: {
    scheme: "App",
    contentInset: "always",
    includePlugins: [
      "@capacitor-community/apple-sign-in",
      "@capacitor-community/in-app-review",
      "@capacitor/app",
      "@capacitor/camera",
      "@capacitor/clipboard",
      "@capacitor/device",
      "@capacitor/haptics",
      "@capacitor/keyboard",
      "@capacitor/local-notifications",
      "@capacitor/push-notifications",
      "@capacitor/screen-reader",
      "@capacitor/share",
      "@capacitor/status-bar",
      "capacitor-voice-recorder",
    ],
  },
  android: {
    allowMixedContent: true,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    backgroundColor: "#ffffff",
    includePlugins: [
      "@capacitor-community/apple-sign-in",
      "@capacitor-community/in-app-review",
      "@capacitor-firebase/messaging",
      "@capacitor/app",
      "@capacitor/camera",
      "@capacitor/clipboard",
      "@capacitor/device",
      "@capacitor/haptics",
      "@capacitor/keyboard",
      "@capacitor/local-notifications",
      "@capacitor/push-notifications",
      "@capacitor/screen-reader",
      "@capacitor/share",
      "@capacitor/status-bar",
      "capacitor-voice-recorder",
    ],
  },
};

export default config;
