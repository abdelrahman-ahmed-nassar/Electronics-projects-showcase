// Helper to check if a value is a Cloudinary public ID or a full URL
export function isCloudinaryPublicId(
  value: string | null | undefined
): boolean {
  if (!value) return false;

  // Check if it's a full URL (starts with http/https)
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return false;
  }

  // If it contains a folder structure like "projects/xxx" or "profiles/xxx", it's likely a public ID
  return true;
}

const CLOUDINARY_UPLOAD_BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

// Full delivery URLs so they are valid `src` values for next/image
export const CLOUDINARY_DEFAULTS = {
  profile: "/images/default-user-profile-image.svg",
  team: `${CLOUDINARY_UPLOAD_BASE}/teams/default-team-image`,
  project: `${CLOUDINARY_UPLOAD_BASE}/projects/default-project-image`,
} as const;

// Stored values may be full URLs, root-relative paths, or bare Cloudinary public IDs
export function resolveImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.includes("default-user-profile")) return CLOUDINARY_DEFAULTS.profile;
  if (/^(https?:\/\/|\/)/.test(value)) return value;
  return `${CLOUDINARY_UPLOAD_BASE}/${value}`;
}

// Helper to extract public ID from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url) return null;

  // Check if it's a Cloudinary URL
  if (!url.includes("res.cloudinary.com")) {
    return null;
  }

  try {
    // Extract the public ID from the URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{id}.{ext}
    // or: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{id}.{ext}
    const parts = url.split("/upload/");
    if (parts.length !== 2) return null;

    let pathPart = parts[1];

    // Remove version if present (e.g., v1767552193/)
    pathPart = pathPart.replace(/^v\d+\//, "");

    // Remove extension
    const lastDotIndex = pathPart.lastIndexOf(".");
    if (lastDotIndex > 0) {
      pathPart = pathPart.substring(0, lastDotIndex);
    }

    return pathPart;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
}

// Helper to check if an image is a default Cloudinary image
export function isDefaultCloudinaryImage(
  url: string | null | undefined
): boolean {
  if (!url) return false;

  return (
    url.includes("default-user-profile") ||
    url.includes("default-team-image") ||
    url.includes("default-project-image")
  );
}
