import { querySwaps } from "@/graphql/query"
import { SwapsResponse } from "@/types/graphql/swaps"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request"

interface Swaps {
  swaps: SwapsResponse[]
}

export const useSwapsHistory = ({ address }: { address: HexAddress }) => {
  const { data, isLoading, refetch } = useQuery<Swaps>({
    queryKey: ["swaps", address],
    queryFn: async () => {
      return await request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL || "", querySwaps((address.toString()).toLowerCase()));
    },
    refetchInterval: 30000,
  })

  const swaps = data?.swaps || []

  return {
    dSwaps: swaps,
    sLoading: isLoading,
    sRefetch: refetch,
  }
}