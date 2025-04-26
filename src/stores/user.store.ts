import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import storage from '../storage';
import { UserState, User, FeedbackModalInfo } from "../utils/types";

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: { id: "" },
      followUpAvailable: "None",
      customPromptActiveState: true,
      hapticFeedback: true,
      visiblePaywall: false,
      isSubscribedUser: false,
      feedbackModalInfo: { type: 0, visible: false },
      setUser: (user: User) => set({ user }),
      setFollowUpAvailable: (followUpAvailable: string) =>
        set({ followUpAvailable }),
      setCustomPromptActiveState: (customPromptActiveState: boolean) =>
        set({ customPromptActiveState }),
      setHapticFeedback: (hapticFeedback: boolean) => set({ hapticFeedback }),
      setVisiblePaywall: (visiblePaywall: boolean) => set({ visiblePaywall }),
      setIsSubscribedUser: (isSubscribedUser: boolean) =>
        set({ isSubscribedUser }),
      setFeedbackModalInfo: (feedbackModalInfo: FeedbackModalInfo) =>
        set({ feedbackModalInfo }),
    }),
    {
      name: "user-storage", // Unique name for storage
      storage: {
        getItem: async (key: string) => {
          const value = await storage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key: string, value: StorageValue<UserState>) => {
          return await storage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key: string) => {
          await storage.removeItem(key);
        },
      },
    }
  )
);

export default useUserStore;