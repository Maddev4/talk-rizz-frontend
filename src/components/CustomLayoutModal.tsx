import React, { useState } from "react";
import { IonModal, IonIcon } from "@ionic/react";
import {
  chevronForward,
  informationCircleOutline,
  checkmarkOutline,
  chatbubbleOutline,
  shareOutline,
  pencilOutline,
  trashOutline,
} from "ionicons/icons";
import { useIonRouter } from "@ionic/react";
import TouchableOpacity from "./TouchableOpacity";
import useChatStore from "../stores/chat.store";
import useLoadingStore from "../stores/loading.store";
import { changeChatTitle, deleteChat } from "../apis/Chat";

interface CustomLayoutModalProps {
  isOpen: boolean;
  setIsOpen: any;
  onClose: () => void;
}

const CustomLayoutModal: React.FC<CustomLayoutModalProps> = React.memo(
  ({ isOpen, setIsOpen, onClose }) => {
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [activeRename, setActiveRename] = useState<boolean>(false);
    const router = useIonRouter();

    const { activeChatTitle, setActiveChatTitle, activeChatId, resetChatData } =
      useChatStore();
    const { setLoading } = useLoadingStore();
    const [chatTitle, setChatTitle] = useState<string>(activeChatTitle);

    const renderModalItem = React.useCallback(
      (
        text: string,
        icon: string,
        onClick?: () => void,
        textColor = "text-white",
        iconColor = "text-white"
      ) => (
        <TouchableOpacity
          className="flex justify-between items-center"
          onPress={onClick}
        >
          <p className={`text-[15px] ${textColor}`}>{text}</p>
          <IonIcon icon={icon} className={`text-xl ${iconColor}`} />
        </TouchableOpacity>
      ),
      []
    );

    const handleCustomInstruction = () => {
      setShowDetail(false);
      setIsOpen(false);
      router.push("/custominstruction", "forward", "push");
    };

    const handleDelete = async () => {
      setLoading(true, "Deleting...");
      await deleteChat(activeChatId);
      setLoading(false);
      setIsOpen(false);
      resetChatData();
      router.goBack();
    };

    const handleRename = async () => {
      await changeChatTitle(activeChatId, chatTitle);
      setActiveChatTitle(chatTitle);
      setActiveRename(false);
      setIsOpen(false);
    };

    return (
      <IonModal id="setting-chat-modal" isOpen={isOpen} onDidDismiss={onClose}>
        <div className="bg-[#333]">
          <div className="px-5 py-3 border-b border-white/20">
            {renderModalItem(
              "Custom Instruction",
              informationCircleOutline,
              handleCustomInstruction
            )}
          </div>
          <div className="p-4 py-3 border-b border-white/20">
            <TouchableOpacity
              className="flex items-center gap-2"
              onPress={() => setShowDetail(!showDetail)}
            >
              <div className="flex items-center">
                <IonIcon
                  icon={chevronForward}
                  className={`text-xl text-[#C7C7C7] transition-transform duration-300 ${
                    showDetail ? "rotate-90" : ""
                  }`}
                />
                <p className="text-[15px] text-[#C7C7C7]">Manage Chat</p>
              </div>
              <IonIcon
                icon={chatbubbleOutline}
                className="text-xl text-[#C7C7C7] ml-auto"
              />
            </TouchableOpacity>
          </div>
          <div
            className={`w-full overflow-hidden transition-all duration-300 ${
              showDetail ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-5 py-3 border-b border-white/20">
              {renderModalItem("Share", shareOutline)}
            </div>
            <div className="px-5 py-3 border-b border-white/20">
              {!activeRename ? (
                <TouchableOpacity
                  className="flex justify-between items-center"
                  onPress={() => setActiveRename(!activeRename)}
                >
                  <p className={`text-[15px] text-white`}>Rename</p>
                  <IonIcon
                    icon={pencilOutline}
                    className={`text-xl text-white`}
                  />
                </TouchableOpacity>
              ) : (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="flex-1 text-white focus-visible:outline-none bg-transparent"
                    value={chatTitle}
                    onChange={(e) => setChatTitle(e.target.value)}
                  />
                  <TouchableOpacity onPress={handleRename}>
                    <IonIcon
                      icon={checkmarkOutline}
                      className={`text-xl text-white flex items-center`}
                    />
                  </TouchableOpacity>
                </div>
              )}
            </div>
            <div className="px-5 py-3">
              {renderModalItem(
                "Delete",
                trashOutline,
                handleDelete,
                "text-[#FF0000]",
                "text-[#FF0000]"
              )}
            </div>
          </div>
        </div>
      </IonModal>
    );
  }
);

export default CustomLayoutModal;
