import { ImageResponse } from 'next/og'

// For static export
export const dynamic = 'force-static'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: 'rgb(99, 159, 169)', // Main teal color
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
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'white',
          opacity: 0.4,
          transform: 'translateY(-20px)',
        }} />
        
        {/* Bottom left circle */}
        <div style={{
          position: 'absolute',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'white',
          opacity: 0.4,
          transform: 'translate(-20px, 20px)',
        }} />
        
        {/* Bottom right circle */}
        <div style={{
          position: 'absolute',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'white',
          opacity: 0.4,
          transform: 'translate(20px, 20px)',
        }} />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
} 