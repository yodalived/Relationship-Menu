import { ImageResponse } from 'next/og';

// For static export
export const dynamic = 'force-static';
export const alt = 'Relationship Menu - Reflect on and Define Your Relationships Through Dialogue';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// This route generates the OpenGraph image for the homepage
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'rgba(99, 159, 169, 1)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '50px 15px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            gap: '30px',
          }}
        >
          {/* Main title - larger and more prominent */}
          <h1
            style={{
              fontSize: '90px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              margin: '0',
              textShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            Relationship Menu
          </h1>
          
          {/* Three-tile layout with larger tiles */}
          <div
            style={{
              width: '95%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '15px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            }}
          >
            {/* Three key principles with emoji icons */}
            {[
              { 
                icon: "👥",
                title: 'Co-creation' 
              },
              { 
                icon: "🔄",
                title: 'Flexibility' 
              },
              { 
                icon: "🕒",
                title: 'Check-ins' 
              },
            ].map((principle) => (
              <div
                key={principle.title}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  padding: '25px 15px',
                  width: '32%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  gap: '18px',
                }}
              >
                <div
                  style={{
                    fontSize: '65px',
                    lineHeight: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {principle.icon}
                </div>
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: '600',
                    color: 'rgba(99, 159, 169, 1)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    lineHeight: '1.2',
                  }}
                >
                  {principle.title}
                </div>
              </div>
            ))}
          </div>
          
          {/* Tags */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              width: '100%',
              marginBottom: '20px',
              paddingTop: '15px',
            }}
          >
            {['Communication', 'Needs and Wants', 'Boundaries'].map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'rgba(99, 159, 169, 1)',
                  padding: '12px 25px',
                  borderRadius: '30px',
                  fontSize: '35px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
} 