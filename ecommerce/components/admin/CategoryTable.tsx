'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Edit2, Trash2, AlertTriangle, Search, Plus } from 'lucide-react'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/Pagination'
import type { Category } from '@/types/models'

interface CategoryTableProps {
    categories: Category[]
    onDelete: (categoryId: string) => Promise<void>
}

export function CategoryTable({ categories, onDelete }: CategoryTableProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean
        category: Category | null
    }>({ open: false, category: null })
    const [deleting, setDeleting] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Filter categories
    const filteredCategories = useMemo(() => {
        return categories.filter(category => {
            const matchesSearch =
                category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                category.slug.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesSearch
        })
    }, [categories, searchQuery])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    // Calculate pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

    const handleDeleteClick = (category: Category) => {
        setDeleteConfirm({ open: true, category })
    }

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.category) return

        setDeleting(true)
        try {
            await onDelete(deleteConfirm.category.id)
            setDeleteConfirm({ open: false, category: null })
        } catch (error) {
            console.error('Delete error:', error)
        } finally {
            setDeleting(false)
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirm({ open: false, category: null })
    }

    return (
        <div className="space-y-4">
            {/* Search Bar and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-gray-500"
                    />
                </div>

                <Link href="/admin/categories/new">
                    <Button className="w-full sm:w-auto flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Category
                    </Button>
                </Link>
            </div>

            {/* Categories Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCategories.length === 0 ? (
                        <TableEmpty message="No categories found" colSpan={4} />
                    ) : (
                        paginatedCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>
                                    <span className="font-medium text-gray-900 dark:text-gray-200">
                                        {category.name}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {category.slug}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {new Date(category.created_at).toLocaleDateString()}
                                    </span>
                                </TableCell>

                                {/* Actions */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/categories/${category.id}/edit`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit category"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(category)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete category"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            {filteredCategories.length > 0 && (
                <>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.open && deleteConfirm.category && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={handleDeleteCancel}
                    />

                    {/* Modal */}
                    <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Delete Category
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Are you sure you want to delete{' '}
                                    <strong className="text-gray-900 dark:text-white">{deleteConfirm.category.name}</strong>? This action
                                    cannot be undone.
                                </p>

                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="secondary"
                                        onClick={handleDeleteCancel}
                                        disabled={deleting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleDeleteConfirm}
                                        disabled={deleting}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {deleting ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
