# PWA Deployment Guide - Protégé Lecture+

## 🚀 Quick Start

This guide will help you deploy the fully PWA-compliant Protégé Lecture+ application.

## ✅ Pre-Deployment Checklist

### 1. Generate Icons (One-time / After Logo Changes)
```bash
python scripts/generate_icons.py
```

This will generate:
- 8 standard PWA icon sizes (72px - 512px)
- Maskable icon (512x512px with safe zone)
- Apple Touch Icon (180x180px)
- Multi-size favicon.ico

### 2. Build the Application
```bash
npm ci
npm run build
```

Build output: `dist/` folder

### 3. Test Locally
```bash
npm run preview
```

Access at: `http://localhost:4173`

## 🌐 Netlify Deployment

### Initial Setup

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Build Settings**
   ```
   Build command: npm ci && npm run build
   Publish directory: dist
   Node version: 20.19.0
   ```

3. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Netlify Configuration

The `netlify.toml` file is already configured with:

#### ✅ WASM Support (Fixes sql.js loading)
```toml
[[headers]]
  for = "/*.wasm"
  [headers.values]
    Content-Type = "application/wasm"
```

#### ✅ Security Headers
- CSP with `wasm-unsafe-eval`
- HSTS, X-Frame-Options, etc.

#### ✅ Caching Strategy
- Static assets: 1 year cache
- Service Worker: No cache
- HTML: 1 hour cache

### Troubleshooting Netlify

**Issue**: "both async and sync fetching of the wasm failed"
**Status**: ✅ FIXED

**Solution Applied**:
1. WASM file copied to `dist/assets/wasm/` during build
2. Correct MIME type headers added
3. CSP updated to allow WASM execution
4. Database service uses bundled WASM instead of CDN

**Verification**:
```bash
# Check if WASM exists in build
ls dist/assets/wasm/sql-wasm.wasm

# Should show: sql-wasm.wasm
```

## 🔷 Vercel Deployment

### Initial Setup

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your Git repository

3. **Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm ci && npm run build
   Output Directory: dist
   Install Command: npm ci
   Node Version: 20.x
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment

### Vercel Configuration

Create `vercel.json` (optional, for custom headers):
```json
{
  "headers": [
    {
      "source": "/(.*).wasm",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/wasm"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### CLI Deployment
```bash
vercel --prod
```

## 📱 PWA Testing

### Desktop Testing (Chrome/Edge)

1. **Open DevTools** (F12)
2. **Application Tab** → Manifest
   - ✅ Name: "Protégé Lecture+"
   - ✅ Theme Color: #4CAF50
   - ✅ Icons: 9 icons listed
   - ✅ Installable: "Yes"

3. **Service Workers**
   - ✅ Status: "Activated and is running"
   - ✅ Scope: "/"

4. **Install App**
   - Click install button in address bar
   - Or: Chrome Menu → "Install Protégé Lecture+"

### Mobile Testing (iOS/Android)

#### Android (Chrome)
1. Open site in Chrome
2. Look for "Add to Home Screen" banner
3. Tap "Add"
4. App icon appears on home screen
5. Open app → runs in standalone mode

#### iOS (Safari)
1. Open site in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Tap "Add"
5. App icon appears on home screen

### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-deployed-site.com --view

# Expected Scores:
# Performance: 85-100
# Accessibility: 90-100
# Best Practices: 85-100
# SEO: 90-100
# PWA: 100 ✅
```

## 🔍 Verification Steps

### 1. Check Icons
```bash
# Icons should exist in public/
ls public/*.png
ls public/favicon.ico
```

Expected files:
- apple-touch-icon.png
- favicon.ico
- icon-72x72.png through icon-512x512.png
- icon-512x512-maskable.png

### 2. Check Build Output
```bash
# After npm run build
ls dist/*.html          # index.html
ls dist/manifest.json   # manifest
ls dist/sw.js          # service worker
ls dist/assets/wasm/   # sql-wasm.wasm
```

### 3. Test Service Worker
1. Build and preview: `npm run preview`
2. Open DevTools → Application → Service Workers
3. Check status: "activated and is running"
4. Go offline (DevTools → Network → Offline)
5. Reload page → should load from cache

### 4. Test Offline Functionality
1. Open app
2. Browse some pages
3. Enable airplane mode
4. Reload app → should show cached content
5. Navigate → should work offline

## 📊 PWA Features Enabled

