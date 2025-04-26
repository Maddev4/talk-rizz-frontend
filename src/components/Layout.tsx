import {
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonPage,
  IonActionSheet,
  useIonRouter,
} from "@ionic/react";
import { useLocation, useHistory } from "react-router-dom";
import {
  settingsOutline,
  chevronBackOutline,
  micOutline,
  scanOutline,
  chevronForwardOutline,
  sendOutline,
} from "ionicons/icons";
import { ReactNode, useState, useRef, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import TouchableOpacity from "./TouchableOpacity";
import CustomButton from "./CustomButton";
import CustomLayoutModal from "./CustomLayoutModal";
import useChatStore from "../stores/chat.store";
import useUserStore from "../stores/user.store";
import useLoadingStore from "../stores/loading.store";
import useOnboardingStore from "../stores/onboarding.store";
import { createChat, generatePreSignedurls } from "../apis/Chat";
import {
  BUCKET_NAME,
  CHAT_TYPE,
  limitMessageCount,
  MESSAGE_TYPE,
  REGION_NAME,
  reviewMessageCount,
} from "../utils/constants";
import { generateUniqueId } from "../utils/generateUniqueId";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { getMessageCount, sendChatsToSlack } from "../apis/User";
import { SpeechRecognition } from "@ionic-native/speech-recognition";
import useHapticFeedback from "../hooks/useHapticFeedback";
import { InAppReview } from "@capacitor-community/in-app-review";
import FeedbackModal from "./FeedbackModal";
import useMixpanel from "../hooks/useMixpanel";

interface Props {
  children?: ReactNode;
  title?: string;
  showSetting?: boolean;
  showBack?: boolean;
  chatAction?: boolean;
}

const Layout = ({
  children,
  title,
  showSetting = true,
  showBack = false,
  chatAction = false,
}: Props) => {
  const history = useHistory();
  const inputRef: any = useRef();
  const scanPopover: any = useRef();
  const fileRef: any = useRef();
  const router = useIonRouter();
  const location = useLocation();

  const {
    activeChatId,
    setActiveChatId,
    setActiveChatTitle,
    messageList,
    setMessageList,
    setActiveChatType,
    activeChatType,
  } = useChatStore();
  const {
    user,
    setVisiblePaywall,
    isSubscribedUser,
    feedbackModalInfo,
    setFeedbackModalInfo,
  } = useUserStore();
  const { isAboutMeCompleted, setIsAboutMeCompleted } = useOnboardingStore();
  const { setLoading } = useLoadingStore();
  const { loadPhoto, takePhoto, photos, setPhotos } = usePhotoGallery();
  const { openPurchase } = useMixpanel();

  const [inputText, setInputText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [scanFile, setScanFile] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false);

  const { hapticsImpactLight } = useHapticFeedback();

  const goSettings = () => {
    history.push("/settings");
  };

  const goBack = async () => {
    if (isAboutMeCompleted) router.goBack();
    else {
      sendFirstInteractionToSlack();
      router.push("/home", "back", "push");
      setIsAboutMeCompleted();
    }
  };

  const showFooter =
    location.pathname === "/home" || location.pathname === "/chat";

  const scanButton =
    location.pathname == "/home" ||
    (location.pathname == "/chat" && activeChatType == CHAT_TYPE.Text);

  const longInput = location.pathname == "/chat";

  useEffect(() => {
    setTimeout(() => {
      if (location.pathname == "/chat" && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 500);
      }
    }, 300);
  }, [location.pathname]);

  const handleInputChange = (event: any) => {
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    if (inputRef.current.scrollHeight > 100) {
      inputRef.current.style.height = "100px";
    }
    setInputText(event.target.value);
  };

  const handleSendMessage = async () => {
    setLoading(true);
    const response = await getMessageCount(user.id);
    if (response.count > reviewMessageCount) InAppReview.requestReview();
    if (response.count > limitMessageCount && !isSubscribedUser) {
      openPurchase(false);
      setVisiblePaywall(true);
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setInputText("");
      return;
    }
    if (!activeChatId) {
      const messageId = generateUniqueId(inputText);
      const response = await createChat(
        user.id,
        CHAT_TYPE.Text,
        inputText,
        messageId
      );
      let metaData = "";
      if (scanFile !== "") metaData = JSON.stringify({ images: [scanFile] });
      setActiveChatId(response.chat._id);
      setActiveChatTitle(response.chat.title);
      setActiveChatType(CHAT_TYPE.Text);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setInputText("");
      router.push("/chat", "forward", "push");
      setLoading(false);
      setMessageList([
        {
          messageId,
          data: inputText,
          userId: user.id,
          sender: MESSAGE_TYPE.Human,
          type: CHAT_TYPE.Text,
          metaData,
        },
      ]);
    } else {
      const messageId = generateUniqueId(inputText);
      let metaData = "";
      if (scanFile !== "") metaData = JSON.stringify({ images: [scanFile] });
      setMessageList([
        ...messageList,
        {
          messageId,
          data: inputText,
          userId: user.id,
          sender: MESSAGE_TYPE.Human,
          type:
            activeChatType == CHAT_TYPE.Image
              ? CHAT_TYPE.Text
              : messageList[messageList.length - 1].type,
          metaData,
        },
      ]);
      setInputText("");
      setScanFile("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const sendFirstInteractionToSlack = async () => {
    await sendChatsToSlack(messageList);
  };

  const uploadFile = () => {
    if (fileRef) fileRef.current?.click();
  };

  const handleChangeFile = async (blobData: any) => {
    setLoading(true, "Uploading...");
    const data = await generatePreSignedurls(1);
    const preSignedURL = data.urls[0];
    const response = await fetch(blobData);
    const blob = await response.blob();
    await fetch(preSignedURL.uploadURL, {
      method: "PUT",
      headers: {
        "Content-Type": blob.type,
      },
      body: blob,
    });
    setScanFile(
      `https://${BUCKET_NAME}.s3.${REGION_NAME}.amazonaws.com/${preSignedURL.key}`
    );
    setLoading(false);
  };

  const removeImage = () => {
    setPhotos([]);
    setScanFile("");
  };

  const turnOnTranscribing = async () => {
    console.log("[Turn On Transcribing]");
    const hasPermission = await SpeechRecognition.hasPermission();
    console.log(hasPermission);
    if (!hasPermission) {
      setIsRecording(false);
      setLoading(false);
      await SpeechRecognition.requestPermission();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    console.log("[Start Recording]");
    setIsRecording(true);
    SpeechRecognition.startListening({
      language: "en-EN",
      matches: 1,
    }).subscribe(
      (_matches: any) => {
        if (_matches && _matches.length > 0) {
          inputRef.current.value = _matches[0];
          inputRef.current.focus();
          inputRef.current.setSelectionRange(
            inputRef.current.value.length,
            inputRef.current.value.length
          );
          setInputText(_matches[0]);
          setLoading(false);
        }
      },
      (_e) => {
        // if something went wrong, show an error message
        alert("I couldn't understand what you said. Perhaps you're drunk?");
        setLoading(false);
      }
    );
  };

  const stopRecording = async () => {
    const hasPermission = await SpeechRecognition.hasPermission();
    console.log("[Has permission]", hasPermission);
    if (hasPermission) {
      setIsRecording(false);
      SpeechRecognition.stopListening();
      setLoading(true, "Processing");
    }
  };

  useEffect(() => {
    if (photos.length > 0) {
      handleChangeFile(photos[0].webviewPath);
    }
  }, [photos]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    setInterval(trackUserActivity, 86400);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const trackUserActivity = async () => {};

  const handleKeyPress = () => {
    hapticsImpactLight();
  };

  return (
    <IonPage>
      <IonHeader className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md h-[102px] absolute w-full shadow-lg shadow-black/25">
        <div className="w-full h-full pb-3 flex flex-col justify-end">
          <div className="w-[90%] mx-auto relative flex items-center justify-between">
            {showSetting && (
              <TouchableOpacity className="h-6">
                <IonIcon
                  icon={settingsOutline}
                  className="text-2xl text-white"
                  onClick={goSettings}
                />
              </TouchableOpacity>
            )}
            {showBack && (
              <TouchableOpacity className="h-6">
                <IonIcon
                  icon={chevronBackOutline}
                  className="text-2xl text-white"
                  onClick={goBack}
                />
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity className="h-6">
              <IonIcon
                icon={trashOutline}
                className="text-2xl text-white"
                onClick={handleDelete}
              />
            </TouchableOpacity> */}
            <div className="absolute w-max left-1/2 -translate-x-1/2">
              {chatAction ? (
                <TouchableOpacity
                  className="flex items-center"
                  onPress={() => setModalVisible(true)}
                >
                  <h1 className="font-bold text-[var(--ion-text-primary)] text-[17px] leading-tight max-w-48 truncate">
                    {title}
                  </h1>
                  <IonIcon
                    icon={chevronForwardOutline}
                    className="text-xl text-white h-6 opacity-70"
                  />
                </TouchableOpacity>
              ) : (
                <h1 className="font-bold text-[var(--ion-text-primary)] text-[17px]">
                  {title}
                </h1>
              )}
            </div>
          </div>
        </div>
      </IonHeader>
      <IonContent fullscreen className="overflow-hidden">
        {isRecording && (
          <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 flex flex-col gap-6 items-center justify-center rounded-lg bg-black/70">
            <ScaleLoader color="var(--ion-color-primary)" />
            <p className="text-base text-white">Recording...</p>
          </div>
        )}
        <div className="w-full h-full pt-[98px] relative">
          <div className="h-full overflow-scroll pb-2 background bg-cover">
            {children}
          </div>
        </div>
      </IonContent>
      {showFooter && (
        <IonFooter>
          <div
            className={`bg-[#404543] w-full ${longInput ? "pb-3" : ""} ${
              scanFile ? "rounded-tr-[15px] rounded-tl-[15px]" : ""
            }`}
          >
            <div className="w-[90%] m-auto gap-3 flex justify-center items-center py-[2px]">
              <div
                className={`flex-1 bg-[#0E0E0E] justify-center relative flex flex-col ${
                  scanFile ? "justify-between p-3 pb-0" : ""
                }`}
                style={{ transition: "height 0.3s" }}
              >
                {scanFile ? (
                  <div className="relative w-max pb-3">
                    <TouchableOpacity
                      className="absolute translate-x-1/2 -translate-y-1/2 right-[15px] top-[15px] rounded-full bg-black/30 w-6 h-6 flex items-center justify-center"
                      onPress={removeImage}
                    >
                      <span className="leading-none text-white">&times;</span>
                    </TouchableOpacity>
                    <img src={scanFile} className="max-h-[100px] max-w-full" />
                  </div>
                ) : (
                  <></>
                )}
                <div className="w-full relative flex">
                  {scanButton && (
                    <>
                      <TouchableOpacity
                        className="absolute right-2 w-6 h-6 top-1/2 -translate-y-1/2"
                        onPress={() => setBottomSheetVisible(true)}
                      >
                        <IonIcon
                          slot="end"
                          icon={scanOutline}
                          className="text-2xl text-white"
                        />
                      </TouchableOpacity>
                    </>
                  )}
                  <textarea
                    id="chattext_input"
                    rows={1}
                    placeholder="Type text here"
                    className={`bg-transparent text-white outline-none w-full pr-8 placeholder:text-[#c7c7c7] p-[10px] pl-2 overflow-hidden resize-none max-h-[100px] min-h-[40px] ${
                      scanFile ? "border-t border-gray-300" : "border-none"
                    }`}
                    onChange={handleInputChange}
                    ref={inputRef}
                  />
                </div>
              </div>
              {inputText.length > 0 ? (
                <CustomButton
                  className="!w-14 h-10 flex items-center justify-center"
                  onClick={handleSendMessage}
                >
                  <IonIcon
                    icon={sendOutline}
                    className="text-2xl font-bold text-white"
                  />
                </CustomButton>
              ) : (
                <CustomButton
                  className="!w-14 h-10 flex items-center justify-center"
                  onLongPress={turnOnTranscribing}
                  onLongFinish={stopRecording}
                >
                  <IonIcon
                    icon={micOutline}
                    className="text-2xl font-bold text-white"
                  />
                </CustomButton>
              )}
            </div>
          </div>
        </IonFooter>
      )}
      <CustomLayoutModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        setIsOpen={setModalVisible}
      />
      <IonActionSheet
        isOpen={bottomSheetVisible}
        onDidDismiss={() => setBottomSheetVisible(false)}
        buttons={[
          {
            text: "Camera",
            handler: () => {
              takePhoto();
            },
          },
          {
            text: "Photo Gallery",
            handler: () => {
              loadPhoto();
            },
          },
        ]}
        cssClass="photo-gallery-action-sheet"
      />
      <FeedbackModal
        isOpen={feedbackModalInfo.visible}
        setIsOpen={setFeedbackModalInfo}
        feedbackType={feedbackModalInfo.type}
      />
    </IonPage>
  );
};

export default Layout;
