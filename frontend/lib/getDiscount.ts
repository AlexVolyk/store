type discount = (
    originalPrice: number | null | undefined,
    newPrice: number
) => number | null

export const getDiscount: discount = (originalPrice, newPrice) => {
    return originalPrice ? Math.round(((originalPrice - newPrice) / originalPrice) * 100) : null
}

