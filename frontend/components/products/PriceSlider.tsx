'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'

interface PriceSliderProps {
  priceMax: number
  updateFilters: (key: string, value: string[] | string | number) => void
}

export function PriceSlider({ priceMax, updateFilters }: PriceSliderProps) {
  const [localPriceMax, setLocalPriceMax] = useState(priceMax)
  const [prevPriceMax, setPrevPriceMax] = useState(priceMax)

  if (priceMax !== prevPriceMax) {
    setPrevPriceMax(priceMax)
    setLocalPriceMax(priceMax)
  }

  const handleCommit = () => {
    updateFilters('priceMax', localPriceMax)
  }

  return (
    <div className="flex flex-col gap-3 px-0.5">
      <Slider
        value={localPriceMax}
        min={0}
        max={1500}
        step={10}
        onValueChange={(val) => setLocalPriceMax(val)}
        onMouseUp={handleCommit}
        onTouchEnd={handleCommit}
        onKeyUp={handleCommit}
        aria-label="Filter by maximum price"
      />
      <div className="flex items-center justify-between text-xs">
        <Badge variant="outline" className="text-[10px] font-normal px-2 py-0.5">
          $0
        </Badge>
        <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5 border border-primary/20">
          Up to ${localPriceMax}
        </Badge>
      </div>
    </div>
  )
}
