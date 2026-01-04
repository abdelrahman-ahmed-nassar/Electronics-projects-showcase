## Plan: Migrate Supabase Storage to Cloudinary

Replace Supabase storage buckets with Cloudinary for all image uploads (profile avatars, team logos, project images), leveraging Cloudinary's automatic optimization, transformations, and CDN delivery via the `next-cloudinary` SDK.

### Steps

1. **Install and configure Cloudinary SDK** - Run `pnpm i next-cloudinary`, add Cloudinary config to `next.config.ts` images.remotePatterns for `res.cloudinary.com`, and parse `CLOUDINARY_URL` to extract cloud name/credentials for server-side uploads

2. **Refactor upload API routes** - Replace Supabase storage operations in `app/api/upload-image/route.ts`, `app/api/upload-profile-image/route.ts`, and `app/api/upload-team-image/route.ts` with Cloudinary upload via SDK, using folder organization (`projects/`, `profiles/`, `teams/`) and returning Cloudinary public IDs

3. **Update database schema and services** - Modify `utils/supabase/data-services.ts` to store Cloudinary public IDs instead of full URLs, update default fallback logic to use Cloudinary URLs, and ensure backward compatibility during migration

4. **Migrate existing images from Supabase to Cloudinary** - Create migration script to:

   - Fetch all records with Supabase image URLs from `profiles`, `teams`, and `projects` tables
   - Download each image from Supabase storage
   - Upload to Cloudinary with appropriate folder structure (`projects/`, `profiles/`, `teams/`)
   - Update database records with new Cloudinary public IDs
   - Track migration progress and handle errors gracefully
   - Upload default images to Cloudinary and update fallback logic

5. **Replace image display components** - Switch from `<Image>` to `<CldImage>` in `app/_components/UI/ProjectCard.tsx`, `app/_components/UI/TeamCard.tsx`, profile pages (`app/profile/page.tsx`, `app/profile/settings/page.tsx`), project/team detail pages, and update default image handling

6. **Clean up and update configuration** - Remove Supabase storage remote patterns from `next.config.ts`, replace hardcoded Supabase fallback URLs across codebase with Cloudinary equivalents

### Further Considerations

1. **Image transformations to implement?** - Should we add responsive sizes, format auto-selection (WebP/AVIF), quality optimization, or aspect ratio cropping via `<CldImage>` props?

2. **Old image deletion?** - Implement logic to delete previous Cloudinary images when users upload new ones (track by public ID in database)?

3. **Rollback strategy?** - Keep migration script reversible in case issues arise during production migration
