import { IonButton, IonImg, IonPage } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import CustomButton from "../../components/CustomButton";

const Onboarding: React.FC = () => {

  const router = useIonRouter();

  const handleContinue = () => {
    router.push('/onboarding-main', 'forward');
  }

  return (
    <IonPage>
      <div className="background h-screen flex items-center justify-center">
        <div className="flex flex-col justify-between items-center h-[70%] w-[90%] relative">
          <img
            className="w-26 mt-12 animate-spin"
            src="assets/images/Logo.png"
            alt="Logo"
            style={{ animationDuration: "8s" }}
          />
          <div className="flex items-center justify-center flex-col gap-2 mt-16">
            <div className="flex flex-col items-center justify-center">
              <p className="uppercase font-bold text-xl text-[var(--ion-text-primary)]">
                world's best{" "}
                <span className="text-[var(--ion-color-primary)]">
                  ai assistant
                </span>
              </p>
              <p className="uppercase font-bold text-xl text-[var(--ion-text-primary)]">
                in your pocket
              </p>
            </div>
            <div className="px-4 py-2 rounded-full border border-white/30 bg-[#FFFFFF10] mt-1 flex gap-1 w-max">
              <p className="text-[var(--ion-text-primary)] text-sm font-[500]">
                Powered by
              </p>
              <p className="text-[var(--ion-color-primary)] text-sm font-[800]">
                ChatGPT's Latest AI
              </p>
            </div>
            <IonImg
              className="w-26 mt-4"
              src="assets/images/ReviewLogo.svg"
              alt="Logo"
            />
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <CustomButton
              className="flex items-center justify-center gap-2"
              onClick={handleContinue}
            >
              <span>Continue</span>
              <IonImg src="assets/svgs/rightarrowsm.svg" alt="arrow" />
            </CustomButton>
          </div>
          <div className="flex flex-col justify-between items-center mt-4 absolute bottom-[-45px]">
            <p className="text-xs text-[var(--ion-color-disable)]">
              By proceeding, you accept our
            </p>
            <p className="text-xs text-[var(--ion-color-disable)]">
              <a
                href="https://docs.google.com/document/d/1-clsqmW9yq9EL2dR4SIRZATb8EipCnJERfysWPGTiEE/edit"
                className="text-[var(--ion-text-primary)] text-[13px] underline"
                target="_blank"
              >
                Terms of use
              </a>
              <span> and </span>
              <a
                href="https://docs.google.com/document/d/1UgMUsitqt0Kd-wjoBGtsSqhKCyYu6TMTIBdn0PpLCKY/edit"
                className="text-[var(--ion-text-primary)] text-[13px] underline"
                target="_blank"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </IonPage>
  );
}

export default Onboarding;