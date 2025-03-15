import { queryWithdraws } from "@/graphql/query"
import { WithdrawsResponse } from "@/types/graphql/withdraws"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request"

interface Withdraws {
  withdrawAlls: WithdrawsResponse[]
}

export const useWithdrawsHistory = ({ address }: { address: HexAddress }) => {
  const { data, isLoading, refetch } = useQuery<Withdraws>({
    queryKey: ["withdrawAlls", address],
    queryFn: async () => {
      return await request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL || "", queryWithdraws((address.toString()).toLowerCase()));
    },
    refetchInterval: 30000,
  })

  const withdraws = data?.withdrawAlls || []

  return {
    dWithdraws: withdraws,
    sLoading: isLoading,
    sRefetch: refetch,
  }
}