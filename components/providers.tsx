"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { useWagmiConfig } from "@/lib/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

const queryClient = new QueryClient();

export default function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const wagmiConfig = useWagmiConfig();

  return (
    <HeroUIProvider navigate={router.push}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={baseSepolia}
            projectId={process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID}
            rpcUrl={process.env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA}
            config={{
              appearance: {
                name: 'OPTI',
                logo: '/logo.png',
                mode: 'light',
                theme: 'base',
              },
            }}
          >
            <RainbowKitProvider modalSize="compact">
              <NextThemesProvider {...themeProps}>
                {children}
              </NextThemesProvider>
            </RainbowKitProvider>
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </HeroUIProvider>
  );
}
