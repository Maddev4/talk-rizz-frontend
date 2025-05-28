import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.catnnect.connect",
  appName: "Catnnect Connect",
  webDir: "dist",
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    AdMob: {
      appId: "ca-app-pub-7556755881195797~4201273301",
      bannerAdId: "ca-app-pub-7556755881195797/2273722777",
      interstitialAdId: "ca-app-pub-7556755881195797/2273722777",
      rewardedAdId: "ca-app-pub-7556755881195797/2273722777",
      isTesting: true,
    },
  },
};

export default config;
