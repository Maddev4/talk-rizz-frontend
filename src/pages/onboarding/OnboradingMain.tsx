import { useState, useEffect, useRef } from "react";
import { IonPage, IonImg } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import CustomButton from "../../components/CustomButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import useHapticFeedback from "../../hooks/useHapticFeedback";
import useLoadingStore from "../../stores/loading.store";
import useChatStore from "../../stores/chat.store";
import useUserStore from "../../stores/user.store";
import "swiper/css";
import "@ionic/react/css/ionic-swiper.css";
import { Device } from "@capacitor/device";
import { getUser } from "../../apis/User";
import { CHAT_TYPE, MESSAGE_TYPE } from "../../utils/constants";
import { createChat } from "../../apis/Chat";
import { generateUniqueId } from "../../utils/generateUniqueId";

interface OnboardingMainProps {
  // Add any props if needed
}

const OnboardingMain: React.FC<OnboardingMainProps> = () => {
  const router = useIonRouter();

  const [index, setIndex] = useState<number>(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const { hapticsImpactMedium } = useHapticFeedback();

  const { isLoading, setLoading } = useLoadingStore();
  const { user, setUser } = useUserStore();
  const {
    setMessageList,
    setActiveChatId,
    setActiveChatTitle,
    setActiveChatType,
  } = useChatStore();

  const onSlideChange = (e: { activeIndex: number }) => {
    const { activeIndex } = e;
    setIndex(activeIndex);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const info = await Device.getId();
    console.log(Device);
    console.log(info);
    const response = await getUser(info.identifier);
    setUser({ id: response.user._id });
  };

  const handleContinue = async () => {
    hapticsImpactMedium();
    if (swiperRef.current && index < 2) {
      swiperRef.current.slideNext();
    } else {
      console.log(user);
      if (!user.id) return;
      setLoading(true, "Just a minute...");
      const prompt = "What is your goal with using AI?";
      const messageId = generateUniqueId(prompt);
      const response = await createChat(
        user.id,
        CHAT_TYPE.Text,
        prompt,
        messageId,
        null
      );
      setLoading(false);
      setActiveChatId(response.chat._id);
      setActiveChatTitle(response.chat.title);
      setActiveChatType(CHAT_TYPE.Text);
      setMessageList([
        {
          messageId,
          data: prompt,
          userId: user.id,
          sender: MESSAGE_TYPE.AIAssistant,
          type: CHAT_TYPE.Text,
          metaData: "",
        },
      ]);
      router.push("/chat", "forward", "push");
    }
  };

  const activeClass =
    "w-4 h-2 rounded-full bg-white transition-all duration-500";
  const deactiveClass =
    "w-2 h-2 rounded-full bg-[#353535] transition-all duration-500";

  return (
    <IonPage>
      <div className="background h-screen flex items-center justify-center">
        <div className="flex flex-col justify-between items-center h-[70%] w-full relative gap-8">
          <div className="w-full flex-1">
            <Swiper
              className="h-full"
              onSlideChange={onSlideChange}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              allowTouchMove={false}
            >
              <SwiperSlide className="h-full">
                <div className="flex-col !justify-between h-full w-[90%] flex">
                  <div className="!h-[70%] flex flex-col justify-between items-center">
                    <img
                      src="assets/images/onboarding-logo-1.png"
                      className="!h-[65%] w-auto"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <p className="uppercase font-bold text-xl text-[var(--ion-text-primary)]">
                        Empower Your Life with
                      </p>
                      <p className="uppercase font-bold text-xl text-[var(--ion-text-primary)]">
                        Our Advanced{" "}
                        <span className="text-[var(--ion-color-primary)]">
                          ai assistant
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-white text-[15px]">
                    Our cutting-edge AI chatbot excels at providing answers to
                    any question.
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide className="h-full">
                <div className="flex-col !justify-between h-full w-[90%] flex">
                  <div className="!h-[70%] flex flex-col justify-between items-center">
                    <img
                      src="assets/images/onboarding-logo-2.png"
                      className="!h-[55%] w-auto"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <p className="uppercase font-bold text-xl text-[var(--ion-text-primary)]">
                        Unlock Instant Answers with
                      </p>
                      <p className="uppercase font-bold text-xl text-[var(--ion-text-primary)]">
                        Our{" "}
                        <span className="text-[var(--ion-color-primary)]">
                          AI-Powered
                        </span>{" "}
                        Smart Scan
                      </p>
                    </div>
                  </div>
                  <p className="text-white text-[15px]">
                    Utilize our AI-powered smart scan feature to easily scan,
                    analyze, translate, or create a summary with instant
                    solutions at your fingertips.
                    <br />
                    <br />
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide className="h-full">
                <div className="flex-col !justify-between h-full w-[90%] flex">
                  <div className="!h-[70%] flex flex-col justify-between items-center">
                    <img
                      src="assets/images/onboarding-logo-3.png"
                      className="!h-[65%] w-auto"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <p className="uppercase font-bold text-xl text-[var(--ion-text-primary)]">
                        Experience the future of{" "}
                        <span className="text-[var(--ion-color-primary)]  whitespace-nowrap">
                          AI Assistance
                        </span>{" "}
                        with Millions of Delighted Users
                      </p>
                    </div>
                  </div>
                  <p className="text-white text-[15px]">
                    Our AI assistant app offers robust AI tools to simplify your
                    life and support you in every task imaginable.
                    <br />
                    <br />
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="flex gap-2 justify-center">
            <div className={index == 0 ? activeClass : deactiveClass}></div>
            <div className={index == 1 ? activeClass : deactiveClass}></div>
            <div className={index == 2 ? activeClass : deactiveClass}></div>
          </div>
          <div className="flex flex-col justify-center items-center w-[90%]">
            <CustomButton
              className="flex items-center justify-center gap-2"
              onClick={handleContinue}
            >
              <span>Continue</span>
              <IonImg src="assets/svgs/rightarrowsm.svg" alt="arrow" />
            </CustomButton>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default OnboardingMain;
