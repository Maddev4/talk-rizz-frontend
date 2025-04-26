import { IonIcon, IonImg, IonModal } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import React, { memo, useState } from 'react';
import TouchableOpacity from './TouchableOpacity';
import Paywall from './Paywall';
import useUserStore from '../stores/user.store';
import useMixpanel from '../hooks/useMixpanel';

const PremiumContainer: React.FC = memo(() => {

  const {visiblePaywall, setVisiblePaywall, isSubscribedUser } = useUserStore();
  const { openPurchase } = useMixpanel();

  const handleClickPremiumBox = () => {
    openPurchase(true);
    setVisiblePaywall(true);
  }

  return (
    <>
      {
        !isSubscribedUser && <TouchableOpacity onPress={handleClickPremiumBox}>
        <div className="bg-gradient-to-b from-[#00DC83] to-[#079F61] rounded-2xl p-4 pb-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <IonImg
              src="/assets/images/premiumrobot.png"
              alt="Premium Robot"
              className="w-16"
            />
            <div>
              <p className="text-[var(--ion-text-primary)] font-bold">
                Try Premium for Free
              </p>
              <p className="text-[13px] text-[var(--ion-text-primary)] mt-1">
                Click here to claim your offer
              </p>
            </div>
          </div>
          <IonIcon
            icon={chevronForwardOutline}
            className="text-[var(--ion-text-primary)] text-2xl"
          />
        </div>
        </TouchableOpacity>
      }
      <Paywall isOpen={visiblePaywall} setIsOpen={setVisiblePaywall}/>
    </>
  );
});

export default PremiumContainer;
