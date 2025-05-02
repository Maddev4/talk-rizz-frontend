import { useEffect } from "react";
import { IonPage, IonContent, IonSpinner } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Callback: React.FC = () => {
  const { handleAuthCallback } = useAuth();
  const history = useHistory();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await handleAuthCallback();
        // history.replace("/app/home");
        history.replace("/app/profile");
      } catch (error) {
        console.error("Error handling auth callback:", error);
        history.replace("/auth/login");
      }
    };

    handleRedirect();
  }, [handleAuthCallback, history]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <IonSpinner />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Callback;
