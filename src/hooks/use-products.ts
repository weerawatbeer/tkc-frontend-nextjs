'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/axios'
import { AxiosError } from 'axios'

export interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  thumbnail: string
  images: string[]
}

interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

// Fetch products with pagination and search
export function useProducts(page = 1, limit = 10, search?: string) {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['products', page, limit, search],
    queryFn: async (): Promise<ProductsResponse> => {
      if (!token) {
        throw new Error('Authentication required')
      }

      const skip = (page - 1) * limit
      const url = search
        ? `/products/search?q=${search}&limit=${limit}&skip=${skip}`
        : `/products?limit=${limit}&skip=${skip}`

      try {
        const response = await api.get(url)
        return response.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },
    enabled: !!token,
  })
}

// Fetch a single product by ID
export function useProduct(id: string | number) {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      if (!token) {
        throw new Error('Authentication required')
      }

      try {
        const response = await api.get(`/products/${id}`)
        return response.data
      } catch (error) {
        console.error(`Error fetching product ${id}:`, error)
        throw error
      }
    },
    enabled: !!token && !!id,
  })
}

// Add a new product
export function useAddProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      productData: Omit<Product, 'id' | 'images' | 'thumbnail'>
    ) => {
      try {
        const response = await api.post('/products/add', productData)
        return response.data
      } catch (error) {
        console.error('Error adding product:', error)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate products queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Update an existing product
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: Partial<Product>
    }) => {
      try {
        const response = await api.put(`/products/${id}`, data)
        return response.data
      } catch (error) {
        console.error(`Error updating product ${id}:`, error)
        throw error
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate specific product query and products list
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Delete a product
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const response = await api.delete(`/products/${id}`)
        return response.data
      } catch (error) {
        console.error(`Error deleting product ${id}:`, error)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate products queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Helper function to format Axios errors for display
export function formatAxiosError(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message
  }
  return error instanceof Error ? error.message : 'An unknown error occurred'
}
