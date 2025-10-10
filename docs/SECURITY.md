# Security Documentation

## Overview

This document outlines the security measures implemented in Protégé Lecture+ to protect user data, prevent attacks, and ensure application integrity.

## Security Layers

### 1. Input Validation & Sanitization

#### Form Validation with Zod

All user inputs are validated using Zod schemas before processing:

```javascript
// Example: Email validation
export const emailSchema = z.string()
  .email('Invalid email')
  .transform(val => sanitizeInput(val).toLowerCase().trim())
  .refine(val => val.length <= 254, 'Email too long');
```

**Validation Rules**:
- Email: RFC 5322 compliant, max 254 characters
- Phone: Cameroon format (+237XXXXXXXXX)
- Password: Min 8 chars, must include uppercase, lowercase, number, special char
- Names: Alphabetic only, 2-100 characters
- URLs: HTTP/HTTPS only, validated domain

#### HTML Sanitization

All user-generated content is sanitized using DOMPurify:

```javascript
import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirty, config = {}) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
  });
};
```

### 2. XSS (Cross-Site Scripting) Protection

#### Content Security Policy (CSP)

Implemented via Netlify headers:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://*.firebase.googleapis.com;
  frame-src 'self' https://www.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

#### React's Built-in Protection

- Automatic escaping of values in JSX
- `dangerouslySetInnerHTML` avoided
- User content rendered as text, not HTML

### 3. CSRF (Cross-Site Request Forgery) Protection

#### Token-Based Protection

```javascript
// Generate CSRF token
export const generateCSRFToken = () => {
  const token = generateSecureToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
};

// Validate CSRF token
export const validateCSRFToken = (token) => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return token === storedToken;
};
```

#### SameSite Cookies

All cookies set with `SameSite=Strict` or `SameSite=Lax`.

### 4. SQL Injection Prevention

#### Parameterized Queries

All SQL queries use parameterized statements:

```javascript
// ✅ Safe
db.exec("SELECT * FROM books WHERE id = ?", [bookId]);

// ❌ Unsafe (never do this)
db.exec(`SELECT * FROM books WHERE id = ${bookId}`);
```

#### Input Sanitization for Search

```javascript
export const sanitizeSearchQuery = (query) => {
  return sanitizeInput(query)
    .replace(/['";\\]/g, '')  // Remove SQL chars
    .replace(/--/g, '')        // Remove comments
    .trim()
    .substring(0, 200);        // Limit length
};
```

### 5. Authentication & Authorization

#### Firebase Authentication

- Secure token-based authentication
- Google OAuth 2.0 integration
- Session management with automatic refresh
- Secure token storage in httpOnly cookies (when possible)

#### Role-Based Access Control (RBAC)

```javascript
// Route protection
<PrivateRoute requiredRole="admin">
  <AdminDashboard />
</PrivateRoute>

// Component-level protection
{user && user.role === 'admin' && <AdminPanel />}
```

### 6. Rate Limiting

Client-side rate limiting for sensitive operations:

```javascript
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
  // Track attempts in localStorage
  // Block if exceeded
  // Auto-unblock after time window
};
```

**Protected Operations**:
- Login attempts: 5 per minute
- Password reset: 3 per hour
- Contact form: 5 per hour
- Newsletter signup: 1 per day

### 7. Secure Headers

Implemented via Netlify configuration:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
```

**Header Explanations**:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection` - Browser XSS filter
- `Referrer-Policy` - Controls referrer information
- `HSTS` - Forces HTTPS connections

### 8. File Upload Security

```javascript
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024,  // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
    allowedExtensions = ['.jpg', '.png', '.pdf'],
  } = options;

  // Validate size
  if (file.size > maxSize) return { valid: false, error: 'File too large' };

  // Validate MIME type
  if (!allowedTypes.includes(file.type)) return { valid: false, error: 'Invalid type' };

  // Validate extension
  const ext = `.${file.name.split('.').pop().toLowerCase()}`;
  if (!allowedExtensions.includes(ext)) return { valid: false, error: 'Invalid extension' };

  return { valid: true };
};
```

