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
  const [profile, setProfile] = useState<UserProfile>(
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
    }
  );

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        handleBasicProfileChange("profilePicture", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Profile:", profile);
      const response = await profileService.updateProfile(
        profile,
        selectedFile || undefined
      );
      const updatedProfile = response.data;
      console.log("Updated profile:", updatedProfile);
      onSave({
        basicProfile: updatedProfile.basicProfile,
        generalProfile: updatedProfile.generalProfile,
        premiumFeatures: updatedProfile.premiumFeatures,
        userId: updatedProfile.userId,
        rizzCode: updatedProfile.rizzCode,
        rizzPoint: updatedProfile.rizzPoint,
      });
    } catch (error) {
      setToastMessage("Failed to save profile");
      setShowToast(true);
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
                  "https://ionicframework.com/docs/img/demos/avatar.svg"
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
          <IonItem>
            <IonLabel position="stacked">Display Name</IonLabel>
            <IonInput
              value={profile.basicProfile.displayName}
              onIonChange={(e) =>
                handleBasicProfileChange("displayName", e.detail.value!)
              }
            />
          </IonItem>
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
        <IonButton expand="block" onClick={handleSubmit}>
          Save Profile
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
