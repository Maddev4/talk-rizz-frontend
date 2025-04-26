import React, { useEffect, useRef, useState } from "react";
import { IonModal, IonIcon } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import TouchableOpacity from "./TouchableOpacity";
import CustomButton from "./CustomButton";

interface YoutubeModalProps {
  isOpen: boolean;
  setIsOpen: any;
  handleSubmit: (link: string) => void;
}

const YoutubeModal: React.FC<YoutubeModalProps> = React.memo(
  ({ isOpen, setIsOpen, handleSubmit }) => {
    const router = useIonRouter();
    const [link, setLink] = useState<string>("");
    const [valid, setValid] = useState<boolean>(true);
    const inputRef = useRef<HTMLInputElement>(null);

    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|.+\/|(?:.*[?&]v=))|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    useEffect(() => {
      if (isOpen) {
        inputRef.current?.focus();
      }
    }, [isOpen])

    const extractYoutubeId = (url: string) => {
      const match = url.match(youtubeRegex);
      console.log("[Matched ID]", match);
      return match ? match[1] : null;
    }

    const handleContinue = () => {
      if (valid){
        const videoId = extractYoutubeId(link);
        if (videoId)
          handleSubmit(videoId);
      }
    };

    const handleChange = (event: any) => {
      const value = event.target.value;
      setValid(youtubeRegex.test(value));
      setLink(value);
    };

    return (
      <IonModal
        id="upload-pdf-modal"
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
      >
        <div className="bg-[#333] w-full p-4">
          <h2 className="text-white font-bold flex gap-2 items-center">
            Input Youtube Link{" "}
            <img src="assets/svgs/youtube.svg" className="mt-[6px]" />
          </h2>
          <div className="mt-4">
            <input
              type="text"
              className={`m-auto w-full py-2 px-1 text-[var(--ion-text-primary)] focus-visible:outline-none border border-solid placeholder:text-white/70 text-black ${
                valid ? "border-transparent" : "border-red-600"
              }`}
              onChange={handleChange}
              placeholder="Input youtube link"
              ref={inputRef}
            />
          </div>
          <div className="flex justify-end mt-5">
            <TouchableOpacity onPress={handleContinue}>
              <p className="text-[var(--ion-color-primary)]">Continue</p>
            </TouchableOpacity>
          </div>
        </div>
      </IonModal>
    );
  }
);

export default YoutubeModal;
