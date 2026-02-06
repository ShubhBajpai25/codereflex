import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Daily Insight';
  const category = searchParams.get('category') || 'Software Engineering';
 
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a', // Obsidian background
          backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 20, color: '#fde68a', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '4px' }}>
          {category}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            padding: '0 40px',
            lineHeight: 1.1,
            textShadow: '0 0 40px rgba(253, 230, 138, 0.3)', // Gold glow
          }}
        >
          {title}
        </div>
        <div style={{ position: 'absolute', bottom: 40, width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, #fde68a, transparent)' }} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}