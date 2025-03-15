import { subtitle, title } from "@/components/primitives";
import Link from "next/link";

export default function Page() {
  return (
    <section id="home" className="flex w-full h-full items-center justify-center flex-grow">
      <div className="max-w-lg text-center inline-block">
        <div className="flex flex-col items-center justify-center gap-1">
          <div className={title()}>
            OPTI Finance
          </div>
          <div className={subtitle()}>
            Maximize Profit, Minimize Effort.
          </div>
          <Link href="/generate" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none shadow-lg shadow-primary/40 bg-primary text-primary-foreground data-[hover=true]:opacity-hover">
            Let&apos;s Go
          </Link>
        </div>
      </div>
    </section>
  );
}
