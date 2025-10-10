# Deployment Guide

## Overview

This guide covers deploying Protégé Lecture+ to production using Netlify with GitHub Actions for CI/CD.

## Prerequisites

- GitHub account
- Netlify account (free tier works)
- Firebase project configured
- Node.js 22.12+ installed locally

---

## Initial Setup

### 1. Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or use existing: `protegeqv-2532f`
   - Enable required services:
     - Authentication (Email, Google)
     - Analytics
     - Performance Monitoring
     - Cloud Messaging
     - Remote Config

2. **Get Firebase Credentials**
   - Project Settings → General → Your apps
   - Copy configuration values

3. **Configure Firebase Security Rules**
   ```javascript
   // Firestore rules (if using Firestore in future)
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

### 2. GitHub Repository Setup

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/protege-lecture-plus.git
   git push -u origin main
   ```

2. **Add GitHub Secrets**
   
   Go to: Repository → Settings → Secrets and variables → Actions → New repository secret
   
   Add the following secrets:
   
   ```
   VITE_FIREBASE_API_KEY=AIzaSyAKaCsfH8HnRxhBA1D9XZwqFtc4RzS2_-Q
   VITE_FIREBASE_AUTH_DOMAIN=protegeqv-2532f.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=protegeqv-2532f
   VITE_FIREBASE_STORAGE_BUCKET=protegeqv-2532f.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=553100729963
   VITE_FIREBASE_APP_ID=1:553100729963:web:1f4fba71360fe864be1b2e
   VITE_FIREBASE_MEASUREMENT_ID=G-N3NB5PWT1M
   NETLIFY_AUTH_TOKEN=your-netlify-auth-token
   NETLIFY_SITE_ID=your-netlify-site-id
   ```

---

## Netlify Deployment

### Option 1: Automatic Deployment (Recommended)

1. **Connect to Netlify**
   - Log in to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Branch to deploy: `main`

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `22.12.0` (in `netlify.toml`)

3. **Add Environment Variables**
   
   Site settings → Environment variables → Add variables:
   
   ```
   VITE_FIREBASE_API_KEY=AIzaSyAKaCsfH8HnRxhBA1D9XZwqFtc4RzS2_-Q
   VITE_FIREBASE_AUTH_DOMAIN=protegeqv-2532f.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=protegeqv-2532f
   VITE_FIREBASE_STORAGE_BUCKET=protegeqv-2532f.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=553100729963
   VITE_FIREBASE_APP_ID=1:553100729963:web:1f4fba71360fe864be1b2e
   VITE_FIREBASE_MEASUREMENT_ID=G-N3NB5PWT1M
   VITE_FCM_VAPID_KEY=BKcs9NVbQrWwTPnhTCLYX4h8udtR23404Ci58TCcaMsrbpNoQnDosl5DM7_4SPnd-r5zJZVGndRSJeqmnVWocfg
   VITE_SITE_URL=https://your-site.netlify.app
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_PWA=true
   NODE_VERSION=22.12.0
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (~2-3 minutes)
   - Site will be live at `https://random-name.netlify.app`

### Option 2: Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build project
npm run build

# Deploy
netlify deploy --prod
```

---

## Custom Domain Setup

### 1. Add Custom Domain in Netlify

1. Site settings → Domain management → Add custom domain
2. Enter your domain: `protegelecture.org`
3. Verify ownership

### 2. Configure DNS

Add these records at your domain provider:

```
Type    Name    Value
A       @       75.2.60.5
CNAME   www     random-name.netlify.app
```

Or use Netlify DNS (recommended):
- Transfer DNS to Netlify
- Automatic SSL/TLS certificates

### 3. Enable HTTPS

- Automatic with Netlify
- Enforces HTTPS redirects
- Free Let's Encrypt certificates

---

## CI/CD Pipeline

The GitHub Actions workflows are already configured:

### Workflow 1: CI (Build & Test)
**File**: `.github/workflows/ci.yml`

**Triggers**:
- Push to `main` or `develop`
- Pull requests

**Steps**:
1. Checkout code
2. Setup Node.js 22.x
3. Install dependencies
4. Run linter
5. Build project
6. Run security scan
7. Run Lighthouse tests

### Workflow 2: Deploy
**File**: `.github/workflows/deploy.yml`

**Triggers**:
- Push to `main`
- Manual trigger

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build project
5. Deploy to Netlify

### Workflow 3: Security Scan
**File**: `.github/workflows/codeql.yml`

**Triggers**:
- Push to `main`
- Weekly schedule

**Steps**:
1. Run CodeQL analysis
2. Check for security vulnerabilities

---

## Post-Deployment Configuration

### 1. Verify Deployment

**Checklist**:
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Firebase authentication works
- [ ] Books catalog displays
- [ ] Reservation form submits
- [ ] Admin login works
- [ ] Analytics tracking
- [ ] PWA installable
- [ ] Service worker active

### 2. Test Features

```bash
# Run in browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs.length);
});
```

### 3. Configure Firebase Hosting (Optional)

If also deploying to Firebase Hosting:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### 4. Setup Monitoring

**Firebase Console**:
- Analytics → Enable data collection
- Performance → Verify traces
- Crashlytics → Enable error reporting

**Netlify**:
- Analytics → Enable (paid feature)
- Forms → Enable form handling
- Functions → Add serverless functions if needed

---

## Environment-Specific Builds

### Development
```bash
npm run dev
```
- Uses `.env.local`
- Source maps enabled
- Hot reload active

### Staging
```bash
VITE_ENV=staging npm run build
netlify deploy
```
- Uses staging Firebase project
- Source maps enabled
- Debug logging

### Production
```bash
npm run build
netlify deploy --prod
```
- Uses production Firebase
- Source maps disabled
- Console logs removed
- Optimized bundle

---

## Performance Optimization

### 1. Bundle Analysis

```bash
# Generate bundle report
ANALYZE=true npm run build

