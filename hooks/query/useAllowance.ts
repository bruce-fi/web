import { erc20Abi } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

export const useAllowance = ({ token, addressSpender }: { token: HexAddress, addressSpender: HexAddress }) => {
  const { address: addressOwner } = useAccount()

  const { data } = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'allowance',
    args: [
      addressOwner as HexAddress,
      addressSpender as HexAddress
    ]
  })

  const aData = data && Number(data)

  return {
    aData
  }
}