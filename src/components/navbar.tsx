'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  return (
    <div className="mx-auto flex h-[72px] w-full max-w-7xl flex-row items-center justify-between rounded-2xl bg-[#1B1C37] px-6 md:px-12">
      <Link href="/" className="flex flex-row items-center gap-3">
        <Image width={28} height={28} src="/assets/avatar.png" alt="avatar" />
        <span className="font-medium text-white">Cristian Muñiz</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-7 lg:flex">
        <Link href="/" className="font-semibold text-white">
          Home
        </Link>
        <Link
          href="#skills"
          className="hover:text-primary font-medium text-white"
        >
          Skills
        </Link>
        <Link
          href="#portfolio"
          className="hover:text-primary font-medium text-white"
        >
          Portfolio
        </Link>
        <Link
          href="#blog"
          className="hover:text-primary font-medium text-white"
        >
          Blog
        </Link>
      </nav>
      <Link
        href="#contact"
        className="hidden h-10 w-[180px] rounded-xl bg-[#7579FF] px-4 py-2 text-center font-medium text-white lg:block"
      >
        Contact Me
      </Link>

      <button className="text-white lg:hidden">
        <Menu size={24} />
      </button>
    </div>
  )
}
