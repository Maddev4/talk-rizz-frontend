// Onborading
export interface OnboardingState {
    isOnboardingComplete: boolean;
    completeOnboarding: () => void;
    isAboutMeCompleted: boolean;
    setIsAboutMeCompleted: () => void;
}

// Category
export interface Category {
  categoryName: string;
  emotion: string;
  categoryPrompts: Prompt[];
  type: string;
}

export interface Prompt {
  main: string;
  description: string;
  image?: string;
}

export interface CategoryState {
  selectedCategories: Category[];
  categories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  setCategories: (categories: Category[]) => void;
  activeCategory: Category | null;
  setActiveCategory: (activeCategory: Category) => void;
}

// User Info

export interface UserState {
  user: User;
  setUser: (user: User) => void;
  followUpAvailable: string;
  setFollowUpAvailable: (followUpAvailable: string) => void;
  customPromptActiveState: boolean;
  setCustomPromptActiveState: (customPromptActiveState: boolean) => void;
  hapticFeedback: boolean;
  setHapticFeedback: (hapticFeedback: boolean) => void;
  visiblePaywall: boolean;
  setVisiblePaywall: (visible: boolean) => void;
  isSubscribedUser: boolean;
  setIsSubscribedUser: (isSubscribedUser: boolean) => void;
  feedbackModalInfo: FeedbackModalInfo;
  setFeedbackModalInfo: (feedbackModalInfo: FeedbackModalInfo) => void;
}

export interface User {
  id: string;
}

export interface FeedbackModalInfo {
  visible: boolean;
  type: number;
}

// Chat

export interface ChatState {
  activeChatId: string;
  activeChatTitle: string;
  activeChatType: string;
  messageList: Message[];
  reAsked: boolean;
  selectedDelItems: string[];
  isOnDelete: boolean;
  setActiveChatId: (activeChatId: string) => void;
  setActiveChatTitle: (activeChatTitle: string) => void;
  setActiveChatType: (activeChatType: string) => void;
  setMessageList: (messageList: Message[]) => void;
  resetChatData: () => void;
  setReAsked: (reAsked: boolean) => void;
  setSelectedDelItems: (selectedDelItems: string[]) => void;
  setOnDelete: (isOnDelete: boolean) => void;
}
export interface Message {
  messageId: string;
  data: string;
  metaData: string;
  userId: string;
  sender: string;
  type: string;
}

// Loading State

export interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  setLoading: (isLoading: boolean, loadingText?: string) => void;
  messageLoading: boolean;
  setMessageLoading: (messageLoading: boolean) => void;
}