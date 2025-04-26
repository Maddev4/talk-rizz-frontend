import React from 'react';
import { IonModal } from '@ionic/react';
import CustomButton from './CustomButton';

interface RecordingModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  stopRecording: () => void;
}

const RecordingModal: React.FC<RecordingModalProps> = ({ isOpen, setIsOpen, stopRecording }) => {
  return <IonModal
    id="recording-modal"
    isOpen={isOpen}
    onDidDismiss={() => setIsOpen(false)}
  >
    <div className="bg-[#333] w-full p-4 flex justify-center">
      <CustomButton className='w-fit !bg-none' onClick={stopRecording}>
        <div className="rounded-full w-16 h-16 flex items-center justify-center border">
          <div className="w-8 h-8 bg-red-400"></div>
        </div>
      </CustomButton>
    </div>
  </IonModal>
}

export default RecordingModal