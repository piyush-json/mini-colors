import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";
import { encodeFunctionData } from "viem";
import {} from "viem/zksync";

export const CONTRACT_ADDRESS = "0xe0303cc1d8Fb289b266e4D0273bF9ab78e236806"; // your contract
export const CONTRACT_CHAIN_ID = 8453; // base, update if needed

export const COLOR_GAME_NFT_ABI = [
  {
    inputs: [{ internalType: "string", name: "tokenURI", type: "string" }],
    name: "safeMint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export function useMintNFT({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const { address, chainId } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const { switchChain } = useSwitchChain();

  const mint = async (tokenURI: string, value: bigint) => {
    if (chainId !== CONTRACT_CHAIN_ID) {
      await switchChain({ chainId: CONTRACT_CHAIN_ID });
    }
    const data = encodeFunctionData({
      abi: COLOR_GAME_NFT_ABI,
      functionName: "safeMint",
      args: [tokenURI],
    });
    return sendTransaction(
      {
        to: CONTRACT_ADDRESS,
        data,
        value,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => {
          onError?.();
        },
      },
    );
  };

  return { mint, isPending, address };
}

export function getMintCost(): bigint {
  // Return mint cost in wei (0.0001 ETH)
  return BigInt("100000000000000"); // 0.0001 ETH
}
