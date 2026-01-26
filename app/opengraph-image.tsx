import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'StudioTek - Automatizacion e IA para PYMEs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          position: 'relative',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow effects */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '40px',
          }}
        >
          {/* Logo text */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}
          >
            StudioTek
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: '#e2e8f0',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Automatizacion con IA para PYMEs
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Reduce costes operativos y atiende clientes 24/7
          </div>

          {/* CTA badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 40,
              padding: '12px 32px',
              background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 600,
              color: 'white',
            }}
          >
            studiotek.es
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
