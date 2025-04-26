import React, { useEffect } from "react";
import { IonApp, setupIonicReact } from "@ionic/react";

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

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp className="background">
      <IonReactRouter>
        <AuthProvider>
          <RootScreen />
        </AuthProvider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
