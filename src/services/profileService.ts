import { UserProfile } from "../types/profile";
import axiosInstance from "../config/axios";
import { AxiosResponse } from "axios";

class ProfileService {
  async getUserProfile(userId?: string): Promise<AxiosResponse<UserProfile>> {
    const response = await axiosInstance.get(`/profile/${userId || ""}`);
    return response;
  }

  async createProfile(profile: {
    name: string;
  }): Promise<AxiosResponse<UserProfile>> {
    const response = await axiosInstance.post(`/profile`, profile);
    return response;
  }

  async updateProfile(
    profile: UserProfile,
    profilePicture?: File | null
  ): Promise<AxiosResponse<UserProfile>> {
    console.log("Profile service - updating profile:", profile);
    console.log("Profile service - profilePicture:", profilePicture);

    if (!profile) {
      throw new Error("Profile is required");
    }

    // Validate profile data
    if (!profile.basicProfile?.name?.trim()) {
      throw new Error("Profile name is required");
    }

    const hasImageFile =
      profilePicture &&
      profilePicture instanceof File &&
      profilePicture.size > 0;

    if (hasImageFile) {
      // Case 1: Profile update WITH image upload
      console.log("Profile service - sending FormData with image file:");
      console.log("- profile data:", JSON.stringify(profile, null, 2));
      console.log("- image file size:", profilePicture.size, "bytes");
      console.log("- image file type:", profilePicture.type);

      const formData = new FormData();

      // Create a clean profile object without the base64 preview
      const cleanProfile = {
        ...profile,
        basicProfile: {
          ...profile.basicProfile,
          profilePicture: "", // Reset preview, let backend handle image URL
        },
      };

      formData.append("profile", JSON.stringify(cleanProfile));
      formData.append("profilePicture", profilePicture);

      // Log FormData contents for debugging
      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `- ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`- ${key}:`, value);
        }
      }

      const response = await axiosInstance.put(`/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } else {
      // Case 2: Profile update WITHOUT image upload (text-only changes)
      console.log("Profile service - sending JSON data (no image file):");
      console.log("- profile data:", JSON.stringify(profile, null, 2));

      // Clean the profile data before sending
      const cleanProfile = {
        userId: profile.userId,
        basicProfile: {
          name: profile.basicProfile.name?.trim() || "",
          displayName: profile.basicProfile.displayName?.trim() || "",
          location: profile.basicProfile.location?.trim() || "",
          languages: profile.basicProfile.languages || [],
          birthday: profile.basicProfile.birthday || "",
          gender: profile.basicProfile.gender || "",
          profilePicture: profile.basicProfile.profilePicture || "",
        },
        generalProfile: {
          friendship: profile.generalProfile.friendship?.trim() || "",
          professional: profile.generalProfile.professional?.trim() || "",
          dating: profile.generalProfile.dating?.trim() || "",
          general: profile.generalProfile.general?.trim() || "",
        },
        premiumFeatures: profile.premiumFeatures,
        rizzCode: profile.rizzCode,
        rizzPoint: profile.rizzPoint,
      };

      console.log(
        "Profile service - cleaned profile data:",
        JSON.stringify(cleanProfile, null, 2)
      );

      const response = await axiosInstance.put(`/profile`, cleanProfile, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response;
    }
  }

  async getOtherProfiles(): Promise<AxiosResponse<UserProfile[]>> {
    const response = await axiosInstance.get(`/profile/others`);
    return response;
  }

  async getMatchProfile(
    userId: string,
    matchType: "general" | "dating"
  ): Promise<UserProfile> {
    const response = await axiosInstance.get(`/profile/${userId}/match`, {
      params: { type: matchType },
    });
    return response.data;
  }

  async upgradeToPremium(userId: string): Promise<UserProfile> {
    const response = await axiosInstance.post(
      `/profile/${userId}/premium/upgrade`
    );
    return response.data;
  }
}

export const profileService = new ProfileService();
