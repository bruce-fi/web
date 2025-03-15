import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function urlSepoliaBasescan({ address, txHash, type }: { address?: string, txHash?: string, type?: 'transaction' | 'address' }) {
  return `https://sepolia.basescan.org/${type === 'address' ? 'address' : 'tx'}/${address || txHash}`;
}