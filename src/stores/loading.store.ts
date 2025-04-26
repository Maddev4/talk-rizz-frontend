import { create } from "zustand";
import { LoadingState } from "../utils/types";

const useLoadingStore = create<LoadingState>()((set) => ({
  isLoading: false, // Initial state
  loadingText: "Loading...",
  setLoading: (isLoading: boolean, loadingText: string = "Loading...") =>
    set({ isLoading, loadingText }), // Action to complete onboarding
  messageLoading: false,
  setMessageLoading: (messageLoading: boolean) => set({ messageLoading }),
}));

export default useLoadingStore;
