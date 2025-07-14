import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonImg,
  IonAvatar,
  IonModal,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
} from "@ionic/react";
import { useParams } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import ChatRoom from "../../components/Chat/ChatRoom";
import Spinner from "../../components/Spinner";
import { useHistory } from "react-router-dom";
import axiosInstance from "../../config/axios";
import "./Chat.css";
import { Capacitor } from "@capacitor/core";

interface ConversationParams {
  roomId: string;
}

const Conversation: React.FC = () => {
  const { roomId } = useParams<ConversationParams>();
  const { user, profile } = useAuth();
  const { joinRoom, leaveRoom, chatLoading, rooms } = useChat();
  const [otherUser, setOtherUser] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [otherUserProfile, setOtherUserProfile] = useState<any>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const history = useHistory();

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

  useEffect(() => {
    if (otherUser) {
      setIsModalLoading(true);
      axiosInstance.get(`/profile/${otherUser}`).then((response: any) => {
        console.log("response", response.data);
        setOtherUserProfile(response.data);
        setIsModalLoading(false);
      });
    }
  }, [otherUser]);

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
            <IonToolbar
              style={{
                height: Capacitor.getPlatform() === "ios" ? "60px" : "60px",
                paddingTop: "5px",
              }}
            >
              <div
                className="flex items-center justify-between w-full h-full relative"
                style={{
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                <IonButtons
                  slot="start"
                  style={{ position: "absolute", left: "8px", zIndex: 10 }}
                >
                  <IonBackButton defaultHref="/app/chat" />
                </IonButtons>

                <div
                  className="flex flex-col items-center justify-center flex-1"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    paddingLeft: "50px", // Account for back button
                    paddingRight: "80px", // Account for report button
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (!showModal) {
                      // Only set otherUser when opening the modal
                      setOtherUser(
                        currentRoom?.participants.find((id) => id !== user?.id)
                      );
                    }
                    setShowModal(!showModal);
                  }}
                >
                  <IonAvatar
                    style={{ width: "32px", height: "32px", flexShrink: 0 }}
                  >
                    <IonImg
                      src={
                        currentRoom?.other.avatar ||
                        "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"
                      }
                      alt={currentRoom?.other.name}
                    />
                  </IonAvatar>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "var(--ion-color-dark)",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      maxWidth: "120px",
                      lineHeight: "1.2",
                    }}
                  >
                    {currentRoom?.other.name}
                  </span>
                </div>

                <div
                  className="flex items-center"
                  style={{
                    position: "absolute",
                    right: "16px",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  onClick={() => {
                    history.push(`/app/chat/${currentRoom?._id}/report`);
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#FF3B30",
                      fontWeight: "500",
                    }}
                  >
                    Report
                  </span>
                </div>
              </div>
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

          <IonModal
            isOpen={showModal && !!otherUser}
            onDidDismiss={() => {
              setShowModal(false);
              setOtherUser(undefined);
            }}
            style={{
              "--height": "auto",
              "--max-height": "70vh",
              "--min-height": "400px",
              "--width": "90%",
              "--max-width": "400px",
              "--border-radius": "16px",
            }}
          >
            {isModalLoading ? (
              <div
                className="flex justify-center items-center"
                style={{ height: "300px" }}
              >
                <IonSpinner />
              </div>
            ) : (
              <div style={{ padding: "24px" }}>
                <div className="flex flex-col items-center gap-6">
                  {/* Header with close button */}
                  <div className="flex justify-between items-center w-full">
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        margin: 0,
                        color: "var(--ion-color-dark)",
                      }}
                    >
                      Profile
                    </h2>
                    <IonButton
                      fill="clear"
                      onClick={() => {
                        setShowModal(false);
                        setOtherUser(undefined);
                      }}
                      style={{
                        "--color": "var(--ion-color-medium)",
                        margin: 0,
                        minWidth: "40px",
                        minHeight: "40px",
                      }}
                    >
                      ✕
                    </IonButton>
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex flex-col items-center gap-3">
                    <IonAvatar
                      style={{
                        width: "100px",
                        height: "100px",
                        border: "3px solid var(--ion-color-light)",
                      }}
                    >
                      <IonImg
                        src={
                          currentRoom?.other.avatar ||
                          "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"
                        }
                        alt={currentRoom?.other.name}
                      />
                    </IonAvatar>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        margin: 0,
                        color: "var(--ion-color-dark)",
                      }}
                    >
                      {currentRoom?.other.name}
                    </h3>
                  </div>

                  {/* Profile Information */}
                  <div
                    className="w-full flex flex-col gap-4"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {otherUserProfile?.generalProfile.general && (
                      <div className="flex flex-col gap-1">
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--ion-color-medium)",
                          }}
                        >
                          General
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "var(--ion-color-dark)",
                            lineHeight: "1.4",
                          }}
                        >
                          {otherUserProfile.generalProfile.general}
                        </span>
                      </div>
                    )}

                    {otherUserProfile?.basicProfile.gender && (
                      <div className="flex flex-col gap-1">
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--ion-color-medium)",
                          }}
                        >
                          Gender
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "var(--ion-color-dark)",
                            textTransform: "capitalize",
                          }}
                        >
                          {otherUserProfile.basicProfile.gender}
                        </span>
                      </div>
                    )}

                    {otherUserProfile?.basicProfile.location && (
                      <div className="flex flex-col gap-1">
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--ion-color-medium)",
                          }}
                        >
                          Location
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "var(--ion-color-dark)",
                          }}
                        >
                          {otherUserProfile.basicProfile.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </IonModal>
        </>
      )}
    </IonPage>
  );
};

export default Conversation;
