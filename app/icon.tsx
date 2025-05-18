import { ImageResponse } from 'next/og'

// For static export
export const dynamic = 'force-static'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top circle */}
        <div style={{
          position: 'absolute',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'rgba(99, 159, 169, 0.6)',
          transform: 'translateY(-4px)',
          mixBlendMode: 'plus-lighter',
        }} />
        
        {/* Bottom left circle */}
        <div style={{
          position: 'absolute',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'rgba(99, 159, 169, 0.6)',
          transform: 'translate(-4px, 4px)',
          mixBlendMode: 'plus-lighter',
        }} />
        
        {/* Bottom right circle */}
        <div style={{
          position: 'absolute',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'rgba(99, 159, 169, 0.6)',
          transform: 'translate(4px, 4px)',
          mixBlendMode: 'plus-lighter',
        }} />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
} 