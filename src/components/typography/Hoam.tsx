import React from 'react';

interface HoamProps {
    className?: string;
    variant?: 'title' | 'button' | 'subtitle'; // title = thick H, button/subtitle = normal H
}

/**
 * Hoam - Special typography component for ®Hoam branding
 * Renders with ® at same height and H at x-height
 * variant="title" makes H thick/bold
 * variant="button" or "subtitle" keeps it normal weight with adjusted positioning
 */
export default function Hoam({ className = '', variant = 'title' }: HoamProps) {
  // Adjust ® positioning, H size, and weight based on variant
  let topPosition = '0.5em'; // default for title
  let hFontSize = '0.72em'; // default
  let hFontWeight = 'inherit'; // default
  let hTextStroke = 'none'; // default
  let addLeadingSpace = false;
  
  if (variant === 'button') {
    topPosition = '0.55em';
  } else if (variant === 'subtitle') {
    topPosition = '0.65em'; // Lower for subtitle
    hFontSize = '0.76em'; // Slightly taller H for subtitle
    hFontWeight = '700'; // Medium bold (between normal and extra-thick)
    addLeadingSpace = true;
  } else if (variant === 'title') {
    hFontWeight = '900'; // Extra thick
    hTextStroke = '0.3px currentColor'; // Add stroke for maximum thickness
    addLeadingSpace = true;
  }
  
  return (
    <span className={className} style={{ position: 'relative', display: 'inline-block', marginLeft: variant === 'subtitle' ? '0.3em' : '0' }}>
      {addLeadingSpace && ' '}
      <span style={{ 
        fontSize: '0.5em', 
        position: 'absolute',
        top: topPosition,
        left: '-0.6em',
        verticalAlign: 'baseline'
      }}>®</span>
      <span style={{ 
        fontSize: hFontSize, 
        fontWeight: hFontWeight,
        WebkitTextStroke: hTextStroke
      }}>H</span>
      oam
    </span>
  );
}

