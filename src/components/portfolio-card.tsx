import Image from 'next/image'

interface PortfolioCardProps {
  title: string
  image: string
  categories: string[]
}

export default function PortfolioCard({
  title,
  image,
  categories,
}: PortfolioCardProps) {
  return (
    <div className="relative h-[276px] w-[518px] rounded-[40px] bg-white px-6 shadow-[0px_4px_24px_0px_rgba(67,67,67,0.18)]">
      <div className="relative mx-auto h-48 max-w-10/12 -translate-y-1/2">
        <Image
          src={image || '/assets/eventos-premium-1.png'}
          alt={title}
          fill
          className="rounded-2xl object-contain"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="bg-gradient-to-r from-[#B224EF] to-[#7579FF] bg-clip-text text-2xl font-semibold text-transparent">
          {title}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span key={index} className="rounded-full text-sm text-[#5F6073]">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
