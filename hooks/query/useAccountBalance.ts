import { normalize } from '@/lib/bignumber'
import { useAccount, useBalance } from 'wagmi'

export const useAccountBalance = ({ token = "0x1", decimal = 6 }: { token: HexAddress, decimal: number }) => {
  const { address } = useAccount()

  const { data: result, isLoading: bLoading, error: bError, refetch: bRefetch } = useBalance({
    address: address,
    token: token as HexAddress,
  })

  const bNormal = result?.value
  const bNormalized = result?.value ? Number(normalize(result.value.toString(), decimal)) : undefined

  return {
    bNormal,
    bNormalized,
    bLoading,
    bError,
    bRefetch
  }
}