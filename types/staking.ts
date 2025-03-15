import { z } from 'zod';

export const StakingSchema = z.object({
  idProtocol: z.string(),
  addressToken: z.string(),
  addressStaking: z.string(),
  nameToken: z.string(),
  nameProject: z.string(),
  chain: z.string(),
  apy: z.number(),
  tvl: z.number(),
  stablecoin: z.boolean(),
  categories: z.array(z.string()),
  logo: z.string().url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const StakingListSchema = z.array(StakingSchema);


export const StakingPositionSchema = z.object({
  amountStaked: z.string(),
  numberOfDays: z.number(),
  registrationTimestamp: z.number(),
  isValid: z.boolean(),
  pool: z.object({
    idProtocol: z.string(),
    addressToken: z.string(),
    addressStaking: z.string(),
    nameToken: z.string(),
    nameProject: z.string(),
    chain: z.string(),
    apy: z.number(),
    tvl: z.number(),
    stablecoin: z.boolean(),
    categories: z.array(z.string()),
    logo: z.string().url(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
});

export const StakingPositionListSchema = z.array(StakingPositionSchema);

export type StakingPosition = z.infer<typeof StakingPositionSchema>;
export type StakingPositionList = z.infer<typeof StakingPositionListSchema>;

export type Staking = z.infer<typeof StakingSchema>;
export type StakingList = z.infer<typeof StakingListSchema>;
