import { ScaleLoader } from "react-spinners";
import useLoadingStore from "../stores/loading.store";

const Spinner: React.FC = () => {
  const { loadingText } = useLoadingStore();

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black/10 backdrop-lg z-[10000] flex items-center justify-center">
      <div className="w-36 h-36 flex flex-col gap-6 items-center justify-center rounded-lg bg-black/70">
        <ScaleLoader color="var(--ion-color-primary)" />
        <p className="text-base text-white">{loadingText}</p>
      </div>
    </div>
  );
};

export default Spinner;