'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Info } from 'lucide-react'

import Navbar from '@/components/navbar'
import ProgressCircle from '@/components/progress-circle'
import PortfolioCard from '@/components/portfolio-card'

const socialIcon = [
  {
    src: '/assets/instagram.svg',
    alt: 'Instagram',
    href: '#',
  },
  {
    src: '/assets/facebook.svg',
    alt: 'Facebook',
    href: '#',
  },
  {
    src: '/assets/linkedin.svg',
    alt: 'LinkedIn',
    href: '#',
  },
  {
    src: '/assets/twitter.svg',
    alt: 'Twitter',
    href: '#',
  },
]

export default function Page() {
  return (
    <div className="bg-white">
      <div className="container mx-auto min-h-screen pt-20">
        <Navbar />

        {/* Hero Section */}
        <section className="dots-pattern relative py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold text-black md:text-5xl lg:text-6xl">
                Hi, I am <br />
                Cristian{' '}
                <span role="img" aria-label="palette">
                  🎨
                </span>
              </h1>
              <p className="mt-4 max-w-md text-sm font-light text-black">
                I am a UX/UI Designer. I like to create interfaces simple,
                beautiful and functional. I love what I do, it is not just work
                for me, it is a true passion.
              </p>
              <div className="mt-8 inline-block">
                <Link
                  href="#contact"
                  className="hover:bg-primary/90 flex items-center gap-2 rounded-2xl bg-black bg-gradient-to-r from-[#B224EF] to-[#7579FF] px-6 py-3 text-white transition-colors"
                >
                  <span>¡Contact Me!</span>
                  <Info size={16} />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="/assets/allura-ui-windows.webp"
                alt="Designer illustration"
                width={500}
                height={400}
                className="mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-white px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="bg-gradient-to-r from-[#B224EF] to-[#7579FF] bg-clip-text pb-[60px] text-6xl font-semibold text-transparent">
              Skills
            </h2>

            <div className="grid grid-cols-2 gap-8 justify-self-center md:grid-cols-4">
              <ProgressCircle percentage={90} title="Figma / Adobe XD" />
              <ProgressCircle percentage={80} title="UI Design" />
              <ProgressCircle
                percentage={80}
                title="Information Architecture"
              />
              <ProgressCircle percentage={70} title="UX Design" />
              <ProgressCircle percentage={70} title="Prototyping" />
              <ProgressCircle percentage={70} title="Box Model" />
              <ProgressCircle percentage={70} title="Business Model Canvas" />
              <ProgressCircle percentage={70} title="Design Systems" />
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="bg-[#1B1C37] px-6 py-16 text-white md:px-20 md:py-24">
          <div className="relative flex h-[360px] flex-row justify-between rounded-[60px] bg-white px-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <Image
                width={120}
                height={120}
                src="/assets/icono-01.svg"
                alt="avatar"
                className="aspect-square h-[64px] w-[64px] lg:h-[120px] lg:w-[120px]"
              />
              <p className="justify-start text-4xl leading-[67.20px] font-bold text-gray-800 lg:text-6xl">
                100%
              </p>
              <div className="justify-start text-2xl leading-9 font-semibold text-gray-500 lg:text-4xl">
                Responsibility
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <Image
                width={120}
                height={120}
                src="/assets/icono-02.png"
                alt="avatar"
                className="aspect-square h-[64px] w-[64px] lg:h-[120px] lg:w-[120px]"
              />
              <p className="justify-start text-4xl leading-[67.20px] font-bold text-gray-800 lg:text-6xl">
                100%
              </p>
              <div className="justify-start text-2xl leading-9 font-semibold text-gray-500 lg:text-4xl">
                Puntuality
              </div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="inline-flex flex-col items-center justify-center gap-5 rounded-[60px] bg-gradient-to-r from-fuchsia-600 to-indigo-400 px-8 pt-14 pb-20 shadow-[40px_4px_175px_0px_rgba(117,121,255,0.30)] lg:px-16">
                <p className="justify-start text-4xl leading-[67.20px] font-bold text-white lg:text-6xl">
                  100%
                </p>
                <div className="justify-start text-2xl leading-9 font-semibold text-white lg:text-4xl">
                  Colombian
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="bg-white px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="bg-gradient-to-r from-[#B224EF] to-[#7579FF] bg-clip-text pb-[60px] text-6xl font-semibold text-transparent">
              Portfolio
            </h2>

            <div className="mt-[64px] flex flex-row gap-8">
              <PortfolioCard
                title="Eventos Premium"
                image="/assets/eventos-premium-1.png"
                categories={['Elegante', 'Serio', 'Estatus']}
              />
              <PortfolioCard
                title="Mi Portal U"
                image="/assets/eventos-premium-1.png"
                categories={['Amigable', 'Dashboard', 'Simple']}
              />
              <PortfolioCard
                title="A&C App"
                image="/assets/eventos-premium-1.png"
                categories={['Elegante', 'Serio', 'Estatus']}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-secondary px-6 py-12 text-white md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex justify-center gap-6">
              {socialIcon.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="hover:text-primary text-white transition-colors"
                >
                  <Image
                    src={social.src}
                    width={24}
                    height={24}
                    alt={social.alt}
                  />
                </Link>
              ))}
            </div>
            <div className="text-center text-sm text-[#5F6073]">
              Cristian David Muñiz Camayo @cristianmuniz © 2023
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
