import { Haptics, ImpactStyle } from "@capacitor/haptics";
import useUserStore from "../stores/user.store";

const useHapticFeedback = () => {
  const { hapticFeedback } = useUserStore();

  const hapticsImpactMedium = async () => {
    if (hapticFeedback) await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const hapticsImpactLight = async () => {
    if (hapticFeedback) await Haptics.impact({ style: ImpactStyle.Light })
  }

  const hapticsImpactHeavy = async () => {
    if (hapticFeedback) await Haptics.impact({ style: ImpactStyle.Heavy })
  }

  const hapticsVibrate = async () => {
    if (hapticFeedback) await Haptics.vibrate();
  }

  return {
    hapticsImpactMedium,
    hapticsImpactHeavy,
    hapticsImpactLight,
    hapticsVibrate
  };
};

export default useHapticFeedback;
