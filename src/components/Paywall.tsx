import {
  IonModal,
  IonToggle,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import TouchableOpacity from "./TouchableOpacity";
import CustomButton from "./CustomButton";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Purchases,
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
} from "@revenuecat/purchases-capacitor";
import useUserStore from "../stores/user.store";
import { getUserInfoById, updateSubscriptionInfo } from "../apis/User";
import useLoadingStore from "../stores/loading.store";
import useMixpanel from "../hooks/useMixpanel";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Paywall: React.FC<Props> = ({
  isOpen,
  setIsOpen,
}: Props): React.ReactElement => {
  const [isFreeTrial, setIsFreeTrial] = useState<boolean>(true);
  const [packages, setPackages] = useState<any>(null);
  const { user, setIsSubscribedUser, setFeedbackModalInfo } = useUserStore();
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const { cancelPurchase, completePurchase } = useMixpanel();
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    configurePurchases();
    if (!isOpen) setLoading(false);
  }, []);

  useIonViewWillEnter(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const data = await getUserInfoById(user.id);
    if ("subscriptionInfo" in data.user) {
      const status = JSON.parse(data.user.subscriptionInfo);
      const currentDate = new Date();
      const expireDate = new Date(status.expiration_at_ms);
      if (currentDate > expireDate) {
        setIsSubscribedUser(false);
      } else {
        setIsSubscribedUser(true);
      }
    } else {
      setIsSubscribedUser(false);
    }
  };

  const configurePurchases = async () => {
    try {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG }); // Enable to get debug logs
      await Purchases.configure({
        apiKey: "appl_OoXyZDnSygvlaSfkWLrPrqraVYY",
        appUserID: user.id,
      });
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        setPackages(offerings);
      }
    } catch (err) {
      console.log("[Error Configure Product]", err);
    }
  };

  const handleCheckPurchase = async () => {
    try {
      if (isPurchasing) return;
      setIsPurchasing(true);
      const aPackage = isFreeTrial
        ? packages.current.weekly
        : packages.current.annual;
      await Purchases.purchasePackage({ aPackage });
      await checkSubscription();
      completePurchase();
      setIsOpen(false);
      setLoading(false);
      setIsPurchasing(false);
      setFeedbackModalInfo({ visible: true, type: 2 });
    } catch (error: any) {
      setIsPurchasing(false);
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        cancelPurchase();
        setFeedbackModalInfo({ visible: true, type: 1 });
        console.log("[Purchase Canceled]", error);
      } else {
        console.log("[Purchase Error]", error);
      }
    }
  };

  return (
    <>
      <IonModal
        id="paywall-modal"
        isOpen={isOpen}
      >
        <div className="bg-[#333] w-full h-full paywall-modal-content bg-cover bg-center relative px-4 justify-between pt-20 pb-12 overflow-auto">
          <TouchableOpacity
            className="absolute"
            onPress={() => {
              cancelPurchase();
              setIsOpen(false);
              setLoading(false);
              setFeedbackModalInfo({ visible: true, type: 1 });
            }}
          >
            {!isPurchasing && <img src="assets/svgs/close.svg" />}
          </TouchableOpacity>
          <div className="flex flex-col items-center">
            <img src="assets/svgs/premiumbot.svg" className="w-28" />
            <p className="uppercase text-white font-bold text-2xl text-center mb-2">
              get unlimited access
            </p>
          </div>
          <div className="m-auto w-max my-6">
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">Unlimited Access to All Features</p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">Full Access to the Latest ChatGPT AI</p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">
                Instant Answers to All of Your Questions
              </p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">Personalized Responses for YOU</p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">Over 500+ Helpful Prompts</p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">Real-Time Data Web Search with AI</p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">
                Assistance with Posts, Emails, and More
              </p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">Assistance with Work and Learning</p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">AI-Powered Camera Scanner</p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">Unlimited AI Image Generation</p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">
                Voice-to-Text Feature Instead of Typing
              </p>
            </div>
            <div className="flex gap-1 items-center">
              <img src="assets/svgs/label_check.svg" />
              <p className="text-white">No Interruption with Ads</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-12">
            <CustomButton
              className="w-full rounded-full px-4 py-2 bg-none !bg-white/20 backdrop-blur-xl flex justify-between items-center h-14"
              onClick={() => setIsFreeTrial(!isFreeTrial)}
            >
              <p className="text-sm text-white">Enable 3 days free trail</p>
              <IonToggle checked={isFreeTrial} />
            </CustomButton>
            <CustomButton
              className="w-full h-14 rounded-full px-4 py-2 bg-none bg-white/20 backdrop-blur-xl flex justify-between items-center text-left"
              onClick={() => setIsFreeTrial(false)}
            >
              <div className="flex gap-1 items-center flex-1">
                <img
                  src={`assets/svgs/${
                    isFreeTrial ? "de" : ""
                  }active_toggle.svg`}
                  alt="active_toggle"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="uppercase text-white text-sm">
                      yearly access
                    </p>
                    <p className="rounded-full bg-[#333] text-[#1EEE9A] text-xs px-2 py-1">
                      Best Deal
                    </p>
                  </div>
                  <p className="text-white text-sm">
                    Just $
                    {packages &&
                      packages?.current.availablePackages[1].product
                        .pricePerYear}{" "}
                    per year
                  </p>
                </div>
              </div>
              <p className="text-white">
                $
                {packages &&
                  packages.current?.availablePackages[1].product.pricePerWeek}
                /week
              </p>
            </CustomButton>
            <CustomButton
              className="w-full h-14 rounded-full px-4 py-2 bg-none bg-white/20 backdrop-blur-xl flex justify-between items-center text-left"
              onClick={() => setIsFreeTrial(true)}
            >
              <div className="flex gap-1 items-center flex-1">
                <img
                  src={`assets/svgs/${
                    !isFreeTrial ? "de" : ""
                  }active_toggle.svg`}
                  alt="active_toggle"
                />
                <div>
                  <p className="uppercase text-white text-sm">
                    {isFreeTrial ? "3 days free trial" : "weekly access"}
                  </p>
                </div>
              </div>
              <p className="text-white">
                {isFreeTrial ? "Then " : ""}$
                {packages &&
                  packages?.current.availablePackages[0].product
                    .pricePerWeek}{" "}
                / week
              </p>
            </CustomButton>
            <TouchableOpacity
              onPress={handleCheckPurchase}
              disabled={isPurchasing}
            >
              <CustomButton className="h-14 flex justify-center gap-4 items-center">
                {isPurchasing ? (
                  <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <>
                    <p className="text-white">
                      {isFreeTrial ? "Start for Free" : "Get Access"}
                    </p>
                    <img src="assets/svgs/rightarrowsm.svg" />
                  </>
                )}
              </CustomButton>
            </TouchableOpacity>
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex gap-1">
                <img src="assets/svgs/label_clock.svg" alt="" />
                <p className="text-white text-xs">
                  Subscription will Auto Renew, cancel anytime
                </p>
              </div>
              <div>
                <a href="#" className="text-white text-sm underline">
                  Terms of use
                </a>
                <span className="px-1 text-gray-400 text-xs">and</span>
                <a href="#" className="text-white text-sm underline">
                  Privacy policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default Paywall;
