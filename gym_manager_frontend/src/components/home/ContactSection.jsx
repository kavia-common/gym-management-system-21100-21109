import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

/**
 * PUBLIC_INTERFACE
 * ContactSection - Contact Us section for the home page.
 * Features:
 * - Company details for DigitalT3
 * - Contact form with name, email, and message fields
 * - Client-side validation (required fields, email format)
 * - Submit handler with success and error states (placeholder for backend integration)
 * - Full accessibility with labels, ARIA attributes, and focus management
 * - Responsive layout adapting to all screen sizes
 * - Ocean Professional theme styling
 */
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | success | error

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Validate a single field
   */
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Name is required' : '';
      case 'email':
        if (value.trim() === '') return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'message':
        return value.trim() === '' ? 'Message is required' : '';
      default:
        return '';
    }
  };

  /**
   * Validate all fields
   */
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  /**
   * Handle input change with real-time validation
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it becomes valid
    if (errors[name]) {
      const error = validateField(name, value);
      if (!error) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    }
  };

  /**
   * Handle blur event for field validation
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  /**
   * Handle form submission
   * Currently simulates sending (placeholder for backend/email integration)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus on first error field
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    // Simulate submission
    setSubmitState('submitting');
    console.log('Contact form submitted:', formData);

    // Simulate network delay
    setTimeout(() => {
      // Simulate success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setSubmitState('success');
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({ name: '', email: '', message: '' });
          setSubmitState('idle');
          setErrors({});
        }, 3000);
      } else {
        setSubmitState('error');
        // Reset error state after 5 seconds
        setTimeout(() => {
          setSubmitState('idle');
        }, 5000);
      }
    }, 1500);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        padding: '4rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(37,99,235,0.03), rgba(249,250,251,1))',
      }}
    >
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2
            id="contact-heading"
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: 'var(--color-text, #111827)',
            }}
          >
            Contact Us
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-muted, #6B7280)',
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Content Grid */}
        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Company Details */}
          <Card
            style={{
              borderRadius: 16,
              backgroundColor: 'var(--color-surface, #ffffff)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              padding: '2rem',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: 'var(--color-primary, #2563EB)',
                }}
              >
                DigitalT3
              </h3>
              <p style={{ color: 'var(--color-text-muted, #6B7280)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Empowering gyms with modern technology solutions for seamless operations and exceptional member experiences.
              </p>
            </div>

            {/* Contact Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>📧</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text, #111827)' }}>
                    Email
                  </div>
                  <a
                    href="mailto:contact@digitalt3.com"
                    style={{
                      color: 'var(--color-primary, #2563EB)',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    contact@digitalt3.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>📞</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text, #111827)' }}>
                    Phone
                  </div>
                  <a
                    href="tel:+15551234567"
                    style={{
                      color: 'var(--color-primary, #2563EB)',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>📍</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text, #111827)' }}>
                    Address
                  </div>
                  <address style={{ fontStyle: 'normal', color: 'var(--color-text-muted, #6B7280)', lineHeight: 1.5 }}>
                    123 Tech Boulevard<br />
                    San Francisco, CA 94102<br />
                    United States
                  </address>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>⏰</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text, #111827)' }}>
                    Business Hours
                  </div>
                  <div style={{ color: 'var(--color-text-muted, #6B7280)', lineHeight: 1.5 }}>
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday - Sunday: Closed
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Form */}
          <Card
            style={{
              borderRadius: 16,
              backgroundColor: 'var(--color-surface, #ffffff)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              padding: '2rem',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                color: 'var(--color-text, #111827)',
              }}
            >
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} noValidate>
              {/* Name Field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--color-text, #111827)',
                  }}
                >
                  Name <span style={{ color: 'var(--color-error, #EF4444)' }} aria-label="required">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}

                  placeholder="Your full name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  disabled={submitState === 'submitting'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: `1px solid ${errors.name ? 'var(--color-error, #EF4444)' : 'var(--color-border, #E5E7EB)'}`,
                    backgroundColor: 'var(--color-surface, #ffffff)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                />
                {errors.name && (
                  <div
                    id="name-error"
                    role="alert"
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: 'var(--color-error, #EF4444)',
                    }}
                  >
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--color-text, #111827)',
                  }}
                >
                  Email <span style={{ color: 'var(--color-error, #EF4444)' }} aria-label="required">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}

                  placeholder="your.email@example.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={submitState === 'submitting'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: `1px solid ${errors.email ? 'var(--color-error, #EF4444)' : 'var(--color-border, #E5E7EB)'}`,
                    backgroundColor: 'var(--color-surface, #ffffff)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                />
                {errors.email && (
                  <div
                    id="email-error"
                    role="alert"
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: 'var(--color-error, #EF4444)',
                    }}
                  >
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Message Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="message"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--color-text, #111827)',
                  }}
                >
                  Message <span style={{ color: 'var(--color-error, #EF4444)' }} aria-label="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}

                  placeholder="Tell us how we can help you..."
                  rows="5"
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  disabled={submitState === 'submitting'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: `1px solid ${errors.message ? 'var(--color-error, #EF4444)' : 'var(--color-border, #E5E7EB)'}`,
                    backgroundColor: 'var(--color-surface, #ffffff)',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                />
                {errors.message && (
                  <div
                    id="message-error"
                    role="alert"
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: 'var(--color-error, #EF4444)',
                    }}
                  >
                    {errors.message}
                  </div>
                )}
              </div>

              {/* Success Message */}
              {submitState === 'success' && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 8,
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>✓</span>
                  <span style={{ fontWeight: 600 }}>Message sent successfully! We'll get back to you soon.</span>
                </div>
              )}

              {/* Error Message */}
              {submitState === 'error' && (
                <div
                  role="alert"
                  aria-live="assertive"
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 8,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'var(--color-error, #EF4444)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>⚠</span>
                  <span style={{ fontWeight: 600 }}>Failed to send message. Please try again.</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitState === 'submitting' || submitState === 'success'}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: submitState === 'submitting' ? '#94a3b8' : 'var(--color-primary, #2563EB)',
                  color: '#ffffff',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: submitState === 'submitting' || submitState === 'success' ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                  opacity: submitState === 'submitting' || submitState === 'success' ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (submitState === 'idle') {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(37, 99, 235, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (submitState === 'idle') {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary, #2563EB)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.3)';
                  }
                }}
              >
                {submitState === 'submitting' ? 'Sending...' : submitState === 'success' ? 'Sent!' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Responsive Styles */}
        <style>
          {`
            @media (max-width: 768px) {
              .contact-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
      </div>
    </section>
  );
};

export default ContactSection;
