"use client";

import { useEffect, type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider, useMiniKit } from "@coinbase/onchainkit/minikit";
import { SocketProvider } from "./socket-provider";
import { GameResultsProvider } from "@/lib/GameResultsContext";
import { GameProvider } from "@/lib/GameContext";
import { WalletProvider } from "./wallet-provider";

const Child = ({ children }: { children: ReactNode }) => {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);
  return <>{children}</>;
};

export function Providers(props: { children: ReactNode }) {
  return (
    <WalletProvider>
      <MiniKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          appearance: {
            mode: "auto",
            theme: "mini-app-theme",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
            logo: process.env.NEXT_PUBLIC_ICON_URL,
          },
        }}
      >
        <GameResultsProvider>
          <GameProvider>
            <SocketProvider>
              <Child>{props.children}</Child>
            </SocketProvider>
          </GameProvider>
        </GameResultsProvider>
      </MiniKitProvider>
    </WalletProvider>
  );
}
