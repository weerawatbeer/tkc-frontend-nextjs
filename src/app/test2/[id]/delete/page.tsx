'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  thumbnail: string
}

export default function DeleteProductPage() {
  const router = useRouter()
  const params = useParams()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${params.id}`
        )
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(
        `https://dummyjson.com/products/${params.id}`,
        {
          method: 'DELETE',
        }
      )

      if (response.ok) {
        router.push('/test2')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex h-64 items-center justify-center py-8">
        <Loader className="h-8 w-8" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
          <Button asChild>
            <Link href="/test2">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Delete Product</h1>
          <Button variant="outline" asChild>
            <Link href="/test2">Cancel</Link>
          </Button>
        </div>

        <div className="bg-destructive/10 border-destructive mb-6 rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Are you sure you want to delete this product?
          </h2>
          <p className="text-muted-foreground mb-4">
            This action cannot be undone.
          </p>

          <div className="mb-4 flex items-start space-x-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={product.thumbnail || '/placeholder.svg'}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{product.title}</h3>
              <p className="text-muted-foreground text-sm">
                {product.category}
              </p>
              <p className="mt-1 text-sm font-medium">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" asChild>
              <Link href="/test2">Cancel</Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="cursor-pointer"
            >
              {deleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                'Delete Product'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
