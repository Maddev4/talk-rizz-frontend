import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { Route, Redirect, useLocation } from "react-router-dom";
import {
  chatbubble,
  chatbubbleOutline,
  documentText,
  documentTextOutline,
  timer,
  timerOutline,
} from "ionicons/icons";

import Home from "./home";
import Chat from "./chat";
import Profile from "./profile";
import Conversation from "./chat/conversation";

interface TabConfig {
  tab: string;
  href: string;
  label: string;
  icon: string;
  outlineIcon: string;
}

const Tabs: React.FC = () => {
  const location = useLocation();

  const tabConfig: TabConfig[] = [
    {
      tab: "home",
      href: "/app/home",
      label: "Home",
      icon: timer,
      outlineIcon: timerOutline,
    },
    {
      tab: "profile",
      href: "/app/profile",
      label: "Profile",
      icon: documentText,
      outlineIcon: documentTextOutline,
    },
    {
      tab: "chat",
      href: "/app/chat",
      label: "Chat",
      icon: chatbubble,
      outlineIcon: chatbubbleOutline,
    },
  ];

  const shouldHideTabBar =
    [
      "/app/settings",
      "/app/custominstruction",
      "/app/chooseCategory",
      "/app/chat/:roomId",
    ].includes(location.pathname) || location.pathname.startsWith("/app/chat/");

  const renderTabButton = ({
    tab,
    href,
    label,
    icon,
    outlineIcon,
  }: TabConfig) => {
    const isActive = location.pathname === href;
    const activeClass = isActive
      ? "text-[var(--ion-color-primary)]"
      : "text-[var(--ion-text-primary)]";

    return (
      <IonTabButton
        key={tab}
        tab={tab}
        href={href}
        className={`bg-transparent ${href}`}
      >
        <IonIcon
          icon={isActive ? icon : outlineIcon}
          className={`w-[26px] h-[26px] ${activeClass}`}
        />
        <IonLabel className={`text-xs ${activeClass}`}>{label}</IonLabel>
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
      </IonRouterOutlet>
      <IonTabBar
        slot="bottom"
        className={`bg-[rgba(0,0,0,0.16)] h-20 w-full ${
          shouldHideTabBar && "hidden"
        }`}
      >
        {tabConfig.map(renderTabButton)}
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
