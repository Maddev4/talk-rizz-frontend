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
    profilePicture?: File
  ): Promise<AxiosResponse<UserProfile>> {
    console.log(profile);
    if (!profile) {
      throw new Error("Profile is required");
    }
    const formData = new FormData();
    formData.append("profile", JSON.stringify(profile));

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    console.log(formData);

    const response = await axiosInstance.put(`/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
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
