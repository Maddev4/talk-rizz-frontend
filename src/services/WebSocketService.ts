import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  _id: string;
  senderId: string;
  roomId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  sender: {
    name: string;
    avatar: string;
  };
}

export interface ChatRoom {
  _id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  lastActivity: Date;
  type: "direct" | "group";
  name?: string;
  category?: string;
  other: {
    name: string;
    avatar: string;
  };
}

class WebSocketService {
  socket: Socket | null = null;
  private static instance: WebSocketService;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(token: string) {
    // const BACKEND_URL =
    //   process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const BACKEND_URL = "https://rizz-be.racewonder.cam";

    this.socket = io(BACKEND_URL, {
      auth: {
        token,
      },
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: { content: string; roomId: string; senderId: string }) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    this.socket.emit("send_message", message);
  }

  sendNewRoom(room: {
    participants: string[];
    type: string;
    category: string;
  }) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    console.log("sending new room", room);
    this.socket.emit("new_room", room);
  }

  onNewRoom(callback: (room: ChatRoom) => void) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    this.socket.on("new_room", callback);
  }

  joinRoom(roomId: string) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    this.socket.emit("join_room", { roomId });
  }

  leaveRoom(roomId: string) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    this.socket.emit("leave_room", { roomId });
  }

  onMessage(callback: (message: { _doc: ChatMessage; sender: any }) => void) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    this.socket.on("new_message", callback);
  }

  onTyping(callback: (data: { userId: string; roomId: string }) => void) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    this.socket.on("user_typing", callback);
  }

  emitTyping(roomId: string) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    this.socket.emit("typing", { roomId });
  }

  markAsRead(roomId: string) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    this.socket.emit("mark_as_read", { roomId });
  }

  onMarkAsRead(callback: (data: { roomId: string; senderId: string }) => void) {
    if (!this.socket) {
      throw new Error("WebSocket not connected");
    }
    this.socket.on("message_read", callback);
  }
}

export const wsService = WebSocketService.getInstance();
