import { Link } from '@heroui/link'
import DocsGrid from './_components/DocsGrid'

export default function page() {
  return (
    <section id='docs' className='flex-grow flex flex-col items-center justify-center gap-5 py-5'>
      <span className='text-lg sm:text-xl'>Simplified Understanding!</span>
      <span className='text-md'>You can see full documentation in our <Link isExternal href="https://kbaji.gitbook.io/opti-finance">docs</Link></span>
      <DocsGrid />
    </section>
  )
}
