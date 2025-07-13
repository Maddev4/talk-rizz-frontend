import React, { useEffect, useState } from "react";
import { IonApp, setupIonicReact } from "@ionic/react";
// import { AdMobService } from "./utils/admob"; // BLOCKED: AdMob functionality
import PushNotificationService from "./PushNotificationService";
import { Capacitor } from "@capacitor/core";
import { initializeApp } from "firebase/app";
import { supabase } from "./config/supabase";

// Import Ionic CSS
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./theme/variables.css";
import "./theme/tailwindcss.css";

import RootScreen from "./pages/Root";
import { AuthProvider } from "./contexts/AuthContext";
import { IonReactRouter } from "@ionic/react-router";
import { DeepLinkHandler } from "./components/DeepLinkHandler";

setupIonicReact();

// Firebase configuration from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyBznzFT3gMDdBT10sUTsPi7gjSk6SInUBQ",
  authDomain: "catnnect-ab73f.firebaseapp.com",
  projectId: "catnnect-ab73f",
  storageBucket: "catnnect-ab73f.firebasestorage.app",
  messagingSenderId: "871084142539",
  appId: "1:871084142539:android:daae6bb42cb5243f1cd04e",
};

// Initialize Firebase if on Android
if (Capacitor.getPlatform() === "android") {
  initializeApp(firebaseConfig);
}

const App: React.FC = () => {
  // const [adInitialized, setAdInitialized] = useState(false); // BLOCKED: AdMob state
  // const [adError, setAdError] = useState<string | null>(null); // BLOCKED: AdMob error state
  // const [hideValue, setHideValue] = useState(false); // BLOCKED: AdMob visibility state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Function to check if the current path is part of the onboarding or auth flow
  const isOnboardingOrAuthPath = (path: string): boolean => {
    return (
      path === "/" ||
      path.startsWith("/onboarding") ||
      path.startsWith("/auth/") ||
      path === "/auth/login"
    );
  };

  // Listen for route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Check auth state
  useEffect(() => {
    const checkAuthState = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);

      // Subscribe to auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setIsAuthenticated(!!session);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkAuthState();
  }, []);

  useEffect(() => {
    // Initialize push notifications
    PushNotificationService.init().catch((err) => {
      console.error("Error initializing push notifications:", err);
    });

    // BLOCKED: AdMob functionality - commenting out all AdMob related code
    /*
    const adMobService = AdMobService.getInstance();

    const handleAdVisibility = (isVisible: boolean) => {
      setHideValue(isVisible); // When ad is visible, hide the content
    };

    const initializeAdMob = async () => {
      try {
        console.log("Starting AdMob initialization in App component...");
        await adMobService.initialize();
        setAdInitialized(true);
        console.log("AdMob initialized in App component");

        // Show ads always, regardless of authentication status
        displayAd(adMobService);
      } catch (error) {
        console.error("Error initializing AdMob:", error);
        setAdError(
          error instanceof Error ? error.message : "Failed to initialize AdMob"
        );
      }
    };

    const displayAd = async (adMobService: AdMobService) => {
      // Add a small delay before showing the ad
      setTimeout(async () => {
        try {
          console.log("Attempting to show banner ad...");
          await adMobService.showBannerAd();
          console.log("Banner ad call completed");

          // Check status after 3 seconds
          setTimeout(() => {
            adMobService.checkAdStatus();
            console.log("Ad status checked");
          }, 3000);
        } catch (error) {
          console.error("Error showing banner ad:", error);
          setAdError(
            error instanceof Error ? error.message : "Failed to show ad"
          );
        }
      }, 1000); // Reduced delay to 1 second for faster testing
    };

    // Add visibility listener
    adMobService.addVisibilityListener(handleAdVisibility);

    // Initialize AdMob
    initializeAdMob();

    // Cleanup
    return () => {
      adMobService.removeVisibilityListener(handleAdVisibility);
    };
    */
  }, []); // Remove dependencies since we want banner to show always

  // BLOCKED: No longer showing any banner - AdMob is fully disabled
  // const shouldShowImage = true; // BLOCKED: Changed to always show image instead of AdMob banner

  // BLOCKED: AdMob touch event fixes - commenting out
  /*
  useEffect(() => {
    // Fix for touch event coordinates
    const fixTouchEvents = () => {
      // Prevent AdMob banner from affecting touch coordinates
      const bannerElements = document.querySelectorAll(
        ".admob-banner, .admob-banner-container"
      );
      bannerElements.forEach((element) => {
        (element as HTMLElement).style.pointerEvents = "none";
        (element as HTMLElement).style.userSelect = "none";
        (element as HTMLElement).style.webkitUserSelect = "none";
      });

      // Ensure app content has proper touch handling
      const appContent = document.querySelector("ion-app");
      if (appContent) {
        (appContent as HTMLElement).style.position = "relative";
        (appContent as HTMLElement).style.zIndex = "1";
      }
    };

    // Apply fix after component mounts
    setTimeout(fixTouchEvents, 100);

    // Re-apply fix when banner visibility changes
    const interval = setInterval(fixTouchEvents, 1000);

    return () => clearInterval(interval);
  }, [hideValue]);
  */

  // BLOCKED: AdMob logging - commenting out
  /*
  useEffect(() => {
    console.log("Ad visibility state:", {
      hideValue,
      isAuthenticated,
      currentPath,
      isOnboardingPath: isOnboardingOrAuthPath(currentPath),
      shouldShowImage,
    });
  }, [hideValue, isAuthenticated, currentPath]);
  */

  return (
    <>
      {/* BLOCKED: No banner displayed - AdMob is fully disabled */}
      {/* {shouldShowImage && (
        <div
          className="admob-banner-container"
          style={{
            height: "60px",
            backgroundColor: "#121212",
          }}
        >
          <img
            src="/assets/images/Catnnect_Feature_graphic.png"
            alt="Ad Banner"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )} */}

      <IonApp
        className="background"
        style={{
          height: "100vh",
          // BLOCKED: Removed top padding since no banner is displayed
          // paddingTop: shouldShowImage ? "60px" : "0px", // BLOCKED: Changed from hideValue to shouldShowImage
          touchAction: "manipulation", // Ensure proper touch handling
          position: "relative",
          zIndex: 1,
        }}
      >
        <IonReactRouter>
          <AuthProvider>
            <DeepLinkHandler />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                position: "relative",
                touchAction: "manipulation", // Ensure proper touch handling
                zIndex: 1,
              }}
            >
              <div
                style={{
                  flex: 1,
                  overflow: "auto",
                  touchAction: "manipulation", // Ensure proper touch handling
                  position: "relative",
                  zIndex: 1,
                  paddingBottom: "80px", // Space for tab bar above safe area
                }}
              >
                <RootScreen />
              </div>
            </div>
          </AuthProvider>
        </IonReactRouter>
      </IonApp>
    </>
  );
};

export default App;
