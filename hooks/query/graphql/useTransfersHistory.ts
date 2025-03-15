import { queryTransfers } from "@/graphql/query"
import { TransfersResponse } from "@/types/graphql/transfers"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request"

interface Transfers {
  transfers: TransfersResponse[]
}

export const useTransfersHistory = ({ address }: { address: HexAddress }) => {
  const { data, isLoading, refetch } = useQuery<Transfers>({
    queryKey: ["transfers", address],
    queryFn: async () => {
      return await request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL || "", queryTransfers((address.toString()).toLowerCase()));
    },
    refetchInterval: 30000,
  })

  const transfers = data?.transfers || []

  return {
    dTransfers: transfers,
    tLoading: isLoading,
    tRefetch: refetch,
  }
}