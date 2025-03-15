import { gql } from "graphql-request";

export const querySwaps = (address: string) => {
  return gql`{
    swaps(orderBy: blockTimestamp, orderDirection: desc, where: {user: "${address}"}) {
      user
      amount
      tokenIn
      tokenOut
      transactionHash
    }
  }`
}

export const queryTransfers = (address: string) => {
  return gql`{
    transfers(orderBy: blockTimestamp, orderDirection: desc, where: {from: "${address}"}) {
      from
      to
      value
      transactionHash
    }
  }`
}

export const queryStakeds = (address: string) => {
  return gql`{
    stakeds(orderBy: blockTimestamp, orderDirection: desc, where: {staker: "${address}"}) {
      amount
      staker
      transactionHash
    }
  }`
}

export const queryWithdraws = (address: string) => {
  return gql`{
    withdrawAlls(orderBy: blockTimestamp, orderDirection: desc, where: {withdrawer: "${address}"}) {
      amount
      transactionHash
      withdrawer
    }
  }`
}

export const queryProof = (address: string) => {
  return gql`{
    optiTaskRespondeds(
      orderBy: blockTimestamp
      orderDirection: desc
      where: {task_accountAddress: "${address}"}
    ) {
      taskIndex
      signature
      task_stakingAddress
      task_accountAddress
      transactionHash
    }
  }`
}