import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonRouterOutlet,
} from "@ionic/react";
import { Route, Redirect, useLocation } from "react-router-dom";
import {
  chatbubble,
  chatbubbleOutline,
  personCircle,
  personCircleOutline,
  people,
  peopleOutline,
  heart,
  heartOutline,
  pulse,
  pulseOutline,
  settings,
  settingsOutline,
} from "ionicons/icons";

import Home from "./home";
import Chat from "./chat";
import Profile from "./profile";
import Connect from "./connect";
import Conversation from "./chat/conversation";
import Chatbot from "./chat/chatbot";
import Mode from "./connect/mode";
import Report from "./chat/report";
import ReportChat from "./chat/report_chat";
import Status from "./status";
import Settings from "./settings";
import { Capacitor } from "@capacitor/core";

interface TabConfig {
  tab: string;
  href: string;
  icon: string;
  outlineIcon: string;
}

const Tabs: React.FC = () => {
  const location = useLocation();

  const tabConfig: TabConfig[] = [
    {
      tab: "profile",
      href: "/app/profile",
      icon: personCircle,
      outlineIcon: personCircleOutline,
    },
    {
      tab: "connect",
      href: "/app/connect",
      icon: heart,
      outlineIcon: heartOutline,
    },
    {
      tab: "chat",
      href: "/app/chat",
      icon: chatbubble,
      outlineIcon: chatbubbleOutline,
    },
    {
      tab: "status",
      href: "/app/status",
      icon: pulse,
      outlineIcon: pulseOutline,
    },
    {
      tab: "setting",
      href: "/app/setting",
      icon: settings,
      outlineIcon: settingsOutline,
    },
  ];

  const shouldHideTabBar =
    location.pathname.startsWith("/app/chat/") ||
    location.pathname.startsWith("/app/connect/") ||
    location.pathname.startsWith("/app/chatbot/") ||
    location.pathname.includes("/report") ||
    location.pathname.includes("/settings") ||
    location.pathname.includes("/custominstruction") ||
    location.pathname.includes("/chooseCategory");

  // Platform-specific bottom positioning
  const getTabBarBottom = () => {
    const platform = Capacitor.getPlatform();
    if (platform === "ios") {
      return "env(safe-area-inset-bottom)";
    } else {
      // For Android, use a fixed bottom position
      return "0px";
    }
  };

  const renderTabButton = ({ tab, href, icon, outlineIcon }: TabConfig) => {
    const isActive = location.pathname === href;
    const activeClass = isActive
      ? "text-[var(--ion-color-primary)]"
      : "text-[var(--ion-text-primary)]";

    return (
      <IonTabButton
        key={tab}
        tab={tab}
        href={href}
        className={`bg-transparent ${href} text-center`}
      >
        <IonIcon
          icon={isActive ? icon : outlineIcon}
          className={`w-[32px] h-[32px] ${activeClass}`}
        />
      </IonTabButton>
    );
  };

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/home" render={() => <Home />} />
        <Route exact path="/app/profile" render={() => <Profile />} />
        <Route exact path="/app/chat" component={Chat} />
        <Route exact path="/app/chat/:roomId" component={Conversation} />
        <Route exact path="/app/chatbot/:mode" component={Chatbot} />
        <Route exact path="/app/connect" component={Connect} />
        <Route exact path="/app/connect/:mode" component={Mode} />
        <Route exact path="/app/chat/:roomId/report" component={Report} />
        <Route
          exact
          path="/app/chat/:roomId/report/:reason"
          component={ReportChat}
        />
        <Route exact path="/app/status" component={Status} />
        <Route exact path="/app/setting" component={Settings} />
      </IonRouterOutlet>
      <IonTabBar
        slot="bottom"
        className={`bg-white h-20 w-full ${
          shouldHideTabBar ? "hidden" : "flex"
        }`}
        style={{
          position: "fixed",
          bottom: getTabBarBottom(),
          left: "0",
          right: "0",
          zIndex: "1000",
          height: "80px",
          display: shouldHideTabBar ? "none" : "flex",
          pointerEvents: "auto",
          touchAction: "manipulation",
        }}
      >
        {tabConfig.map(renderTabButton)}
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
