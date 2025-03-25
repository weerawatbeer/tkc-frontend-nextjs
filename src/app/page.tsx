import AuthInfo from '@/components/auth-info'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center gap-4 py-20">
      <div className="flex flex-row gap-4">
        <Link
          href="/test1"
          className="flex h-10 w-[120px] flex-row items-center justify-center rounded-xl border bg-[#7579FF] text-center font-medium text-white"
        >
          Test 1
        </Link>
        <Link
          href="/test2"
          className="flex h-10 w-[120px] flex-row items-center justify-center rounded-xl border bg-[#7579FF] text-center font-medium text-white"
        >
          Test 2
        </Link>
      </div>
      <AuthInfo />
    </div>
  )
}
