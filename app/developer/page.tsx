import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Credits | Zero Flint',
  description:
    'This portal was custom-engineered by Zero Flint — a studio that builds elite, high-performance digital ecosystems.',
};

/* ── Inline SVG icons ──────────────────────────────────────────────── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/* ── Ambient glow orb ───────────────────────────────────────────────── */
function GlowOrb({
  className,
  size = 300,
  color = 'emerald',
}: {
  className?: string;
  size?: number;
  color?: 'emerald' | 'gold';
}) {
  const gradient =
    color === 'gold'
      ? 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(15,62,51,0.6) 0%, transparent 70%)';
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${className ?? ''}`}
      style={{ width: size, height: size, background: gradient }}
      aria-hidden="true"
    />
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function DeveloperPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 20% 0%, #0F3E33 0%, #07201a 35%, #060f0d 60%, #020808 100%)',
      }}
    >
      {/* Ambient orbs */}
      <GlowOrb color="emerald" size={600} className="animate-float -top-24 -left-32 opacity-60" />
      <GlowOrb color="gold" size={400} className="animate-float-2 top-1/3 -right-28 opacity-50" />
      <GlowOrb color="emerald" size={350} className="animate-float-3 bottom-0 left-1/3 opacity-40" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24">

        {/* Hero badge */}
        <div className="animate-fade-in-up mb-8" style={{ animationDelay: '0ms' }}>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              background: 'rgba(212,175,55,0.08)',
              borderColor: 'rgba(212,175,55,0.30)',
              color: '#D4AF37',
              boxShadow: '0 0 20px rgba(212,175,55,0.12)',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" style={{ boxShadow: '0 0 6px currentColor' }} />
            Engineered with precision by
          </span>
        </div>

        {/* Company name */}
        <div className="animate-fade-in-up mb-4" style={{ animationDelay: '100ms' }}>
          <h1
            className="text-gold-shimmer text-center text-7xl font-black tracking-tight sm:text-8xl lg:text-9xl"
            style={{ letterSpacing: '-0.03em', lineHeight: 1 }}
          >
            Zero Flint
          </h1>
        </div>

        {/* Tagline */}
        <div className="animate-fade-in-up mb-14" style={{ animationDelay: '180ms' }}>
          <p
            className="text-center text-sm font-light uppercase tracking-[0.35em]"
            style={{ color: 'rgba(212,175,55,0.55)' }}
          >
            Digital Studio · Est. 2020
          </p>
        </div>

        {/* Glass card */}
        <div
          className="animate-fade-in-up w-full max-w-3xl rounded-3xl p-px"
          style={{
            animationDelay: '260ms',
            background:
              'linear-gradient(135deg, rgba(212,175,55,0.35) 0%, rgba(15,62,51,0.4) 50%, rgba(212,175,55,0.15) 100%)',
            boxShadow:
              '0 0 60px rgba(212,175,55,0.10), 0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.2)',
          }}
        >
          <div
            className="rounded-3xl p-8 sm:p-12"
            style={{
              background: 'linear-gradient(145deg, rgba(7,32,26,0.92) 0%, rgba(4,18,14,0.96) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >

            {/* Founders row */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:gap-6">
              {['Israr Ijaz', 'Asif Arshad'].map((name) => (
                <div
                  key={name}
                  className="group relative overflow-hidden rounded-2xl p-px transition-all duration-500 hover:-translate-y-0.5"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(15,62,51,0.3) 100%)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  <div
                    className="flex flex-col items-center gap-3 rounded-2xl px-6 py-8"
                    style={{ background: 'rgba(5,22,18,0.85)', backdropFilter: 'blur(12px)' }}
                  >
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-black"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(15,62,51,0.40) 100%)',
                        border: '1px solid rgba(212,175,55,0.35)',
                        color: '#D4AF37',
                        boxShadow: '0 0 20px rgba(212,175,55,0.15)',
                      }}
                    >
                      {name[0]}
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: '#F5F0E8' }}>{name}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.65)' }}>
                        Designer & Developer
                      </p>
                    </div>
                    {/* Hover shimmer */}
                    <div
                      className="pointer-events-none absolute inset-0 -translate-x-full rounded-2xl opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.06), transparent)' }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              className="mb-10 h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(212,175,55,0.25), rgba(15,62,51,0.4), rgba(212,175,55,0.25), transparent)',
              }}
            />

            {/* Mission */}
            <div className="mb-10 text-center">
              <p
                className="mx-auto max-w-xl text-base leading-relaxed sm:text-lg"
                style={{ color: 'rgba(220,215,205,0.78)', fontWeight: 300 }}
              >
                We build{' '}
                <span className="font-semibold" style={{ color: '#D4AF37' }}>
                  elite, high-performance digital ecosystems
                </span>
                . This portal was custom-engineered by Zero Flint to deliver a seamless, secure, and world-class experience for your academy.
              </p>
            </div>

            {/* Divider */}
            <div
              className="mb-10 h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(212,175,55,0.25), rgba(15,62,51,0.4), rgba(212,175,55,0.25), transparent)',
              }}
            />

            {/* Social & CTA */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-3">

                {/* WhatsApp */}
                <a
                  href="https://wa.me/923334861007"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact Zero Flint on WhatsApp"
                  id="social-whatsapp"
                  className="flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ borderColor: 'rgba(37,211,102,0.30)', color: 'rgba(37,211,102,0.85)', background: 'rgba(37,211,102,0.06)' }}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>

                {/* X */}
                <a
                  href="https://x.com/zeroflintco"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Zero Flint on X"
                  id="social-x"
                  className="flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(240,240,240,0.75)', background: 'rgba(255,255,255,0.04)' }}
                >
                  <XIcon className="h-4 w-4" />
                  X (Twitter)
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/zeroflintco"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Zero Flint on Instagram"
                  id="social-instagram"
                  className="flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ borderColor: 'rgba(225,48,108,0.30)', color: 'rgba(240,140,180,0.85)', background: 'rgba(225,48,108,0.06)' }}
                >
                  <InstagramIcon className="h-4 w-4" />
                  Instagram
                </a>
              </div>

              {/* Gold CTA */}
              <a
                href="https://wa.me/923334861007?text=Hi%20Zero%20Flint%2C%20I%27d%20like%20to%20start%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                id="cta-start-project"
                className="animate-pulse-glow group relative overflow-hidden rounded-full px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #b8962e 40%, #e8c84a 70%, #D4AF37 100%)',
                  backgroundSize: '200% auto',
                  color: '#07201a',
                  boxShadow: '0 0 30px rgba(212,175,55,0.40), 0 8px 32px rgba(0,0,0,0.40)',
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full rounded-full opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
                  aria-hidden="true"
                />
                <span className="relative">Start Your Project with Zero Flint →</span>
              </a>
            </div>

          </div>
        </div>

        {/* Copyright */}
        <p
          className="animate-fade-in-up mt-12 text-center text-xs"
          style={{ animationDelay: '400ms', color: 'rgba(212,175,55,0.30)' }}
        >
          © {new Date().getFullYear()} Zero Flint · All rights reserved
        </p>
      </div>
    </main>
  );
}
