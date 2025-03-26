'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import Image from 'next/image'
import {
  useProduct,
  useDeleteProduct,
  formatAxiosError,
} from '@/hooks/use-products'
import { toast } from '@/hooks/use-toast'

export default function DeleteProductPage() {
  const router = useRouter()
  const params = useParams()
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(Number(params.id))
  const deleteProduct = useDeleteProduct()

  const handleDelete = async () => {
    deleteProduct.mutate(Number(params?.id), {
      onSuccess: () => {
        toast({
          title: 'Product deleted',
          description: 'The product has been deleted successfully.',
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
    })
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

          <div className="bg-destructive/10 border-destructive mb-6 rounded-lg border p-6">
            <Skeleton className="mb-4 h-6 w-3/4" />
            <Skeleton className="mb-4 h-4 w-1/2" />

            <div className="mb-4 flex items-start space-x-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
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
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? (
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
