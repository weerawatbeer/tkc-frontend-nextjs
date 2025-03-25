'use client'

import type React from 'react'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader } from '@/components/ui/loader'
import { useDebounce } from '@/hooks/use-debounce'

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  thumbnail: string
  images: string[]
}

export default function ProductList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])

  const [loading, setLoading] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 1000)

  const currentPage = Number(searchParams.get('page') || '1')
  const pageSize = Number(searchParams.get('limit') || '10')
  const totalPages = Math.ceil(totalProducts / pageSize)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const skip = (currentPage - 1) * pageSize
      let url = `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`

      if (debouncedSearchQuery) {
        url = `https://dummyjson.com/products/search?q=${debouncedSearchQuery}&limit=${pageSize}&skip=${skip}`
      }

      const response = await fetch(url)
      const data = await response.json()

      setProducts(data.products)
      setTotalProducts(data.total)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/test2?${params.toString()}`)
  }

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('limit', value)
    params.set('page', '1') // Reset to first page when changing page size
    router.push(`/test2?${params.toString()}`)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="h-8 w-8 cursor-pointer p-0"
        >
          {i}
        </Button>
      )
    }

    return (
      <div className="flex items-center space-x-2 bg-white">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 cursor-pointer p-0"
        >
          1
        </Button>

        {startPage > 2 && <span>...</span>}

        {pages}

        {endPage < totalPages - 1 && <span>...</span>}

        {totalPages > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 cursor-pointer p-0"
          >
            {totalPages}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product List</h1>
        <Button asChild>
          <Link href="/test2/add" className="rounded-2xl border">
            New Product
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pr-10"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {searchQuery && loading ? (
              <Loader className="h-4 w-4" />
            ) : (
              <svg
                className="h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader className="h-8 w-8" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No.</TableHead>
                <TableHead className="w-24">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-24">Price</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      {product?.thumbnail && (
                        <Image
                          src={
                            product?.thumbnail || 'https://placehold.co/100x100'
                          }
                          alt="product_image"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/test2/${product.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/test2/${product.id}/delete`}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Items per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-16 cursor-pointer">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer bg-white">
              <SelectItem value="5" className="cursor-pointer">
                5
              </SelectItem>
              <SelectItem value="10" className="cursor-pointer">
                10
              </SelectItem>
              <SelectItem value="20" className="cursor-pointer">
                20
              </SelectItem>
              <SelectItem value="50" className="cursor-pointer">
                50
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderPagination()}
      </div>
    </div>
  )
}
