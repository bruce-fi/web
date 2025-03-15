import { queryStakeds } from "@/graphql/query"
import { StakedsResponse } from "@/types/graphql/stakeds"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request"

interface Stakeds {
  stakeds: StakedsResponse[]
}

export const useStakedsHistory = ({ address }: { address: HexAddress }) => {
  const { data, isLoading, refetch } = useQuery<Stakeds>({
    queryKey: ["stakeds", address],
    queryFn: async () => {
      return await request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL || "", queryStakeds((address.toString()).toLowerCase()));
    },
    refetchInterval: 30000,
  })

  const stakeds = data?.stakeds || []

  return {
    dStakeds: stakeds,
    sLoading: isLoading,
    sRefetch: refetch,
  }
}