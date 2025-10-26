# Contact Section Documentation

## Overview
The Contact Us section is integrated into the home page of the Gym Manager Application. It provides visitors with an easy way to reach out to DigitalT3 for inquiries, support, or general information.

## Features

### 1. Company Details
- **Company Name:** DigitalT3
- **Tagline:** Empowering gyms with modern technology solutions
- **Contact Information:**
  - Email: contact@digitalt3.com
  - Phone: +1 (555) 123-4567
  - Address: 123 Tech Boulevard, San Francisco, CA 94102, United States
  - Business Hours: Monday - Friday: 9:00 AM - 6:00 PM (Closed weekends)

### 2. Contact Form
The contact form includes the following fields:
- **Name** (required)
- **Email** (required, validated for proper email format)
- **Message** (required)

### 3. Validation
Client-side validation is implemented with:
- **Required field validation**: All fields must be filled out
- **Email format validation**: Ensures proper email structure (e.g., user@domain.com)
- **Real-time feedback**: Errors are displayed on blur or on submit attempt
- **Focus management**: First error field receives focus when validation fails

### 4. Submit Handler
Currently, the form submission is simulated (placeholder for backend integration):
- Logs form data to console
- Simulates network delay (1.5 seconds)
- Shows success state (90% of the time for demo purposes)
- Shows error state (10% of the time for demo purposes)
- Auto-resets form 3 seconds after successful submission
- Auto-clears error state 5 seconds after error

**Backend Integration Note:**
To integrate with a real backend or email service:
1. Replace the `handleSubmit` simulation logic with an actual API call
2. Update the endpoint to your backend contact API (e.g., `/api/contact`)
3. Handle server-side validation and email delivery (e.g., using SendGrid, Nodemailer, etc.)
4. Update success/error states based on actual API response

### 5. Accessibility
The Contact section is fully accessible:
- **Semantic HTML**: Uses proper `<section>`, `<form>`, `<label>`, and `<address>` elements
- **ARIA attributes**: 
  - `aria-labelledby` for section heading
  - `aria-required="true"` for required fields
  - `aria-invalid` for fields with errors
  - `aria-describedby` to link error messages to inputs
  - `aria-live` regions for status messages (success/error)
- **Keyboard navigation**: All form fields and links are keyboard accessible
- **Focus management**: Error fields receive focus when validation fails
- **Screen reader support**: Clear labels, error messages, and status announcements

### 6. Responsive Design
The layout adapts to different screen sizes:
- **Desktop (> 768px)**: Two-column layout (company details | contact form)
- **Mobile (≤ 768px)**: Stacked single-column layout

### 7. Styling
The Contact section follows the Ocean Professional theme:
- Primary color: `#2563EB` (Blue)
- Secondary color: `#F59E0B` (Amber)
- Error color: `#EF4444` (Red)
- Success color: `#22c55e` (Green)
- Modern card design with rounded corners and subtle shadows
- Smooth transitions and hover effects

## Navigation
- A "Contact Us" link is added to the home page hero section, allowing users to scroll directly to the contact section via the `#contact` anchor
- Smooth scroll behavior is encouraged for better UX

## File Structure
```
gym_manager_frontend/
├── src/
│   ├── components/
│   │   └── home/
│   │       └── ContactSection.jsx       # Contact section component
│   ├── pages/
│   │   └── marketing/
│   │       └── Home.jsx                 # Home page with integrated Contact section
├── docs/
│   └── CONTACT.md                       # This documentation file
```

## Future Enhancements
- Backend API integration for actual email delivery
- CAPTCHA or anti-spam measures
- File attachment support (e.g., for support tickets)
- Integration with CRM or ticketing systems
- Multi-language support
- Additional contact methods (live chat, social media links)

## Maintenance
- Update company details in `ContactSection.jsx` as needed
- Monitor form submission rates and adjust validation/UX based on user feedback
- Implement backend integration when ready for production deployment

---

**Last Updated:** 2024
**Component Location:** `src/components/home/ContactSection.jsx`
**Integration Point:** `src/pages/marketing/Home.jsx`
