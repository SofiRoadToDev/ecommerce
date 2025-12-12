/**
 * Utility functions for generating and validating slugs
 */

/**
 * Generate a URL-friendly slug from a string
 * Example: "Zapatillas Nike Air Max" -> "zapatillas-nike-air-max"
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        // Replace accented characters
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Remove special characters
        .replace(/[^a-z0-9\s-]/g, '')
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove consecutive hyphens
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '')
}

/**
 * Validate if a string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

/**
 * Generate a unique slug by appending a number if needed
 * Example: "zapatillas-nike" -> "zapatillas-nike-2"
 */
export function makeUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
    let slug = baseSlug
    let counter = 2

    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}
