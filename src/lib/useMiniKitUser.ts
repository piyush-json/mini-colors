"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";

export function useMiniKitUser() {
  const { context, isFrameReady } = useMiniKit();
  const { address } = useAccount();

  const getUserId = () => {
    return context?.user?.fid?.toString() || "anonymous";
  };

  const getUserName = () => {
    return context?.user?.username || context?.user?.displayName || "Anonymous";
  };
  const getUserAddress = () => {
    return address || "0x0000000000000000000000000000000000000000";
  };
  const getUserAvatar = () => {
    return context?.user?.pfpUrl || "";
  };

  const getSafeAreaHeight = () => {
    const safeAreaInsets = context?.client.safeAreaInsets;
    if (safeAreaInsets) {
      const availableHeight =
        window.innerHeight -
        (safeAreaInsets.top || 0) -
        (safeAreaInsets.bottom || 0);
      return availableHeight > 0 ? `${availableHeight}px` : "100vh";
    }
    return "100vh";
  };

  const isLoading = isFrameReady;

  return {
    user: context?.user || null,
    isLoading,
    getUserId,
    getUserName,
    getUserAddress,
    getUserAvatar,
    getSafeAreaHeight,
  };
}
