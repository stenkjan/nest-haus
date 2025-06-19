'use client';

import Image from 'next/image';
import { ComponentProps } from 'react';

type ImageProps = ComponentProps<typeof Image>;

interface EnhancedClientImageProps extends Omit<ImageProps, 'src'> {
    src: string;
}

export function EnhancedClientImage({ src, alt, ...props }: EnhancedClientImageProps) {
    return (
        <Image
            src={src}
            alt={alt}
            quality={90}
            priority={true}
            {...props}
        />
    );
} 