'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Upload, X, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageUploaded: (url: string) => void
  onImageRemoved?: () => void
  className?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

export function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  className
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload an image (JPEG, PNG, WebP, or GIF)'
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return `File too large (${sizeMB}MB). Maximum size is 5MB`
    }

    return null
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error
    setError(null)

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase Storage
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `product-images/${fileName}`

      // Simulate progress (Supabase doesn't provide real-time upload progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      clearInterval(progressInterval)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path)

      setProgress(100)
      onImageUploaded(publicUrl)

      // Reset progress after a short delay
      setTimeout(() => {
        setProgress(0)
      }, 1000)

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageRemoved?.()
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Image
      </label>

      {/* Upload Area */}
      <div className="relative">
        {!preview ? (
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className={cn(
              'w-full h-48 border-2 border-dashed rounded-lg',
              'flex flex-col items-center justify-center',
              'transition-colors cursor-pointer',
              uploading
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50',
              error && 'border-red-300 bg-red-50'
            )}
          >
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload product image
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP or GIF (max 5MB)
            </p>
          </button>
        ) : (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
            <Image
              src={preview}
              alt="Product preview"
              fill
              className="object-contain bg-gray-50"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className={cn(
                'absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full',
                'hover:bg-red-700 transition-colors shadow-lg',
                uploading && 'opacity-50 cursor-not-allowed'
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {/* Progress bar */}
      {uploading && progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Upload status */}
      {uploading && (
        <p className="text-sm text-gray-600 text-center">
          Uploading... {progress}%
        </p>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Helper text */}
      {!error && !uploading && (
        <p className="text-xs text-gray-500">
          Recommended size: 800x800px or larger. Images will be displayed as thumbnails in the product list.
        </p>
      )}
    </div>
  )
}
