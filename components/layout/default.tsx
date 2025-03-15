"use client"

import { Link } from "@heroui/link";
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('../navbar').then(mod => mod.default), {
  ssr: false
});
const Providers = dynamic(() => import('../providers').then(mod => mod.default), {
  ssr: false,
});

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="min-h-screen">
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="min-h-screen w-screen flex justify-center bg-background antialiased">
            <div className="max-w-[2000px] w-full">
              <div className={`
                flex flex-col
                mx-2.5 sm:mx-[30px] my-2.5 sm:my-5
                rounded-3xl
                border-2 border-gray-500
                relative
                h-[calc(100vh-20px)] sm:h-[calc(100vh-40px)]
                layout-background-image
                overflow-hidden
              `}>
                <div className="
                  flex flex-col flex-1
                  w-full h-full
                  overflow-hidden
                ">
                  <div className="
                    flex flex-col flex-1
                    rounded-3xl
                    w-full h-full
                    p-5 sm:p-10
                    overflow-y-auto
                    bg-hero bg-center bg-no-repeat bg-cover
                    backdrop-blur-lg backdrop-contrast-125 dark:backdrop-brightness-50
                  ">
                    <Navbar />
                    <main className="flex-1">
                      {children}
                    </main>
                    <footer className="w-full flex items-center justify-center py-3">
                      <Link
                        isExternal
                        className="flex items-center gap-1 text-current"
                        href="https://coinbase.com"
                        title="profile risk homepage"
                      >
                        <span className="text-default-600">Built in</span>
                        <p className="text-primary">Coinbase</p>
                      </Link>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}