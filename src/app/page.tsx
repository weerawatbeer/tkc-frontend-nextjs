import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen items-center justify-items-center py-10">
      <div className="flex flex-row gap-4">
        <Link
          href="/test1"
          className="flex h-10 w-[120px] flex-row items-center justify-center rounded-2xl border text-center font-medium"
        >
          Test 1
        </Link>
        <Link
          href="/test2"
          className="flex h-10 w-[120px] flex-row items-center justify-center rounded-2xl border text-center font-medium"
        >
          Test 2
        </Link>
      </div>
    </div>
  )
}
