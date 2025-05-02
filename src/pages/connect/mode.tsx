import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonToggle,
  IonIcon,
  IonCard,
  IonCardContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonInput,
  IonRange,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import {
  warningOutline,
  arrowBackOutline,
  checkmarkOutline,
  starOutline,
  trashOutline,
} from "ionicons/icons";
import axiosInstance from "../../config/axios";
import { connectService } from "../../services/connectService";
import { useAuth } from "../../contexts/AuthContext";
import { profileService } from "../../services/profileService";
import { useChat } from "../../contexts/ChatContext";
import Spinner from "../../components/Spinner";
import "./Mode.css";

interface ModeParams {
  mode: string;
}

interface Preferences {
  lookingFor: string;
  mustHave: Array<{
    name: string;
    value: number;
    icon: any;
  }>;
  dealBreakers: Array<{
    name: string;
    value: number;
    icon: any;
  }>;
}

const Mode: React.FC = () => {
  const { connect, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { sendNewRoom } = useChat();
  const { mode } = useParams<ModeParams>();
  const history = useHistory();
  const [detailMode, setDetailMode] = useState("");
  const [newMustHave, setNewMustHave] = useState({ name: "", value: 0 });
  const [newDealBreaker, setNewDealBreaker] = useState({
    name: "",
    value: 1.0,
  });
  const [isSaved, setIsSaved] = useState(true);
  const [preferences, setPreferences] = useState<Preferences>({
    lookingFor: connect?.dating?.lifePartner?.imLookingFor || "",
    mustHave: (connect?.dating?.lifePartner?.mustHave || []).map((item) => ({
      ...item,
      icon: starOutline,
    })),
    dealBreakers: (connect?.dating?.lifePartner?.dealBreakers || []).map(
      (item) => ({
        ...item,
        icon: warningOutline,
      })
    ),
  });

  const addMustHave = () => {
    if (newMustHave.name.trim()) {
      setPreferences({
        ...preferences,
        mustHave: [
          ...preferences.mustHave,
          {
            name: newMustHave.name,
            value: newMustHave.value,
            icon: starOutline,
          },
        ],
      });
      setNewMustHave({ name: "", value: 0 });
      setIsSaved(false);
    }
  };

  const addDealBreaker = () => {
    if (newDealBreaker.name.trim()) {
      setPreferences({
        ...preferences,
        dealBreakers: [
          ...preferences.dealBreakers,
          {
            name: newDealBreaker.name,
            value: newDealBreaker.value,
            icon: warningOutline,
          },
        ],
      });
      setNewDealBreaker({ name: "", value: 1.0 });
      setIsSaved(false);
    }
  };

  const removeItem = (type: "mustHave" | "dealBreakers", index: number) => {
    setPreferences({
      ...preferences,
      [type]: preferences[type].filter((_, i) => i !== index),
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    connectService.updateConnect({
      ...connect,
      dating: {
        ...connect?.dating,
        lifePartner: {
          imLookingFor: preferences.lookingFor,
          mustHave: preferences.mustHave.map((item) => ({
            name: item.name,
            value: item.value,
            icon: item.icon,
          })),
          dealBreakers: preferences.dealBreakers.map((item) => ({
            name: item.name,
            value: item.value,
            icon: item.icon,
          })),
        },
        longTerm: {},
        shortTerm: {},
        hookUp: {},
      },
      random: {},
      friendship: {},
      professional: {},
      surpriseMe: {},
    });
    setIsSaved(true);
  };

  const addRandomUser = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/chat/rooms");
      const userData = response.data;

      console.log("userData", userData);

      if (userData.length > 3) {
        setLoading(false);
        setToastMessage("You already have 3 conversations");
        setShowToast(true);
        return;
      }

      const response1 = await profileService.getOtherProfiles();
      console.log("response1", response1);
      const randomUser =
        response1.data[Math.floor(Math.random() * response1.data.length)];

      if (!randomUser) {
        setLoading(false);
        setToastMessage("No users found");
        setShowToast(true);
        return;
      }

      const handleSelectUser = async (selectedUser: any) => {
        try {
          // Create a new conversation with the selected user
          console.log("selectedUser", selectedUser);
          console.log("user", user);

          sendNewRoom({
            participants: [selectedUser.userId, user?.id],
            type: "direct",
            category: `${mode} - ${detailMode}`,
          });
          // Redirect to the conversation page
          // history.push(`/app/chat/${newChatroom._id}`);
        } catch (error) {
          console.error("Error creating conversation:", error);
        }
      };

      await handleSelectUser(randomUser);
    } catch (error) {
      console.error("Error fetching random user:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDatingOptions = () => (
    <IonCard className="dating-options">
      <IonCardContent>
        <h2>Dating</h2>
        <IonList>
          <IonItem button onClick={() => setDetailMode("lifePartner")}>
            <IonLabel>Life Partner</IonLabel>
          </IonItem>
          <IonItem button onClick={() => setDetailMode("longTerm")}>
            <IonLabel>Long-term</IonLabel>
          </IonItem>
          <IonItem button onClick={() => setDetailMode("shortTerm")}>
            <IonLabel>Short-term</IonLabel>
          </IonItem>
          <IonItem button onClick={() => setDetailMode("hookUp")}>
            <IonLabel>Hook-up</IonLabel>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );

  const renderLifePartnerPreferences = () => (
    <div className="life-partner-preferences">
      <h2>Dating / Life Partner</h2>

      <div className="preference-section">
        <h3>I'm looking</h3>
        <div className="looking-for-text">I like someone who codes</div>
      </div>

      <div className="preference-section">
        <h3>Must Have</h3>
        <IonList>
          {preferences.mustHave.map((item, index) => (
            <div key={index} className="flex items-center justify-between mb-3">
              <div className="flex gap-1 items-center">
                <IonIcon
                  icon={item.icon}
                  slot="start"
                  className="text-yellow-500 w-5 h-5"
                />
                <IonLabel>{item.name}</IonLabel>
              </div>
              <div className="flex gap-2 items-center">
                <div className="preference-score flex items-center text-sm">
                  ${item.value.toFixed(1)}
                </div>
                <div
                  className="flex items-center text-red-500"
                  onClick={() => removeItem("mustHave", index)}
                >
                  <IonIcon icon={trashOutline} className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </IonList>
        <div className="add-item-form">
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonItem>
                  <IonInput
                    value={newMustHave.name}
                    placeholder="New must-have item"
                    onIonChange={(e) =>
                      setNewMustHave({
                        ...newMustHave,
                        name: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>
              </IonCol>
              <IonCol size="2" className="ion-align-self-center">
                <IonButton expand="block" onClick={addMustHave}>
                  Add
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="flex items-center justify-between">
                  <IonRange
                    min={0}
                    max={1}
                    step={0.1}
                    value={newMustHave.value}
                    onIonChange={(e) =>
                      setNewMustHave({
                        ...newMustHave,
                        value: e.detail.value as number,
                      })
                    }
                  >
                    <IonLabel slot="start">0</IonLabel>
                    <IonLabel slot="end">1</IonLabel>
                  </IonRange>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </div>

      <div className="preference-section">
        <h3>Deal Breaker</h3>
        <IonList>
          {preferences.dealBreakers.map((item, index) => (
            <div key={index} className="flex items-center justify-between mb-3">
              <div className="flex gap-1 items-center">
                <IonIcon
                  icon={item.icon}
                  slot="start"
                  className="text-red-500 w-5 h-5"
                />
                <IonLabel>{item.name}</IonLabel>
              </div>
              <div className="flex gap-2 items-center">
                <div className="preference-score flex items-center text-sm">
                  ${item.value.toFixed(1)}
                </div>
                <div
                  className="flex items-center text-red-500"
                  onClick={() => removeItem("dealBreakers", index)}
                >
                  <IonIcon icon={trashOutline} className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </IonList>
        <div className="add-item-form">
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonItem>
                  <IonInput
                    value={newDealBreaker.name}
                    placeholder="New deal breaker"
                    onIonChange={(e) =>
                      setNewDealBreaker({
                        ...newDealBreaker,
                        name: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>
              </IonCol>
              <IonCol size="2" className="ion-align-self-center">
                <IonButton expand="block" onClick={addDealBreaker}>
                  Add
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="flex items-center justify-between">
                  <IonRange
                    min={0}
                    max={1}
                    step={0.1}
                    value={newDealBreaker.value}
                    onIonChange={(e) =>
                      setNewDealBreaker({
                        ...newDealBreaker,
                        value: e.detail.value as number,
                      })
                    }
                  >
                    <IonLabel slot="start">0</IonLabel>
                    <IonLabel slot="end">1</IonLabel>
                  </IonRange>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </div>

      <IonButton
        expand="block"
        className="save-button"
        color="tertiary"
        onClick={handleSave}
      >
        {isSaved && <IonIcon icon={checkmarkOutline} className="checkmark" />}
        Save
      </IonButton>

      <IonButton
        expand="block"
        className="connect-now-button"
        onClick={addRandomUser}
      >
        Connect Now!
      </IonButton>
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons
            slot="start"
            style={{ position: "absolute", left: "8px" }}
            onClick={() => {
              if (detailMode) {
                setDetailMode("");
              } else {
                history.push("/app/connect");
              }
            }}
          >
            <IonIcon icon={arrowBackOutline} />
          </IonButtons>
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <IonTitle>{mode.charAt(0).toUpperCase() + mode.slice(1)}</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <Spinner />
        ) : (
          <div className="mode-container h-full overflow-auto">
            {mode === "dating" && !detailMode.length && renderDatingOptions()}
            {mode === "dating" &&
              detailMode === "lifePartner" &&
              renderLifePartnerPreferences()}
          </div>
        )}
      </IonContent>
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={3000}
        onDidDismiss={() => setShowToast(false)}
      />
    </IonPage>
  );
};

export default Mode;
