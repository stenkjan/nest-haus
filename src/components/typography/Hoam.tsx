import React from 'react';

interface HoamProps {
    className?: string;
    variant?: 'title' | 'button'; // title = thick H, button = normal H
}

/**
 * Hoam - Special typography component for ®Hoam branding
 * Renders with ® at same height and H at x-height
 * variant="title" makes H thick/bold, variant="button" keeps it normal weight
 */
export default function Hoam({ className = '', variant = 'title' }: HoamProps) {
    const isThick = variant === 'title';

    return (
        <span className={className} style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{
                fontSize: '0.5em',
                position: 'absolute',
                top: isThick ? '0.5em' : '0.55em',
                left: '-0.6em',
                verticalAlign: 'baseline'
            }}>®</span>
            <span style={{
                fontSize: '0.72em',
                fontWeight: isThick ? '900' : 'inherit',
                WebkitTextStroke: isThick ? '0.3px currentColor' : 'none'
            }}>H</span>
            oam
        </span>
    );
}

