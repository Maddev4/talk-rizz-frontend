import { IonButton, IonImg, IonPage } from "@ionic/react";
import { useIonRouter } from "@ionic/react";

const Onboarding: React.FC = () => {
  const router = useIonRouter();

  const handleContinue = () => {
    router.push("/onboarding-chat", "forward");
  };

  return (
    <IonPage>
      <div className="onboarding-background h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div
            className="text-white text-lg font-bold bg-black p-4 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer shadow-lg hover:shadow-xl"
            onClick={handleContinue}
          >
            Connect
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Onboarding;