### ✅ Core PWA Features
- [x] Offline functionality
- [x] Add to home screen
- [x] Standalone display mode
- [x] Custom splash screen
- [x] Theme color
- [x] App shortcuts
- [x] Push notifications ready

### ✅ Icons & Branding
- [x] High-quality icons (8 sizes)
- [x] Maskable icon for adaptive displays
- [x] Apple Touch Icon
- [x] Favicon (multi-size)
- [x] Theme color: #4CAF50
- [x] Splash screen background

### ✅ Performance
- [x] Service worker caching
- [x] Code splitting
- [x] Asset optimization
- [x] Lazy loading
- [x] Gzip/Brotli compression

### ✅ SEO & Social
- [x] Complete meta tags
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured data ready
- [x] Sitemap generation

## 🐛 Common Issues & Solutions

### Issue 1: Icons Not Showing
**Problem**: App install banner doesn't show or icons are missing

**Solution**:
```bash
# Regenerate icons
python scripts/generate_icons.py

# Rebuild
npm run build

# Verify icons in dist
ls dist/*.png
```

### Issue 2: Service Worker Not Updating
**Problem**: Changes not reflecting after deployment

**Solution**:
1. Update cache version in `public/sw.js`:
   ```javascript
   const CACHE_NAME = 'protege-lecture-v1.2.0'; // Increment version
   ```
2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
3. Clear site data: DevTools → Application → Clear storage

### Issue 3: WASM Loading Error (Netlify)
**Problem**: "both async and sync fetching of the wasm failed"

**Status**: ✅ FIXED in current version

**Verification**:
```bash
# Check WASM in build
ls dist/assets/wasm/sql-wasm.wasm

# Should exist
```

If missing:
```bash
# Ensure sql.js is installed
npm install sql.js

# Rebuild
npm run build
```

### Issue 4: App Not Installable
**Problem**: No install prompt showing

**Checklist**:
- [ ] HTTPS enabled (not localhost)
- [ ] manifest.json accessible
- [ ] Service worker registered
- [ ] Icons 192x192 and 512x512 exist
- [ ] Valid start_url in manifest
- [ ] Not already installed

**Test**:
```javascript
// In DevTools Console
navigator.serviceWorker.getRegistrations()
// Should return array with service worker
```

## 📈 Performance Optimization

### Before Deployment
- [ ] Run `npm run build` successfully
- [ ] Check bundle size: `dist/` folder < 5MB
- [ ] Verify no console errors
- [ ] Test on mobile device
- [ ] Run Lighthouse audit

### After Deployment
- [ ] Test from different locations
- [ ] Check loading speed
- [ ] Monitor error logs
- [ ] Verify analytics tracking
- [ ] Test push notifications

## 🔄 Update Process

### For Code Changes
```bash
git add .
git commit -m "Update: description"
git push origin main
```

Auto-deployment triggers on:
- Netlify: Push to main branch
- Vercel: Push to main branch

### For Logo/Icon Changes
```bash
# 1. Replace logo
cp new-logo.jpg public/assets/logo/logo.jpg

# 2. Regenerate icons
python scripts/generate_icons.py

# 3. Commit and push
git add public/*.png public/favicon.ico
git commit -m "Update: App icons"
git push origin main
```

## 📞 Support Resources

### Documentation
- [PWA Enhancement Guide](./PWA_ENHANCEMENT.md)
- [Architecture](./ARCHITECTURE.md)
- [API Documentation](./API.md)

### External Resources
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)

## ✨ Success Metrics

Your PWA is properly configured if:

- ✅ Lighthouse PWA score: 100
- ✅ Install prompt appears on mobile
- ✅ Works offline after first visit
- ✅ Theme color shows in address bar
- ✅ Custom splash screen displays
- ✅ No WASM loading errors
- ✅ Fast loading (< 3s on 3G)
- ✅ Can be added to home screen

---

**Deployment Checklist Summary**

```bash
# 1. Generate icons (if needed)
python scripts/generate_icons.py

# 2. Install dependencies
npm ci

# 3. Build
npm run build

# 4. Test locally
npm run preview

# 5. Deploy
git push origin main  # Auto-deploys on Netlify/Vercel

# 6. Verify
# - Check deployed URL
# - Run Lighthouse
# - Test on mobile
# - Verify offline mode
```

---

**Last Updated**: 2025-10-11
**Status**: ✅ Production Ready