# View report at dist/stats.html
```

### 2. Image Optimization

- Use WebP format
- Lazy loading
- Responsive images
- CDN delivery

### 3. Caching Strategy

**Netlify configuration** (`netlify.toml`):
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 4. Service Worker

- Cache-first strategy for static assets
- Network-first for dynamic content
- Offline fallback page

---

## Rollback Procedure

### Netlify Rollback

1. Go to Deploys tab
2. Find previous successful deploy
3. Click "Publish deploy"
4. Site reverts in ~30 seconds

### Git Rollback

```bash
# Find commit to rollback to
git log --oneline

# Revert to specific commit
git revert <commit-hash>
git push origin main

# Netlify will auto-deploy reverted version
```

---

## Monitoring & Alerts

### 1. Netlify Alerts

Configure in: Site settings → Notifications

- Deploy failed
- Deploy succeeded
- Form submission
- Bandwidth limit

### 2. Firebase Alerts

Firebase Console → Project settings → Integrations

- Performance degradation
- Error rate increase
- Crash alerts

### 3. Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Configure checks for:
- Homepage availability
- API endpoints
- SSL certificate expiry

---

## Troubleshooting

### Build Fails on Netlify

**Check**:
1. Node version in `netlify.toml`
2. Environment variables set correctly
3. Build logs for specific errors
4. `package-lock.json` committed

**Solution**:
```bash
# Clear cache and rebuild
netlify build --clear-cache
```

### White Screen After Deploy

**Causes**:
- Missing environment variables
- Firebase not initialized
- JavaScript errors

**Debug**:
1. Open browser console
2. Check for errors
3. Verify Firebase config
4. Check network tab

### Service Worker Issues

**Clear cache**:
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
```

### CORS Errors

**Solution**: Configure in `netlify.toml`
```toml
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

---

## Security Checklist

Before going live:

- [ ] Environment variables secured
- [ ] Firebase security rules configured
- [ ] HTTPS enforced
- [ ] Security headers set (in `netlify.toml`)
- [ ] CSP policy configured
- [ ] Rate limiting implemented
- [ ] Input validation active
- [ ] XSS protection enabled
- [ ] Dependencies audited (`npm audit`)
- [ ] Secrets not in code
- [ ] Error messages sanitized

---

## Maintenance

### Regular Tasks

**Weekly**:
- Check error logs
- Review analytics
- Monitor performance

**Monthly**:
- Update dependencies
- Security audit
- Backup database
- Review user feedback

**Quarterly**:
- Performance optimization
- Feature updates
- Security review
- Load testing

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all (careful!)
npm update

# Test after update
npm test
npm run build
```

---

## Scaling Considerations

### Current Setup (Small-Medium Traffic)
- ✅ Netlify free tier: 100GB bandwidth/month
- ✅ Firebase free tier: 10GB storage, 50K reads/day
- ✅ Client-side database: No server costs

### If Traffic Grows
1. **Upgrade Netlify**: Pro plan ($19/month)
2. **Add CDN**: Cloudflare (free) or Fastly
3. **Migrate Database**: To Firebase Firestore or backend API
4. **Add Caching**: Redis for frequently accessed data
5. **Load Balancing**: Multiple Netlify instances

---

## Backup & Recovery

### Database Backup

```javascript
// Export database to JSON
const data = exportDatabase();
downloadJSON(data, 'backup.json');

// Manual backup
localStorage.setItem('db_backup', JSON.stringify(database));
```

### Automated Backups

- Export database weekly
- Store in Firebase Storage
- Keep 30-day history

---

## Support

For deployment issues:

- **Netlify**: [Netlify Support](https://www.netlify.com/support/)
- **Firebase**: [Firebase Support](https://firebase.google.com/support)
- **GitHub Actions**: [GitHub Community](https://github.community/)

---

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions](https://docs.github.com/en/actions)
