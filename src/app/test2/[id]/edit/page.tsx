'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader } from '@/components/ui/loader'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  useProduct,
  useUpdateProduct,
  formatAxiosError,
} from '@/hooks/use-products'
import { toast } from '@/hooks/use-toast'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(Number(params?.id))
  const updateProduct = useUpdateProduct()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  })

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
      })
    }
  }, [product])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    updateProduct.mutate(
      {
        id: Number(params.id),
        data: {
          title: formData.title,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          category: formData.category,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Product updated',
            description: 'The product has been updated successfully.',
          })
          router.push('/test2')
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: formatAxiosError(error),
            variant: 'destructive',
          })
        },
      }
    )
  }

  // Render skeleton while loading
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {formatAxiosError(error)}
          </p>
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
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Button variant="outline" asChild>
            <Link href="/test2">Cancel</Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={updateProduct.isPending}
              variant="outline"
            >
              {updateProduct.isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4" />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
