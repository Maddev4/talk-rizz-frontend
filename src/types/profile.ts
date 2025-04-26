export interface BasicProfile {
  name: string;
  displayName: string;
  location: string;
  languages: string[];
  birthday: string;
  gender: string;
  profilePicture: string;
}

export interface GeneralProfile {
  friendship: string;
  professional: string;
  dating: string;
}

export interface PremiumFeatures {
  maxMustHaves: number;
  maxDealBreakers: number;
}

export interface UserProfile {
  userId?: string;
  basicProfile: BasicProfile;
  generalProfile: GeneralProfile;
  premiumFeatures?: PremiumFeatures;
  rizzPoint?: number;
  rizzCode?: string;
}

export interface ProfileVisibility {
  showDatingProfile: boolean;
}
