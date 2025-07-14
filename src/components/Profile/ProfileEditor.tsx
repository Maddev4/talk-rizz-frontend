import React, { useState, useRef } from "react";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonList,
  IonChip,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonImg,
  IonToast,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { add, close, camera } from "ionicons/icons";
import { UserProfile, BasicProfile, GeneralProfile } from "../../types/profile";
import { profileService } from "../../services/profileService";

interface ProfileEditorProps {
  initialProfile?: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  initialProfile,
  onSave,
}) => {
  const [activeSegment, setActiveSegment] = useState<"general" | "profile">(
    "general"
  );
  const [profile, setProfile] = useState<UserProfile>(() => {
    console.log("ProfileEditor - initialProfile:", initialProfile);
    return (
      initialProfile || {
        basicProfile: {
          name: "",
          displayName: "",
          location: "",
          languages: [],
          birthday: "",
          gender: "",
          profilePicture: "",
        },
        generalProfile: {
          friendship: "",
          professional: "",
          dating: "",
          general: "",
        },
        userId: undefined,
        rizzCode: undefined,
        rizzPoint: 0,
      }
    );
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleBasicProfileChange = (
    field: keyof BasicProfile,
    value: string
  ) => {
    setProfile({
      ...profile,
      basicProfile: {
        ...profile.basicProfile,
        [field]: value,
      },
    });
  };

  const handleGeneralProfileChange = (
    field: keyof GeneralProfile,
    value: string
  ) => {
    setProfile({
      ...profile,
      generalProfile: {
        ...profile.generalProfile,
        [field]: value,
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("ProfileEditor - file selected:", file);

    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        setToastMessage(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        setShowToast(true);
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setToastMessage("Image file size must be less than 5MB");
        setShowToast(true);
        return;
      }

      console.log("ProfileEditor - valid file, creating preview");
      setSelectedFile(file);

      // Create a preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("ProfileEditor - preview created");
        handleBasicProfileChange("profilePicture", reader.result as string);
      };
      reader.onerror = () => {
        console.error("ProfileEditor - error reading file");
        setToastMessage("Error reading image file");
        setShowToast(true);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("ProfileEditor - no file selected, clearing selection");
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (isLoading) {
      return; // Prevent multiple submissions
    }

    try {
      setIsLoading(true);
      console.log("ProfileEditor - handleSubmit called");

      // Validate required fields
      if (!profile.basicProfile.name?.trim()) {
        setToastMessage("Name is required");
        setShowToast(true);
        return;
      }

      // Determine if we're uploading an image
      const hasImageUpload =
        selectedFile && selectedFile instanceof File && selectedFile.size > 0;

      console.log("ProfileEditor - profile update:", {
        hasImageUpload,
        profileName: profile.basicProfile.name,
        imageFile: hasImageUpload
          ? {
              name: selectedFile.name,
              size: selectedFile.size,
              type: selectedFile.type,
            }
          : null,
      });

      // Call the profile update service
      const response = await profileService.updateProfile(
        profile,
        selectedFile
      );

      console.log("ProfileEditor - profile update successful");
      const updatedProfile = response.data;

      // Pass the updated profile back to parent
      onSave({
        basicProfile: updatedProfile.basicProfile,
        generalProfile: updatedProfile.generalProfile,
        premiumFeatures: updatedProfile.premiumFeatures,
        userId: updatedProfile.userId,
        rizzCode: updatedProfile.rizzCode,
        rizzPoint: updatedProfile.rizzPoint,
      });

      // Clear the selected file after successful upload
      if (hasImageUpload) {
        setSelectedFile(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        console.log(
          "ProfileEditor - cleared selected file after successful upload"
        );
      }

      setToastMessage("Profile updated successfully!");
      setShowToast(true);
    } catch (error: any) {
      console.error("ProfileEditor - error updating profile:", error);

      // Extract error message from the service layer
      let errorMessage = "Failed to save profile";
      if (error?.message) {
        errorMessage = error.message;
      }

      setToastMessage(errorMessage);
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeToPremium = async () => {
    try {
      const updatedProfile = await profileService.upgradeToPremium(
        profile.userId!
      );
      setProfile(updatedProfile);
      setToastMessage("Successfully upgraded to premium!");
      setShowToast(true);
    } catch (error) {
      setToastMessage("Failed to upgrade to premium");
      setShowToast(true);
    }
  };

  return (
    <IonContent>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <IonSegment
        value={activeSegment}
        onIonChange={(e) => setActiveSegment(e.detail.value as any)}
      >
        <IonSegmentButton value="general">General</IonSegmentButton>
        <IonSegmentButton value="profile">Profile</IonSegmentButton>
      </IonSegment>

      {activeSegment === "general" && (
        <IonList>
          <IonItem className="ion-text-center">
            <div className="w-full">
              <img
                src={
                  profile.basicProfile.profilePicture ||
                  "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"
                  // "https://ionicframework.com/docs/img/demos/avatar.svg"
                }
                className="w-32 h-32 rounded-full mx-auto object-cover"
                onClick={() => fileInputRef.current?.click()}
              />
              <IonButton
                fill="clear"
                size="small"
                onClick={() => fileInputRef.current?.click()}
              >
                <IonIcon icon={camera} slot="start" />
                Change Photo
              </IonButton>
            </div>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              value={profile.basicProfile.name}
              onIonChange={(e) =>
                handleBasicProfileChange("name", e.detail.value!)
              }
            />
          </IonItem>
          {/* <IonItem>
            <IonLabel position="stacked">Display Name</IonLabel>
            <IonInput
              value={profile.basicProfile.displayName}
              onIonChange={(e) =>
                handleBasicProfileChange("displayName", e.detail.value!)
              }
            />
          </IonItem> */}
          <IonItem>
            <IonLabel position="stacked">Location</IonLabel>
            <IonInput
              value={profile.basicProfile.location}
              onIonChange={(e) =>
                handleBasicProfileChange("location", e.detail.value!)
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Birthday</IonLabel>
            <IonInput
              type="date"
              value={profile.basicProfile.birthday}
              onIonChange={(e) =>
                handleBasicProfileChange("birthday", e.detail.value!)
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Gender</IonLabel>
            <IonSelect
              value={profile.basicProfile.gender}
              onIonChange={(e) =>
                handleBasicProfileChange("gender", e.detail.value!)
              }
              interface="popover"
              placeholder="Select gender"
              style={{
                "--color": "#ffffff",
                "--placeholder-color": "#ffffff",
              }}
            >
              <IonSelectOption value="male">Male</IonSelectOption>
              <IonSelectOption value="female">Female</IonSelectOption>
              <IonSelectOption value="non-binary">Non-binary</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      )}

      {activeSegment === "profile" && (
        <IonList>
          <IonItem>
            <IonLabel position="stacked">General</IonLabel>
            <IonTextarea
              value={profile.generalProfile.general}
              rows={3}
              onIonChange={(e) =>
                handleGeneralProfileChange("general", e.detail.value!)
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Friendship</IonLabel>
            <IonTextarea
              value={profile.generalProfile.friendship}
              rows={3}
              onIonChange={(e) =>
                handleGeneralProfileChange("friendship", e.detail.value!)
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Professional</IonLabel>
            <IonTextarea
              value={profile.generalProfile.professional}
              rows={3}
              onIonChange={(e) =>
                handleGeneralProfileChange("professional", e.detail.value!)
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Dating</IonLabel>
            <IonTextarea
              value={profile.generalProfile.dating}
              rows={3}
              onIonChange={(e) =>
                handleGeneralProfileChange("dating", e.detail.value!)
              }
            />
          </IonItem>
        </IonList>
      )}

      <div className="ion-padding">
        <IonButton expand="block" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Profile"}
        </IonButton>
      </div>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
      />
    </IonContent>
  );
};
