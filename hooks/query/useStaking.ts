import { StakingList } from "@/types/staking"
import { useQuery } from "@tanstack/react-query"

export const useStaking = () => {
  const { data: sData, isLoading: sLoading, refetch: sRefetch } = useQuery<StakingList>({
    queryKey: ["staking"],
    queryFn: async () => {
      const response = await fetch(`/api/staking`)
      if (!response.ok) {
        throw new Error("Failed to fetch staking data")
      }
      return response.json()
    }
  })

  return { sData, sLoading, sRefetch }
}