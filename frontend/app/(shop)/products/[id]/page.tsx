import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/productData'
import { ProductView } from './ProductView'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = getProductById(Number(id))

    if (!product) notFound()

    return <ProductView product={product} />
}