import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonToast,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { pencil, checkmark } from "ionicons/icons";
import { useAuth } from "../../contexts/AuthContext";
import { Profile } from "../../components/Profile/Profile";
import { ProfileEditor } from "../../components/Profile/ProfileEditor";
import { UserProfile } from "../../types/profile";
import "./index.css";
import { Capacitor } from "@capacitor/core";

const ProfilePage: React.FC = () => {
  const { profile: authProfile, setProfile: setAuthProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(
    authProfile || undefined
  );

  useEffect(() => {
    // Convert the auth profile to the UserProfile format
    if (authProfile) {
      const formattedProfile: UserProfile = {
        ...authProfile,
        basicProfile: {
          ...authProfile.basicProfile,
        },
        generalProfile: {
          ...authProfile.generalProfile,
        },
      };
      setUserProfile(formattedProfile);
    }
  }, [authProfile]);

  const handleProfileSave = async (updatedProfile: UserProfile) => {
    try {
      // Update the profile in the backend
      console.log("Updating profile:", updatedProfile);

      // Update local state
      setAuthProfile(updatedProfile as UserProfile);
      setUserProfile(updatedProfile);
      setIsEditing(false);

      setToastMessage("Profile updated successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setToastMessage("Failed to update profile");
      setShowToast(true);
    }
  };

  // Debug logging
  console.log("ProfilePage - authProfile:", authProfile);
  console.log("ProfilePage - userProfile:", userProfile);

  if (!userProfile) {
    return (
      <IonPage className="h-full overflow-auto">
        <IonHeader>
          <IonToolbar
            style={{
              height: Capacitor.getPlatform() === "ios" ? "60px" : "60px",
              paddingTop: "5px",
            }}
          >
            <IonTitle
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
              }}
            >
              Profile
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent
          className="ion-padding"
          style={{
            paddingBottom: "120px",
            minHeight: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <p>Loading profile...</p>
            <p>Debug: authProfile is {authProfile ? "available" : "null"}</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="h-full overflow-auto">
      <IonHeader>
        <IonToolbar
          style={{
            height: Capacitor.getPlatform() === "ios" ? "60px" : "60px",
            paddingTop: "5px",
          }}
        >
          <IonTitle
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            Profile
          </IonTitle>
          <IonButton
            onClick={() => setIsEditing(!isEditing)}
            fill="clear"
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ion-color-primary)",
              fontSize: "20px",
              width: "44px",
              height: "44px",
              zIndex: 1,
            }}
          >
            <IonIcon icon={isEditing ? checkmark : pencil} slot="icon-only" />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding"
        style={{
          paddingBottom: "120px", // Add extra padding to account for the fixed tab bar
          minHeight: "100%",
        }}
      >
        {isEditing ? (
          <ProfileEditor
            initialProfile={userProfile}
            onSave={handleProfileSave}
          />
        ) : (
          <Profile profile={userProfile} showDatingProfile={true} />
        )}

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
