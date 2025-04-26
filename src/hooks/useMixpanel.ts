import mixpanel from "mixpanel-browser";

const useMixpanel = () => {

  const initMixpanel = () => {
    mixpanel.init("82958f70fe5cf1fd1731039aac79c4cc", { track_pageview: false, persistence: "localStorage" });
  }

  const openPurchase = (isFromUser: boolean) => {
    console.log("Purchase Opened for Mixpanel");
    mixpanel.track("OpenPurchase", { from: isFromUser ? 'User' : 'App' });
  }

  const cancelPurchase = () => {
    console.log("Purchase Cancelled for Mixpanel");
    mixpanel.track("CancelPurchase");
  }

  const completePurchase = () => {
    console.log("Purchase Completed for Mixpanel");
    mixpanel.track("CompletePurchase");
  }

  return {
    initMixpanel,
    openPurchase,
    cancelPurchase,
    completePurchase
  }

}

export default useMixpanel;