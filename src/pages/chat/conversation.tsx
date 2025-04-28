import React, { useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSpinner,
} from "@ionic/react";
import { useParams } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import ChatRoom from "../../components/Chat/ChatRoom";
import Spinner from "../../components/Spinner";
import "./Chat.css";
interface ConversationParams {
  roomId: string;
}

const Conversation: React.FC = () => {
  const { roomId } = useParams<ConversationParams>();
  const { user, profile } = useAuth();
  const { joinRoom, leaveRoom, chatLoading, rooms } = useChat();

  useEffect(() => {
    if (!user) {
      return;
    }
    if (roomId) {
      joinRoom(roomId);
    }

    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [user, roomId, joinRoom, leaveRoom]);

  if (!user) {
    return <Spinner />;
  }

  const currentRoom = rooms.find((room) => room._id === roomId);

  return (
    <IonPage>
      {chatLoading ? (
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
              <IonButtons
                slot="start"
                style={{ position: "absolute", left: "0" }}
              >
                <IonBackButton defaultHref="/app/chat" />
              </IonButtons>
              <IonTitle style={{ textAlign: "center" }}>
                {currentRoom?.other.name}
              </IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            {roomId ? (
              <ChatRoom roomId={roomId} />
            ) : (
              <div className="no-chat-selected">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </IonContent>
        </>
      )}
    </IonPage>
  );
};

export default Conversation;
