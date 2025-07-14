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
    console.log("ProfileService - updateProfile called with:");
    console.log("- profile:", JSON.stringify(profile, null, 2));
    console.log(
      "- profilePicture:",
      profilePicture
        ? {
            name: profilePicture.name,
            size: profilePicture.size,
            type: profilePicture.type,
          }
        : "No file"
    );

    if (!profile) {
      throw new Error("Profile data is required");
    }

    // Validate required fields
    if (!profile.basicProfile?.name?.trim()) {
      throw new Error("Profile name is required");
    }

    try {
      // Check if we have a valid image file to upload
      const hasImageFile =
        profilePicture &&
        profilePicture instanceof File &&
        profilePicture.size > 0;

      if (hasImageFile) {
        // Case 1: Profile update WITH image upload using FormData
        console.log("ProfileService - uploading profile WITH image file");

        // Validate file type
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!validTypes.includes(profilePicture.type)) {
          throw new Error(
            "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
          );
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (profilePicture.size > maxSize) {
          throw new Error("File size too large. Maximum size is 5MB.");
        }

        const formData = new FormData();

        // Prepare clean profile data (without the base64 preview)
        const cleanProfile: UserProfile = {
          userId: profile.userId,
          basicProfile: {
            name: profile.basicProfile.name.trim(),
            displayName:
              profile.basicProfile.displayName?.trim() ||
              profile.basicProfile.name.trim(),
            location: profile.basicProfile.location?.trim() || "",
            languages: profile.basicProfile.languages || [],
            birthday: profile.basicProfile.birthday || "",
            gender: profile.basicProfile.gender || "",
            profilePicture: "", // Will be set by backend after upload
          },
          generalProfile: {
            friendship: profile.generalProfile?.friendship?.trim() || "",
            professional: profile.generalProfile?.professional?.trim() || "",
            dating: profile.generalProfile?.dating?.trim() || "",
            general: profile.generalProfile?.general?.trim() || "",
          },
          premiumFeatures: profile.premiumFeatures || {
            maxMustHaves: 3,
            maxDealBreakers: 3,
          },
          rizzCode: profile.rizzCode,
          rizzPoint: profile.rizzPoint || 0,
        };

        // Append profile data as JSON string
        formData.append("profile", JSON.stringify(cleanProfile));
        // Append the image file
        formData.append("profilePicture", profilePicture);

        console.log("ProfileService - sending FormData:");
        console.log(
          "- profile data size:",
          JSON.stringify(cleanProfile).length,
          "characters"
        );
        console.log(
          "- image file:",
          profilePicture.name,
          profilePicture.size,
          "bytes"
        );

        const response = await axiosInstance.put("/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout for file uploads
        });

        console.log(
          "ProfileService - FormData response status:",
          response.status
        );
        return response;
      } else {
        // Case 2: Profile update WITHOUT image upload (JSON only)
        console.log(
          "ProfileService - updating profile WITHOUT image file (JSON only)"
        );

        // Prepare clean profile data
        const cleanProfile: UserProfile = {
          userId: profile.userId,
          basicProfile: {
            name: profile.basicProfile.name.trim(),
            displayName:
              profile.basicProfile.displayName?.trim() ||
              profile.basicProfile.name.trim(),
            location: profile.basicProfile.location?.trim() || "",
            languages: profile.basicProfile.languages || [],
            birthday: profile.basicProfile.birthday || "",
            gender: profile.basicProfile.gender || "",
            profilePicture: profile.basicProfile.profilePicture || "",
          },
          generalProfile: {
            friendship: profile.generalProfile?.friendship?.trim() || "",
            professional: profile.generalProfile?.professional?.trim() || "",
            dating: profile.generalProfile?.dating?.trim() || "",
            general: profile.generalProfile?.general?.trim() || "",
          },
          premiumFeatures: profile.premiumFeatures || {
            maxMustHaves: 3,
            maxDealBreakers: 3,
          },
          rizzCode: profile.rizzCode,
          rizzPoint: profile.rizzPoint || 0,
        };

        console.log(
          "ProfileService - sending clean JSON data:",
          JSON.stringify(cleanProfile, null, 2)
        );

        const response = await axiosInstance.put("/profile", cleanProfile, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15 second timeout for JSON requests
        });

        console.log("ProfileService - JSON response status:", response.status);
        return response;
      }
    } catch (error: any) {
      console.error("ProfileService - updateProfile error:", error);

      // Handle specific error cases
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message =
          error.response.data?.error ||
          error.response.data?.message ||
          "Unknown server error";

        switch (status) {
          case 400:
            throw new Error(message || "Invalid profile data");
          case 401:
            throw new Error("Please log in again");
          case 413:
            throw new Error(
              "Image file is too large. Please choose a smaller image."
            );
          case 415:
            throw new Error(
              "Unsupported image format. Please use JPEG, PNG, GIF, or WebP."
            );
          case 500:
            throw new Error("Server error. Please try again later.");
          default:
            throw new Error(message || `Request failed with status ${status}`);
        }
      } else if (error.request) {
        // Network error
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Other error (validation, etc.)
        throw error;
      }
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
