import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import storage from '../storage';
import { ChatState, Message } from "../utils/types";

const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      activeChatId: "",
      activeChatTitle: "",
      activeChatType: "",
      messageList: [],
      selectedDelItems: [],
      reAsked: false,
      isOnDelete: false,
      setActiveChatId: (activeChatId: string) => set({ activeChatId }),
      setActiveChatTitle: (activeChatTitle: string) => set({ activeChatTitle }),
      setActiveChatType: (activeChatType: string) => set({ activeChatType }),
      setMessageList: (messageList: Message[]) => set({ messageList }),
      resetChatData: () =>
        set({
          activeChatId: "",
          activeChatTitle: "",
          activeChatType: "",
          messageList: [],
          reAsked: false,
          isOnDelete: false,
          selectedDelItems: [],
        }),
      setReAsked: (reAsked: boolean) => set({ reAsked }),
      setSelectedDelItems: (selectedDelItems: string[]) =>
        set({ selectedDelItems }),
      setOnDelete: (isOnDelete: boolean) => set({ isOnDelete }),
    }),
    {
      name: "chat-storage",
      storage: {
        getItem: async (key: string) => {
          const value = await storage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key: string, value: StorageValue<ChatState>) => {
          return await storage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key: string) => {
          await storage.removeItem(key);
        },
      },
    }
  )
);

export default useChatStore;