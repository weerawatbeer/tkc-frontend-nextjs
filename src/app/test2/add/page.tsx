'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader } from '@/components/ui/loader'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { useAddProduct, formatAxiosError } from '@/hooks/use-products'
import { toast } from '@/hooks/use-toast'
import { CATEGORY } from '@/types/category'

// Create a schema for form validation
const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(30, { message: 'Title must not exceed 30 characters' })
    .refine((value) => value.startsWith('TKC'), {
      message: 'Title must start with TKC',
    }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  price: z.string().refine((value) => /^\d+(\.\d{2})?$/.test(value), {
    message: 'Price must be a number with 2 decimal places',
  }),
  category: z.nativeEnum(CATEGORY, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function AddProductPage() {
  const router = useRouter()
  const addProduct = useAddProduct()

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: undefined,
    },
  })

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    addProduct.mutate(
      {
        title: data.title,
        description: data.description,
        price: Number.parseFloat(data.price),
        category: data.category,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Product added',
            description: 'The product has been added successfully.',
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

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <Button variant="outline" asChild>
            <Link href="/test2">Cancel</Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="TKC Product Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must start with TKC and be 5-30 characters long.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          // Allow only numbers and decimal point
                          const value = e.target.value.replace(/[^0-9.]/g, '')

                          // Ensure proper decimal format (0.00)
                          const parts = value.split('.')
                          if (parts.length > 1) {
                            // Limit to 2 decimal places
                            parts[1] = parts[1].slice(0, 2)
                            field.onChange(parts.join('.'))
                          } else {
                            field.onChange(value)
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a number with exactly 2 decimal places (e.g., 19.99)
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value={CATEGORY.FRAGRANCES}>
                          Fragrances
                        </SelectItem>
                        <SelectItem value={CATEGORY.FURNITURE}>
                          Furniture
                        </SelectItem>
                        <SelectItem value={CATEGORY.BEAUTY}>Beauty</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" asChild>
                  <Link href="/test2">Cancel</Link>
                </Button>
                <Button type="submit" disabled={addProduct.isPending}>
                  {addProduct.isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4" />
                      Adding Product...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
