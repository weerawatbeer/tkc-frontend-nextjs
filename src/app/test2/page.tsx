import ProductList from '@/components/product-list'
import { Suspense } from 'react'

export default function Test2Page() {
  return (
    <div className="container mx-auto py-8">
      <Suspense>
        <ProductList />
      </Suspense>
    </div>
  )
}
