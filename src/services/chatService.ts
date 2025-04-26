import axiosInstance from "../config/axios";
import { Message, ChatRoom, ChatParticipant } from "../types/chat";

export const chatService = {
  // Get all chat rooms for the current user
  getChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await axiosInstance.get("/chat/rooms");
    return response.data;
  },

  // Get a specific chat room with its messages
  getChatRoom: async (roomId: string): Promise<ChatRoom> => {
    const response = await axiosInstance.get(`/chat/rooms/${roomId}`);
    return response.data;
  },

  // Create a new chat room
  createChatRoom: async (
    participants: ChatParticipant[]
  ): Promise<ChatRoom> => {
    const response = await axiosInstance.post("/chat/rooms", { participants });
    return response.data;
  },

  // Send a message in a chat room
  sendMessage: async (roomId: string, content: string): Promise<Message> => {
    const response = await axiosInstance.post(
      `/chat/rooms/${roomId}/messages`,
      {
        content,
      }
    );
    return response.data;
  },

  // Get messages for a specific chat room
  getMessages: async (
    roomId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Message[]> => {
    const response = await axiosInstance.get(
      `/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (
    roomId: string,
    messageIds: string[]
  ): Promise<void> => {
    await axiosInstance.post(`/chat/rooms/${roomId}/messages/read`, {
      messageIds,
    });
  },

  // Delete a message
  deleteMessage: async (roomId: string, messageId: string): Promise<void> => {
    await axiosInstance.delete(`/chat/rooms/${roomId}/messages/${messageId}`);
  },

  // Add a participant to a chat room
  addParticipant: async (
    roomId: string,
    participantId: string
  ): Promise<ChatRoom> => {
    const response = await axiosInstance.post(
      `/chat/rooms/${roomId}/participants`,
      { participantId }
    );
    return response.data;
  },

  // Remove a participant from a chat room
  removeParticipant: async (
    roomId: string,
    participantId: string
  ): Promise<ChatRoom> => {
    const response = await axiosInstance.delete(
      `/chat/rooms/${roomId}/participants/${participantId}`
    );
    return response.data;
  },

  // Leave a chat room
  leaveChatRoom: async (roomId: string): Promise<void> => {
    await axiosInstance.post(`/chat/rooms/${roomId}/leave`);
  },

  // Get unread message count
  getUnreadCount: async (): Promise<{ [roomId: string]: number }> => {
    const response = await axiosInstance.get("/chat/unread-count");
    return response.data;
  },

  // Get typing status for a room
  getTypingStatus: async (
    roomId: string
  ): Promise<{ [userId: string]: boolean }> => {
    const response = await axiosInstance.get(`/chat/rooms/${roomId}/typing`);
    return response.data;
  },

  // Set typing status for a room
  setTypingStatus: async (roomId: string, isTyping: boolean): Promise<void> => {
    await axiosInstance.post(`/chat/rooms/${roomId}/typing`, { isTyping });
  },

  // Search messages in a room
  searchMessages: async (roomId: string, query: string): Promise<Message[]> => {
    const response = await axiosInstance.get(
      `/chat/rooms/${roomId}/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Get chat room participants
  getParticipants: async (roomId: string): Promise<ChatParticipant[]> => {
    const response = await axiosInstance.get(
      `/chat/rooms/${roomId}/participants`
    );
    return response.data;
  },

  // Update chat room settings
  updateRoomSettings: async (
    roomId: string,
    settings: {
      name?: string;
      description?: string;
      isPrivate?: boolean;
    }
  ): Promise<ChatRoom> => {
    const response = await axiosInstance.put(
      `/chat/rooms/${roomId}/settings`,
      settings
    );
    return response.data;
  },
};
