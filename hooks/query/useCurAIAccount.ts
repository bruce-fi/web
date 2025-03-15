import { getAvatar, getName } from "@coinbase/onchainkit/identity";
import { useEffect, useState, useCallback } from "react";
import { base } from "wagmi/chains";
import { useAddressAI } from "./useAddressAI";

export const useCurAIAccount = () => {
  const { addressAI } = useAddressAI();
  const [accountData, setAccountData] = useState<{
    curAvatar: string;
    curName: string;
    isLoading: boolean;
    error: string | null;
  }>({
    curAvatar: "",
    curName: "",
    isLoading: false,
    error: null
  });

  const fetchAccountData = useCallback(async () => {
    if (!addressAI) {
      setAccountData({
        curAvatar: "",
        curName: "",
        isLoading: false,
        error: null
      });
      return;
    }

    setAccountData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [name, avatar] = await Promise.all([
        getName({ address: addressAI, chain: base }),
        getAvatar({ 
          ensName: await getName({ address: addressAI, chain: base }), 
          chain: base 
        })
      ]);

      setAccountData({
        curAvatar: avatar,
        curName: name,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching account data:", error);
      setAccountData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch account data"
      }));
    }
  }, [addressAI]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  return {
    curAddressAI: addressAI,
    curAvatarAI: accountData.curAvatar,
    curNameAI: accountData.curName,
    isLoadingAI: accountData.isLoading,
    errorAI: accountData.error,
    refetchAI: fetchAccountData
  };
};