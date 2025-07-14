import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { checkmarkCircle, closeCircle } from "ionicons/icons";
import { UserProfile } from "../../types/profile";
import { IonButton } from "@ionic/react";
import { useAuth } from "../../contexts/AuthContext";
interface ProfileProps {
  profile: UserProfile;
  showDatingProfile?: boolean;
}

export const Profile: React.FC<ProfileProps> = ({
  profile,
  showDatingProfile = false,
}) => {
  const { basicProfile, generalProfile } = profile;
  const { signOut } = useAuth();

  // Debug logging
  console.log("Profile component - profile:", profile);
  console.log("Profile component - basicProfile:", basicProfile);
  console.log("Profile component - generalProfile:", generalProfile);

  return (
    <div
      className="profile-container"
      style={{ minHeight: "100%", paddingBottom: "20px" }}
    >
      <IonCard>
        <IonCardHeader>
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              src={
                basicProfile?.profilePicture ||
                "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"
                // "https://ionicframework.com/docs/img/demos/avatar.svg"
              }
              alt="Profile"
              className="flex justify-center items-center w-24 h-24 rounded-full text-center"
            />
            <IonCardTitle style={{ color: "var(--ion-text-color-secondary)" }}>
              {basicProfile?.name || "No name set"}
            </IonCardTitle>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <p>{generalProfile?.general || "No general info available"}</p>
          <p>{generalProfile?.friendship || "No friendship info available"}</p>
          <p>
            {generalProfile?.professional || "No professional info available"}
          </p>
          <p>{generalProfile?.dating || "No dating info available"}</p>
        </IonCardContent>
        <div className="flex justify-center mt-4">
          <IonButton expand="block" color="danger" onClick={() => signOut()}>
            Logout
          </IonButton>
        </div>
      </IonCard>
    </div>
  );
};
