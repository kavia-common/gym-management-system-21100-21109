import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ContactSection from '../../components/home/ContactSection';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Home - Marketing landing page for the Gym Manager Application.
 * Provides an overview of features and a clear CTA for users to try the app.
 */
const Home = () => {
  // Accessible labels and semantic structure
  return (
    <div className="home-page" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Gradient hero section */}
      <header
        className="hero-section"
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(249,250,251,1))',
          padding: '4rem 1.5rem',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(37,99,235,0.1)',
                color: 'var(--primary)',
                padding: '0.35rem 0.75rem',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.5,
                marginBottom: 12,
              }}
            >
              Ocean Professional
            </span>
            <h1
              style={{
                fontSize: '2.25rem',
                lineHeight: 1.2,
                fontWeight: 800,
                margin: '0 0 0.75rem',
              }}
            >
              Streamline Your Gym Operations
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--muted-text, #4b5563)',
                margin: '0 auto 1.5rem',
                maxWidth: 720,
              }}
            >
              A modern platform for owners, trainers, and members to manage memberships, bookings,
              classes, programs, and analytics—unified in one powerful system.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" aria-label="Try the Application and go to login">
                <Button
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    borderRadius: 10,
                    padding: '0.75rem 1.25rem',
                    boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(37,99,235,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.25)';
                  }}
                >
                  Try the Application
                </Button>
              </Link>
              <a
                href="#features"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
                aria-label="Learn more about features"
              >
                Learn more
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="#contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
                aria-label="Go to Contact section"
              >
                Contact Us
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div
              className="hero-highlights"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                gap: 12,
                marginTop: 24,
                maxWidth: 720,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {[
                { k: '5k+', v: 'Active Members Managed' },
                { k: '99.9%', v: 'Uptime and Reliability' },
                { k: '3x', v: 'Faster Onboarding' },
              ].map((item) => (
                <div
                  key={item.v}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: 12,
                    padding: '0.75rem 1rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{item.k}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{item.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" aria-labelledby="features-heading" style={{ padding: '3rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 id="features-heading" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 16 }}>
            Everything you need to manage your gym
          </h2>
          <p style={{ color: '#4b5563', marginBottom: 24 }}>
            Built for owners, optimized for trainers, and delightful for members.
          </p>

          <div
            className="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
              gap: 16,
            }}
          >
            {[
              {
                title: 'Memberships & Billing',
                desc: 'Automate payments, renewals, and invoices with transparent reporting.',
                icon: '💳',
              },
              {
                title: 'Classes & Bookings',
                desc: 'Real-time class schedules and seamless booking management.',
                icon: '📅',
              },
              {
                title: 'Programs & Progress',
                desc: 'Personalized plans for clients with progress tracking.',
                icon: '📈',
              },
              {
                title: 'Trainer Portal',
                desc: 'Manage clients, programs, and timetables from a dedicated workspace.',
                icon: '🏋️',
              },
              {
                title: 'Member Portal',
                desc: 'Self-serve bookings, payments, and profile management.',
                icon: '🧑‍💻',
              },
              {
                title: 'Analytics',
                desc: 'Actionable insights for retention, revenue, and utilization.',
                icon: '📊',
              },
            ].map((f) => (
              <Card
                key={f.title}
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  backgroundColor: 'var(--surface)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ padding: '1rem' }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))',
                      marginBottom: 8,
                      fontSize: 20,
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ color: '#4b5563', fontSize: 14 }}>{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Metrics */}
      <section aria-labelledby="social-proof" style={{ padding: '2.5rem 1.5rem', backgroundColor: '#f3f4f6' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 id="social-proof" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>
            Trusted by growing gyms
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
              gap: 16,
            }}
          >
            {[
              {
                quote:
                  'Our onboarding time dropped dramatically. Trainers and members love the simplicity.',
                name: 'Alex P.',
                role: 'Gym Owner',
              },
              {
                quote: 'Clear analytics helped us improve retention and class utilization.',
                name: 'Samantha R.',
                role: 'Operations Manager',
              },
              {
                quote: 'The trainer portal is a game changer for managing clients and programs.',
                name: 'Daniel M.',
                role: 'Head Trainer',
              },
            ].map((t) => (
              <Card
                key={t.name}
                style={{
                  borderRadius: 14,
                  backgroundColor: 'white',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ padding: '1rem' }}>
                  <p style={{ fontStyle: 'italic', color: '#374151' }}>"{t.quote}"</p>
                  <div style={{ marginTop: 8, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Fixed Corner CTA */}
      <Link
        to="/login"
        aria-label="Try the Application - fixed call to action in bottom right corner"
        className="corner-cta"
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 50,
          textDecoration: 'none',
        }}
      >
        <Button
          style={{
            backgroundColor: 'var(--secondary)',
            color: '#111827',
            borderRadius: 9999,
            padding: '0.85rem 1.25rem',
            fontWeight: 800,
            boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
            transition: 'transform 150ms ease, box-shadow 150ms ease, filter 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.2)';
            e.currentTarget.style.filter = 'brightness(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.18)';
            e.currentTarget.style.filter = 'none';
          }}
        >
          Try the Application
        </Button>
      </Link>

      {/* Responsive Adjustments */}
      <style>
        {`
          :root {
            --primary: #2563EB;
            --secondary: #F59E0B;
            --bg: #f9fafb;
            --surface: #ffffff;
            --text: #111827;
          }

          @media (max-width: 1024px) {
            .features-grid,
            .hero-highlights {
              grid-template-columns: repeat(2, minmax(0,1fr)) !important;
            }
          }

          @media (max-width: 640px) {
            .features-grid,
            .hero-highlights {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
