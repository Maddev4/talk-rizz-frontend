import React, { useEffect, useState } from "react";
import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route, Redirect, useHistory } from "react-router-dom";
import Tabs from "./Tabs";
import Spinner from "../components/Spinner";
import Callback from "./auth/Callback";
import Login from "./auth/Login";
import Onboarding from "./onboarding/index";
import OnboardingChat from "./onboarding/chat";
import { useAuth } from "../contexts/AuthContext";
import { ChatProvider } from "../contexts/ChatContext";
import { supabase } from "../config/supabase";
import { profileService } from "../services/profileService";
import { connectService } from "../services/connectService";
import "./index.css";
const RootScreen: React.FC = () => {
  const {
    isLoading,
    user,
    signOut,
    setIsLoading,
    setSession,
    setProfile,
    setConnect,
  } = useAuth();
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          if (!userData) {
            setSession(null);
            signOut();
          } else {
            try {
              const response = await profileService.getUserProfile();

              console.log("response", response);

              if (response.status === 200) {
                setProfile(response.data);
              } else {
                console.error("Failed to fetch profile");
              }

              const response1 = await connectService.getConnect();
              console.log("response1", response1);
              if (response1.status === 200) {
                setConnect(response1.data);
              } else {
                console.error("Failed to fetch connect");
              }
            } catch (error) {
              console.error("Error fetching profile:", error);
            }

            if (window.location.pathname.includes("/auth")) {
              // history.push("/app/home");
              history.replace("/app/profile");
            } else {
              history.push(window.location.pathname);
            }

            setSession({
              access_token: data.session.access_token,
              user: {
                id: data.session.user.id,
                email: data.session.user.email || "",
                name: userData?.name || "User",
                avatar: userData?.avatar_url,
              },
            });
          }
        } else {
          signOut();
        }
      } catch (error) {
        console.error("Error checking session:", error);
        signOut();
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [supabase]);

  if (isLoading) {
    return (
      <IonPage>
        <Spinner />
      </IonPage>
    );
  }

  return (
    <ChatProvider>
      <IonRouterOutlet>
        <Route exact path="/" component={Onboarding} />
        <Route exact path="/onboarding-chat" component={OnboardingChat} />
        <Route path="/app" component={Tabs} />
        <Route exact path="/auth/callback" component={Callback} />
        <Route exact path="/auth/login" component={Login} />
      </IonRouterOutlet>
    </ChatProvider>
  );
};

export default RootScreen;
