'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category } from '@/types/models'

interface CategoryFormProps {
    initialData?: Category
    onSubmit: (data: Partial<Category>) => Promise<void>
    isSubmitting?: boolean
}

export function CategoryForm({ initialData, onSubmit, isSubmitting = false }: CategoryFormProps) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || ''
    })
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Auto-generate slug from name if creating new category and slug hasn't been manually touched
        if (name === 'name' && !initialData) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')

            setFormData(prev => ({
                ...prev,
                slug
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.name.trim()) {
            setError('Name is required')
            return
        }

        if (!formData.slug.trim()) {
            setError('Slug is required')
            return
        }

        try {
            await onSubmit(formData)
        } catch (err) {
            console.error(err)
            setError('An error occurred while saving. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/categories"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {initialData ? 'Edit Category' : 'New Category'}
                </h1>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            id="name"
                            name="name"
                            label="Name"
                            placeholder="e.g. T-Shirts"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Input
                            id="slug"
                            name="slug"
                            label="Slug"
                            placeholder="e.g. t-shirts"
                            value={formData.slug}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-500">
                            The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
                        </p>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                    <Link href="/admin/categories">
                        <Button variant="ghost" type="button" disabled={isSubmitting}>
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Save Category
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
