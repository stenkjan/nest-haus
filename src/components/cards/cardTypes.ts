// Shared types for both ContentCards and ContentCardsGlass components

export interface BaseCardData {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    mobileTitle?: string;
    mobileSubtitle?: string;
    mobileDescription?: string;
    image: string;
    backgroundColor: string;
}

export interface StaticCardData extends BaseCardData {
    buttons?: Array<{
        text: string;
        variant: "primary" | "secondary";
        size: "xs" | "sm" | "md" | "lg";
        link?: string;
        onClick?: () => void;
    }>;
}

export interface PricingCardData extends BaseCardData {
    price: string;
    monthlyPrice?: string;
    extendedDescription?: string;
    mobileExtendedDescription?: string;
    grayWord?: string; // Word to make gray in the title
}

export type CardVariant = "responsive" | "static" | "pricing";

export interface BaseCardProps {
    variant?: CardVariant;
    title?: string;
    subtitle?: string;
    maxWidth?: boolean;
    showInstructions?: boolean;
    isLightboxMode?: boolean;
    onCardClick?: (cardId: number) => void;
    customData?: BaseCardData[] | StaticCardData[] | PricingCardData[];
}

// Helper function to check if card has buttons
export const hasButtons = (card: BaseCardData): card is StaticCardData => {
    return 'buttons' in card && Array.isArray((card as StaticCardData).buttons);
};

// Helper function to check if card is pricing card
export const isPricingCard = (card: BaseCardData): card is PricingCardData => {
    return 'price' in card;
};
