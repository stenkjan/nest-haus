/**
 * @deprecated This file is deprecated. Please use `@/constants/cardContent` instead.
 * This file is maintained for backwards compatibility only.
 * 
 * Migration guide:
 * - Replace `import { MATERIAL_CARDS } from '@/constants/materials'`
 * - With `import { MATERIALIEN_CONTENT } from '@/constants/cardContent'`
 */

import { MATERIALIEN_CONTENT } from "./cardContent";
import type { ContentCardData as _ContentCardData } from "./cardContent";

/**
 * @deprecated Use ContentCardData from '@/constants/cardContent' instead
 */
export interface MaterialCardData {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    mobileTitle: string;
    mobileSubtitle: string;
    mobileDescription: string;
    image: string;
    backgroundColor: string;
}

/**
 * @deprecated Use MATERIALIEN_CONTENT from '@/constants/cardContent' instead
 */
export const MATERIAL_CARDS: MaterialCardData[] =
    MATERIALIEN_CONTENT as MaterialCardData[]; 