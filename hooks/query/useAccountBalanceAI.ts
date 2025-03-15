import { normalize } from '@/lib/bignumber'
import { useBalance } from 'wagmi'
import { useAddressAI } from './useAddressAI'

export const useAccountBalanceAI = ({ token, decimal = 6 }: { token: HexAddress, decimal: number }) => {
  const { addressAI } = useAddressAI()

  const { data: result, isLoading: bLoading, error: bError, refetch: bRefetch } = useBalance({
    address: addressAI,
    token: token as HexAddress,
  })

  const bNormal = result?.value
  const bNormalized = result?.value ? Number(normalize(result.value.toString(), decimal)) : 0

  return {
    bNormal,
    bNormalized,
    bLoading,
    bError,
    bRefetch
  }
}