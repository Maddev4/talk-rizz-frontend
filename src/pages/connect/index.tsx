import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./Connect.css";

const Connect: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const history = useHistory();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option: string) => {
    // Handle option selection
    console.log("Selected:", option);
    history.push(`/app/connect/${option}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Connect</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="connect-container">
          <IonButton
            expand="block"
            className="connect-button"
            onClick={toggleDropdown}
          >
            Connect
          </IonButton>

          <div className="options-explanation">
            <h3>Explanation of what each mode do.</h3>
          </div>
          {showDropdown && (
            <IonCard className="connection-options">
              <IonCardContent>
                <h2 className="text-center">Connect Options</h2>
                <IonList className="flex flex-col items-center w-full">
                  <IonItem button onClick={() => handleOptionClick("random")}>
                    <IonLabel>Random</IonLabel>
                  </IonItem>
                  <IonItem
                    button
                    onClick={() => handleOptionClick("surprise-me")}
                  >
                    <IonLabel>Surprise!</IonLabel>
                  </IonItem>
                  <IonItem
                    button
                    onClick={() => handleOptionClick("friendship")}
                  >
                    <IonLabel>Friendship</IonLabel>
                  </IonItem>
                  <IonItem
                    button
                    onClick={() => handleOptionClick("professional")}
                  >
                    <IonLabel>Professional</IonLabel>
                  </IonItem>
                  <IonItem button onClick={() => handleOptionClick("dating")}>
                    <IonLabel>Dating</IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Connect;
