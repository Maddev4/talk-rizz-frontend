// BLOCKED: AdMob service - All functionality commented out to disable Google ads
/*
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
  private bannerVisible = false;
  private visibilityListeners: ((isVisible: boolean) => void)[] = [];

  private constructor() {}

  static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  addVisibilityListener(listener: (isVisible: boolean) => void): void {
    this.visibilityListeners.push(listener);
  }

  removeVisibilityListener(listener: (isVisible: boolean) => void): void {
    this.visibilityListeners = this.visibilityListeners.filter(
      (l) => l !== listener
    );
  }

  private notifyVisibilityChange(isVisible: boolean): void {
    this.visibilityListeners.forEach((listener) => listener(isVisible));
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
        position: BannerAdPosition.TOP_CENTER, // Position at the very top
        margin: 0, // No margin to position in safe area
        isTesting: true,
        adSize: BannerAdSize.BANNER,
      };

      console.log("Showing banner ad with options:", JSON.stringify(options));
      await AdMob.showBanner(options);

      this.bannerVisible = true;
      this.notifyVisibilityChange(true);
      console.log("Banner ad shown successfully");
      console.log("Google Ad Displayed:", true);
    } catch (error) {
      this.bannerVisible = false;
      this.notifyVisibilityChange(false);
      console.error("Error showing banner ad:", error);
      console.log("Google Ad Displayed:", false);
      throw error;
    }
  }

  async hideBannerAd(): Promise<void> {
    try {
      if (this.bannerVisible) {
        await AdMob.hideBanner();
        this.bannerVisible = false;
        this.notifyVisibilityChange(false);
        console.log("Banner ad hidden successfully");
        console.log("Google Ad Displayed:", false);
      } else {
        // Banner is already hidden
        console.log("No banner ad to hide");
      }
    } catch (error) {
      console.error("Error hiding banner ad:", error);
      // Don't throw the error, just log it
      this.bannerVisible = false;
      this.notifyVisibilityChange(false);
    }
  }

  checkAdStatus(): void {
    console.log("Google Ad Displayed:", this.bannerVisible);
    this.notifyVisibilityChange(this.bannerVisible);
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
*/

// BLOCKED: Dummy export to prevent import errors
export class AdMobService {
  static getInstance(): AdMobService {
    return new AdMobService();
  }

  addVisibilityListener(listener: (isVisible: boolean) => void): void {
    // No-op
  }

  removeVisibilityListener(listener: (isVisible: boolean) => void): void {
    // No-op
  }

  async initialize(): Promise<void> {
    // No-op
  }

  async showBannerAd(): Promise<void> {
    // No-op
  }

  async hideBannerAd(): Promise<void> {
    // No-op
  }

  checkAdStatus(): void {
    // No-op
  }

  async showInterstitialAd(): Promise<void> {
    // No-op
  }

  async showRewardedAd(): Promise<void> {
    // No-op
  }
}
