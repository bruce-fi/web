import { getAvatar, getName } from "@coinbase/onchainkit/identity";
import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { base } from "wagmi/chains";

export const useCurAccount = () => {
  const { address: curAddress, isDisconnected } = useAccount();
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
    if (!curAddress || isDisconnected) {
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
        getName({ address: curAddress, chain: base }),
        getAvatar({ 
          ensName: await getName({ address: curAddress, chain: base }), 
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
  }, [curAddress, isDisconnected]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  return {
    curAddress,
    curAvatar: accountData.curAvatar,
    curName: accountData.curName,
    isDisconnected,
    isLoading: accountData.isLoading,
    error: accountData.error,
    refetch: fetchAccountData
  };
};