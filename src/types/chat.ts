export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isDeleted: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: "image" | "video" | "file";
  url: string;
  name: string;
  size: number;
}

export interface ChatParticipant {
  userId: string;
  name: string;
  avatar?: string;
  lastSeen?: Date;
  isOnline: boolean;
  role: "admin" | "member";
}

export interface ChatRoom {
  id: string;
  name?: string;
  description?: string;
  participants: ChatParticipant[];
  lastMessage?: Message;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  unreadCount: number;
  settings?: {
    allowAttachments: boolean;
    allowReactions: boolean;
    allowEditing: boolean;
    allowDeleting: boolean;
  };
}
