import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import storage from '../storage';
import { OnboardingState } from "../utils/types";

const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboardingComplete: false, // Initial state
      completeOnboarding: () => set({ isOnboardingComplete: true }), // Action to complete onboarding
      isAboutMeCompleted: false,
      setIsAboutMeCompleted: () => set({ isAboutMeCompleted: true })
    }),
    {
      name: 'onboarding-storage', // Unique name for storage
      storage: {
        getItem: async (key: string) => {
          const value = await storage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key: string, value: StorageValue<OnboardingState>) => {
          return await storage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key: string) => {
          await storage.removeItem(key);
        }
      }
    }
  )
);

export default useOnboardingStore;