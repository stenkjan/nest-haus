import type { MetadataRoute } from 'next'
import { generateSitemapData } from '@/lib/seo/generateMetadata'

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemapData()
} 