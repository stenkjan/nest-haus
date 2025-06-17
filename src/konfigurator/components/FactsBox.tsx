'use client'

interface FactsBoxProps {
  title: string
  facts: string[]
  links?: Array<{
    text: string
    href: string
  }>
}

export default function FactsBox({ title, facts, links }: FactsBoxProps) {
  return (
    <div className="box_facts mt-4 rounded-[19px] px-6 py-4">
      <p className="font-medium text-[16px] tracking-[0.02em] leading-tight mb-3">
        {title}
      </p>
      <div className="space-y-2">
        {facts.map((fact, index) => (
          <p key={index} className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-700 mb-2">
            {fact}
          </p>
        ))}
        {links && (
          <>
            <div className="h-4"></div>
            {links.map((link, index) => (
              <p key={index} className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-700 mb-2">
                <a 
                  className="text-[#3D6DE1] font-medium text-[12px] tracking-[0.03em] leading-[14px] underline" 
                  href={link.href}
                >
                  {link.text}
                </a>
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  )
} 