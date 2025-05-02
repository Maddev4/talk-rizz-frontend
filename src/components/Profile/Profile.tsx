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

interface ProfileProps {
  profile: UserProfile;
  showDatingProfile?: boolean;
}

export const Profile: React.FC<ProfileProps> = ({
  profile,
  showDatingProfile = false,
}) => {
  const { basicProfile, generalProfile } = profile;

  return (
    <div className="profile-container">
      <IonCard>
        <IonCardHeader>
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              src={
                basicProfile.profilePicture ||
                "https://ionicframework.com/docs/img/demos/avatar.svg"
              }
              alt="Profile"
              className="flex justify-center items-center w-24 h-24 rounded-full text-center"
            />
            <IonCardTitle>{basicProfile.displayName}</IonCardTitle>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <p>{generalProfile.general}</p>
          <p>{generalProfile.friendship}</p>
          <p>{generalProfile.professional}</p>
          <p>{generalProfile.dating}</p>
        </IonCardContent>
      </IonCard>
    </div>
  );
};
