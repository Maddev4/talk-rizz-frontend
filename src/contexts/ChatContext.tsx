import React, { createContext, useContext, useEffect, useState } from "react";
import { wsService, ChatMessage, ChatRoom } from "../services/WebSocketService";
import { useAuth } from "./AuthContext";
import axiosInstance from "../config/axios";
import { useHistory } from "react-router-dom";

interface ChatContextType {
  messages: { [roomId: string]: ChatMessage[] };
  rooms: ChatRoom[];
  currentRoom: string | null;
  chatLoading: boolean;
  setMessages: (messages: { [roomId: string]: ChatMessage[] }) => void;
  joinRoom: (roomId: string) => void;
  sendMessage: (content: string, roomId: string) => void;
  sendNewRoom: (room: { participants: string[]; type: string }) => void;
  leaveRoom: (roomId: string) => void;
  markMessagesAsRead: (roomId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<{ [roomId: string]: ChatMessage[] }>(
    {}
  );
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const { user, session } = useAuth();
  const [chatLoading, setChatLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      console.log("session", session);
      if (session?.access_token) {
        // Connect to WebSocket when user is authenticated
        console.log("connecting to websocket");
        wsService.connect(session.access_token);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (session?.access_token) {
        setChatLoading(true);
        try {
          console.log("fetching rooms");
          const response = await axiosInstance.get("/chat/rooms");
          setRooms(response.data);
        } catch (error) {
          console.error("Error fetching rooms", error);
        } finally {
          setChatLoading(false);
        }

        // Listen for new messages
        wsService.onMessage((message: { _doc: ChatMessage; sender: any }) => {
          console.log("message", message);
          setMessages((prev) => {
            console.log("prev", prev);
            return {
              ...prev,
              [message._doc.roomId]: [
                ...(prev[message._doc.roomId] || []),
                { ...message._doc, sender: message.sender },
              ],
            };
          });
        });

        // Listen for message read updates
        wsService.onMarkAsRead((data: { roomId: string; senderId: string }) => {
          setMessages((prev) => {
            const roomMessages = prev[data.roomId];
            if (!roomMessages?.some((msg) => msg.read === false)) {
              return prev;
            }
            return {
              ...prev,
              [data.roomId]: roomMessages.map((msg) => ({
                ...msg,
                read: msg.senderId !== data.senderId ? true : msg.read,
              })),
            };
          });
        });

        // Listen for room updates (you'll need to add this event on the backend)
        wsService.socket?.on("rooms_update", (updatedRooms: ChatRoom[]) => {
          setRooms(updatedRooms);
        });

        wsService.onNewRoom((room: ChatRoom) => {
          console.log("new room created", room);
          setRooms((prev) => [...prev, room]);
          if (room.participants[1] === user?.id) {
            history.push(`/app/chat/${room._id}`);
          }
        });

        return () => {
          wsService.disconnect();
        };
      }
    };
    fetchRooms();
  }, [user, setRooms, history]);

  const joinRoom = (roomId: string) => {
    // console.log("joining room", roomId);
    wsService.joinRoom(roomId);
    setCurrentRoom(roomId);
  };

  const leaveRoom = (roomId: string) => {
    wsService.leaveRoom(roomId);
    if (currentRoom === roomId) {
      setCurrentRoom(null);
    }
  };

  const sendMessage = (content: string, roomId: string) => {
    if (!user) return;

    wsService.sendMessage({
      content,
      roomId,
      senderId: user.id,
    });
  };

  const sendNewRoom = (room: { participants: string[]; type: string }) => {
    if (!user) return;

    wsService.sendNewRoom({
      participants: room.participants,
      type: room.type,
    });
  };

  const markMessagesAsRead = async (roomId: string) => {
    if (!user) return;

    try {
      wsService.markAsRead(roomId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const value = {
    messages,
    rooms,
    currentRoom,
    chatLoading,
    setMessages,
    joinRoom,
    sendMessage,
    sendNewRoom,
    leaveRoom,
    markMessagesAsRead,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
