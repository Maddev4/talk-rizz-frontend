import React, { useRef, useState } from "react";
import { IonModal, IonIcon } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import TouchableOpacity from "./TouchableOpacity";
import CustomButton from "./CustomButton";

interface PdfUploadModalProps {
  isOpen: boolean;
  setIsOpen: any;
  handleSubmit: (file: File) => void;
}

const PdfUploadModal: React.FC<PdfUploadModalProps> = React.memo(
  ({ isOpen, setIsOpen, handleSubmit }) => {
    const router = useIonRouter();
    const [fileName, setFileName] = useState<string>("");

    const uploadRef: any = useRef(null);

    const handleSelectFile = () => {
      uploadRef.current?.click();
    };

    const handleChangeFile = () => {
      const file = uploadRef.current.files[0];
      setFileName(file ? file.name : "");
    };

    const handleContinue = () => {
      if (fileName) handleSubmit(uploadRef.current.files[0]);
    };

    return (
      <IonModal
        id="upload-pdf-modal"
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
      >
        <div className="bg-[#333] w-full p-4">
          <h2 className="text-white font-bold">Upload Doc 📃</h2>
          <div className="mt-4">
            <span className="text-white">{fileName}</span>
            <input
              type="file"
              className="hidden"
              onChange={handleChangeFile}
              ref={uploadRef}
              accept=".pdf,.csv,.docx,.txt"
            />
          </div>
          <div className="flex justify-between mt-5">
            <TouchableOpacity onPress={handleSelectFile}>
              <p className="text-[var(--ion-text-primary)]">Select</p>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleContinue}>
              <p className="text-[var(--ion-color-primary)]">Continue</p>
            </TouchableOpacity>
          </div>
        </div>
      </IonModal>
    );
  }
);

export default PdfUploadModal;
