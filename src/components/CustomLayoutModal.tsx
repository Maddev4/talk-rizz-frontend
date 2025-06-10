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
import useChatStore from "../stores/chat.store";
import useLoadingStore from "../stores/loading.store";

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


    const handleCustomInstruction = () => {
      setShowDetail(false);
      setIsOpen(false);
      router.push("/custominstruction", "forward", "push");
    };


    return (
      <IonModal id="setting-chat-modal" isOpen={isOpen} onDidDismiss={onClose}>
        <div className="bg-[#333]">
          <div
            className={`w-full overflow-hidden transition-all duration-300 ${
              showDetail ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-5 py-3 border-b border-white/20">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  className="flex-1 text-white focus-visible:outline-none bg-transparent"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </IonModal>
    );
  }
);

export default CustomLayoutModal;
