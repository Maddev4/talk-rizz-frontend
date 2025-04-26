import React, { useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonFooter,
  IonToolbar,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
} from "@ionic/react";
import { sendOutline } from "ionicons/icons";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { wsService, ChatMessage } from "../../services/WebSocketService";
import axiosInstance from "../../config/axios";

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const { messages, sendMessage, setMessages } = useChat();
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstance.get<ChatMessage[]>(
          `/chat/rooms/${roomId}/messages?page=1&limit=50`
        );
        setMessages({
          ...messages,
          [roomId]: response.data,
        });
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (messages[roomId]) {
      setRoomMessages(messages[roomId]);
    }
  }, [messages]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [roomMessages]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    wsService.onTyping(({ userId, roomId: typingRoomId }) => {
      if (roomId === typingRoomId && userId !== user?.id) {
        console.log("typing...");
        // Clear any existing timeout
        if (timerId) {
          clearTimeout(timerId);
        }
        setIsTyping(true);
        // Set new timeout
        timerId = setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [roomId, user?.id]);

  const handleSend = () => {
    if (message.trim() && user) {
      sendMessage(message, roomId);
      setMessage("");
      if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    wsService.emitTyping(roomId);
    typingTimeoutRef.current = setTimeout(() => {
      // Clear typing timeout
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    } else {
      handleTyping();
    }
  };

  return (
    <div
      className="chat-container"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <IonContent className="ion-padding chat-content" scrollEvents={true}>
        <div
          ref={contentRef}
          className="h-full overflow-y-auto"
          style={{
            height: "100%",
            overflowY: "auto",
          }}
        >
          {roomMessages.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center"
              style={{ height: "calc(100% - 20px)" }}
            >
              <IonLabel className="text-xl">No messages yet</IonLabel>
            </div>
          ) : (
            roomMessages.map((msg, index) => (
              <IonItem
                key={index}
                lines="none"
                className={`chat-message ${
                  msg.senderId === user?.id ? "sent" : "received"
                }`}
              >
                <IonAvatar slot="start">
                  <img src={msg.sender.avatar} alt="avatar" />
                </IonAvatar>
                <IonLabel className="ion-text-wrap">
                  <p className="message-content">{msg.content}</p>
                  <p className="message-time">
                    {format(new Date(msg.timestamp), "HH:mm")}
                  </p>
                </IonLabel>
              </IonItem>
            ))
          )}
          {isTyping ? (
            <IonLabel>
              <p>Someone is typing...</p>
            </IonLabel>
          ) : null}
        </div>
      </IonContent>
      <IonFooter className="chat-footer">
        <div style={{ display: "flex", alignItems: "center", padding: "6px" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IonInput
              value={message}
              placeholder="Type a message"
              onIonChange={(e) => setMessage(e.detail.value!)}
              onKeyDown={handleKeyPress}
              style={{
                padding: "0px !important",
              }}
            />
            <IonButton
              onClick={handleSend}
              disabled={!message.trim()}
              fill="clear"
              className="send-button"
            >
              <IonIcon icon={sendOutline} />
            </IonButton>
          </div>
        </div>
      </IonFooter>
    </div>
  );
};

export default ChatRoom;
