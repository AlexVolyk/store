/**
 * Converts a text string into an SEO-friendly URL slug.
 * Example: "Atelier Chronograph 39!" -> "atelier-chronograph-39"
 */
export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with single hyphen
        .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
};
