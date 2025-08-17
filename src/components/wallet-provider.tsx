import { http, createConfig, WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [miniAppConnector()],
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};
