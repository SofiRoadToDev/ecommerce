'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { updateBranding } from '@/app/admin/branding/actions'
import type { Branding } from '@/types/models'

interface BrandingFormProps {
    initialData?: Branding | null
}

export function BrandingForm({ initialData }: BrandingFormProps) {
    const [formData, setFormData] = useState({
        brand_name: initialData?.brand_name || '',
        primary_color: initialData?.primary_color || '#000000',
        secondary_color: initialData?.secondary_color || '#ffffff',
        logo_url: initialData?.logo_url || ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLogoUpload = (url: string) => {
        setFormData(prev => ({
            ...prev,
            logo_url: url
        }))
    }

    const handleLogoRemove = () => {
        setFormData(prev => ({
            ...prev,
            logo_url: ''
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage(null)

        try {
            await updateBranding(formData, initialData?.id)
            setMessage({ type: 'success', text: 'Branding updated successfully' })
        } catch (error) {
            console.error(error)
            setMessage({ type: 'error', text: 'Failed to update branding' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
                {message && (
                    <div className={`p-4 rounded-lg text-sm border ${message.type === 'success'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Logo Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Brand Logo</h3>
                    <ImageUpload
                        currentImageUrl={formData.logo_url}
                        onImageUploaded={handleLogoUpload}
                        onImageRemoved={handleLogoRemove}
                        bucketName="product-images"
                        label="Upload your logo"
                    />
                </div>

                <div className="border-t border-gray-100 dark:border-slate-800 my-6" />

                {/* Brand Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Brand Identity</h3>

                    <div className="space-y-2">
                        <Input
                            id="brand_name"
                            name="brand_name"
                            label="Brand Name"
                            placeholder="e.g. My Awesome Store"
                            value={formData.brand_name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                id="primary_color"
                                name="primary_color"
                                type="color"
                                label="Primary Color"
                                value={formData.primary_color || '#000000'}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="h-12 w-full cursor-pointer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="secondary_color"
                                name="secondary_color"
                                type="color"
                                label="Secondary Color"
                                value={formData.secondary_color || '#ffffff'}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="h-12 w-full cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
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
                                Save Changes
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
