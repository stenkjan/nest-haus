'use client'

interface SelectionOptionProps {
  id: string
  name: string
  description: string
  price?: {
    type: 'base' | 'upgrade' | 'included'
    amount?: number
    monthly?: number
  }
  isSelected?: boolean
  onClick: (id: string) => void
}

export default function SelectionOption({ 
  id, 
  name, 
  description, 
  price, 
  isSelected = false, 
  onClick 
}: SelectionOptionProps) {
  const renderPrice = () => {
    if (!price) return null
    
    if (price.type === 'included') {
      return (
        <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px]">
          <span>inklusive.</span>
        </p>
      )
    }
    
    if (price.type === 'base') {
      return (
        <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px]">
          Ab {price.amount?.toLocaleString('de-DE')} €<br />
          oder {price.monthly} €<br />
          für 240 Mo.
        </p>
      )
    }
    
    if (price.type === 'upgrade') {
      return (
        <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px]">
          Aufpreis von<br />
          {price.amount?.toLocaleString('de-DE')} € oder {price.monthly} €<br />
          für 240 Mo.
        </p>
      )
    }
  }

  return (
    <div
      className={`box_selection flex justify-between items-center h-24 border rounded-[19px] px-6 cursor-pointer transition-colors ${
        isSelected
          ? 'selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1]'
          : 'border-gray-300 hover:border-[#3D6DE1]'
      }`}
      onClick={() => onClick(id)}
    >
      <div className="box_selection_name max-w-[50%]">
        <p className="font-medium text-[16px] tracking-[0.02em] leading-tight mb-2">
          {name}
        </p>
        <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600">
          {description}
        </p>
      </div>
      <div className="box_selection_price text-right pl-4 whitespace-nowrap">
        {renderPrice()}
      </div>
    </div>
  )
} 