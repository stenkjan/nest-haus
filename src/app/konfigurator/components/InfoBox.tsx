'use client'

interface InfoBoxProps {
  title: string
  description?: string
  onClick?: () => void
  className?: string
}

export default function InfoBox({ title, description, onClick, className = '' }: InfoBoxProps) {
  const hasDescription = description && description.trim().length > 0
  const minHeight = hasDescription ? "min-h-[6rem]" : "min-h-[3rem]"
  
  return (
    <div
      className={`box_info flex justify-between items-center bg-gray-100 rounded-[1.2rem] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] cursor-pointer mt-[clamp(1rem,2vh,1.5rem)] relative ${minHeight} min-h-[44px] transition-all duration-200 hover:bg-gray-200 ${className}`}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-medium text-[clamp(1rem,1.8vw,1.125rem)] tracking-wide leading-tight whitespace-nowrap overflow-hidden text-ellipsis mb-0 text-black">
          {title}
        </p>
        {hasDescription && (
          <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] tracking-wide leading-relaxed text-gray-700 mt-[0.25em]">
            {description}
          </p>
        )}
      </div>
      
      <div className="min-w-[1.5rem] min-h-[1.5rem] rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-[0.75rem] h-[0.75rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  )
} 