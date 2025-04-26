import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from "@ionic/react";
import { useAuth } from "../../contexts/AuthContext";
import "./Chat.css";
import Spinner from "../../components/Spinner";
import ChatList from "../../components/Chat/ChatList";
import { useChat } from "../../contexts/ChatContext";

const Chat: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { rooms, chatLoading } = useChat();

  if (!user) {
    return <Spinner />;
  }

  return (
    <IonPage>
      {isLoading || chatLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <IonSpinner />
        </div>
      ) : (
        <>
          <IonHeader>
            <IonToolbar>
              <div className="chat-header">
                <IonTitle>Messages</IonTitle>
              </div>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  {rooms.length === 0 ? (
                    <div className="no-chats-message">
                      <p>No conversations yet</p>
                    </div>
                  ) : (
                    <ChatList />
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </>
      )}
    </IonPage>
  );
};

export default Chat;
