'use client'

interface InfoBoxProps {
  title: string
  description?: string
  onClick?: () => void
  className?: string
}

export default function InfoBox({ title, description, onClick, className = "" }: InfoBoxProps) {
  const height = description ? "h-24" : "h-12"
  
  return (
    <div 
      className={`box_info flex justify-between items-center bg-gray-100 rounded-[19px] px-6 cursor-pointer mt-[2vh] relative ${height} ${className}`}
      onClick={onClick}
    >
      <div className="w-full flex flex-col justify-center h-full">
        <p className="font-medium text-[16px] tracking-[0.02em] leading-tight whitespace-nowrap overflow-hidden text-ellipsis pr-10 mb-0">
          {title}
        </p>
        {description && (
          <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-700 max-w-[66%]">
            {description}
          </p>
        )}
      </div>
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
        <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </div>
      </div>
    </div>
  )
} 