### 9. Sensitive Data Protection

#### Data Masking

```javascript
// Display only last 4 digits
export const maskSensitiveData = (data, visibleChars = 4) => {
  if (!data || data.length <= visibleChars) return data;
  const masked = '*'.repeat(data.length - visibleChars);
  return masked + data.slice(-visibleChars);
};
```

#### Secure Storage

- Never store sensitive data in localStorage
- Use sessionStorage for temporary data
- Encrypt sensitive data before storage
- Clear storage on logout

### 10. Dependency Security

#### Automated Scanning

GitHub Actions workflow for security scanning:

```yaml
- name: Run npm audit
  run: npm audit --audit-level=moderate

- name: Dependency Review
  uses: actions/dependency-review-action@v4
  with:
    fail-on-severity: moderate
```

#### CodeQL Analysis

Automated code scanning for vulnerabilities:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: javascript
    queries: security-extended,security-and-quality
```

### 11. Error Handling

#### Secure Error Messages

```javascript
// ❌ Never expose internal details
throw new Error(`Database error: ${sqlError.message}`);

// ✅ Generic user-facing messages
throw new Error('An error occurred. Please try again.');

// Log details server-side or to monitoring
console.error('Internal error:', sqlError);
```

#### Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    trackError(error.toString(), true);
    // Don't expose stack traces to users
  }
}
```

## Security Checklist

### Development
- [ ] All inputs validated with Zod schemas
- [ ] User content sanitized with DOMPurify
- [ ] SQL queries parameterized
- [ ] CSRF tokens implemented
- [ ] Rate limiting on sensitive operations
- [ ] Secure error handling (no stack traces exposed)

### Deployment
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CSP policy implemented
- [ ] Environment variables secured
- [ ] Firebase security rules configured
- [ ] Dependency audit passed

### Monitoring
- [ ] Error tracking configured (Firebase Crashlytics)
- [ ] Security alerts enabled (GitHub Dependabot)
- [ ] Log monitoring active
- [ ] Penetration testing scheduled

## Incident Response

### In Case of Security Breach

1. **Immediate Actions**
   - Disable affected features
   - Rotate API keys and tokens
   - Notify users if data compromised

2. **Investigation**
   - Review logs for unauthorized access
   - Identify vulnerability
   - Assess impact

3. **Remediation**
   - Patch vulnerability
   - Deploy fix
   - Re-enable features

4. **Post-Incident**
   - Document incident
   - Update security procedures
   - Conduct team review

## Security Best Practices for Developers

1. **Never commit secrets**
   - Use `.env` files (gitignored)
   - Use GitHub Secrets for CI/CD
   - Rotate credentials regularly

2. **Validate everything**
   - Don't trust client input
   - Validate on both client and server
   - Sanitize before display

3. **Use HTTPS everywhere**
   - No mixed content
   - Enforce with HSTS
   - Update links to HTTPS

4. **Keep dependencies updated**
   - Run `npm audit` regularly
   - Update vulnerable packages
   - Review dependency changes

5. **Principle of least privilege**
   - Grant minimum required permissions
   - Separate admin and user roles
   - Regular permission audits

## Security Testing

### Manual Testing
- Test XSS payloads in forms
- Test SQL injection attempts
- Test CSRF attacks
- Test file upload restrictions

### Automated Testing
- OWASP ZAP scanning
- Lighthouse security audit
- npm audit
- CodeQL analysis

## Compliance

### GDPR Considerations
- User data minimization
- Right to erasure implemented
- Data export functionality
- Privacy policy published

### Cameroon Data Protection
- Compliance with local regulations
- Data stored/processed transparently
- User consent for data collection

## Contact

For security concerns, contact:
- Email: yvangodimomo@gmail.com
- Create a private security advisory on GitHub

**Do not disclose security vulnerabilities publicly.**
