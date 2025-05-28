import {
  AdMob,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  RewardInterstitialAdOptions,
  RewardAdOptions,
} from "@capacitor-community/admob";

export class AdMobService {
  private static instance: AdMobService;
  private initialized = false;

  private constructor() {}

  static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log("Starting AdMob initialization...");
      await AdMob.initialize();
      this.initialized = true;
      console.log("AdMob initialized successfully");
    } catch (error) {
      console.error("Error initializing AdMob:", error);
      throw error;
    }
  }

  async showBannerAd(): Promise<void> {
    try {
      console.log("Preparing to show banner ad...");

      // First, hide any existing banner
      try {
        await AdMob.hideBanner();
        console.log("Hidden any existing banner");
      } catch (e) {
        console.log("No existing banner to hide");
      }

      const options: BannerAdOptions = {
        adId: "ca-app-pub-7556755881195797/2273722777",
        position: BannerAdPosition.TOP_CENTER,
        margin: 0,
        isTesting: true,
      };

      console.log("Showing banner ad with options:", JSON.stringify(options));
      await AdMob.showBanner(options);
      console.log("Banner ad shown successfully");
    } catch (error) {
      console.error("Error showing banner ad:", error);
      throw error;
    }
  }

  async hideBannerAd(): Promise<void> {
    try {
      await AdMob.hideBanner();
      console.log("Banner ad hidden successfully");
    } catch (error) {
      console.error("Error hiding banner ad:", error);
      throw error;
    }
  }

  async showInterstitialAd(): Promise<void> {
    try {
      const options: RewardInterstitialAdOptions = {
        adId: "ca-app-pub-7556755881195797/2273722777",
        isTesting: true,
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
    } catch (error) {
      console.error("Error showing interstitial ad:", error);
      throw error;
    }
  }

  async showRewardedAd(): Promise<void> {
    try {
      const options: RewardAdOptions = {
        adId: "ca-app-pub-7556755881195797/2273722777",
        isTesting: true,
      };

      await AdMob.prepareRewardVideoAd(options);
      await AdMob.showRewardVideoAd();
    } catch (error) {
      console.error("Error showing rewarded ad:", error);
      throw error;
    }
  }
}
