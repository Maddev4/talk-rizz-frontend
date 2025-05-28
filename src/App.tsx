import React, { useEffect, useState } from "react";
import { IonApp, setupIonicReact } from "@ionic/react";
import { AdMobService } from "./utils/admob";

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

const App: React.FC = () => {
  const [adInitialized, setAdInitialized] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        console.log("Starting AdMob initialization in App component...");
        const adMobService = AdMobService.getInstance();
        await adMobService.initialize();
        setAdInitialized(true);
        console.log("AdMob initialized in App component");

        // Add a small delay before showing the ad
        setTimeout(async () => {
          try {
            console.log("Attempting to show banner ad...");
            await adMobService.showBannerAd();
          } catch (error) {
            console.error("Error showing banner ad:", error);
            setAdError(
              error instanceof Error ? error.message : "Failed to show ad"
            );
          }
        }, 2000); // Increased delay to 2 seconds
      } catch (error) {
        console.error("Error initializing AdMob:", error);
        setAdError(
          error instanceof Error ? error.message : "Failed to initialize AdMob"
        );
      }
    };

    initializeAdMob();
  }, []);

  return (
    <>
      <IonApp
        className="background"
        // style={{ height: "calc(100vh - 64px)", marginTop: "64px" }}
      >
        <IonReactRouter>
          <AuthProvider>
            <DeepLinkHandler />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
              }}
            >
              {/* Main content */}
              <div style={{ flex: 1, overflow: "auto" }}>
                <RootScreen />
              </div>
              {/* Banner Ad */}
              {/* <div
              id="banner-ad-container"
              style={{
                width: "100%",
                height: 50,
                background: "transparent",
                position: "relative",
                zIndex: 9999,
              }}
            /> */}
              {/* Tab bar (your existing tab bar component) */}
              {/* <TabBarComponent /> */}
            </div>
          </AuthProvider>
        </IonReactRouter>
      </IonApp>
    </>
  );
};

export default App;
