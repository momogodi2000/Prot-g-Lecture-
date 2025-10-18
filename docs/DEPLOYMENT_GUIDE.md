# 🚀 Deployment Guide - Protégé Lecture+ Full-Stack App

This guide covers deploying your full-stack React + Node.js application with SQLite database.

## 🎯 Deployment Options

Since your app now has both frontend and backend components, here are the recommended deployment strategies:

### Option 1: Render.com (Recommended - Free Tier)
✅ **Best for**: Full-stack deployment in one place
✅ **Free tier**: Includes 750 hours/month
✅ **Database**: Persistent SQLite with automatic backups
✅ **Features**: Auto-deploy from GitHub, custom domains

### Option 2: Vercel + Railway/VPS
✅ **Frontend**: Vercel (excellent for React)
✅ **Backend**: Railway, DigitalOcean, or similar
⚠️ **Complexity**: Requires managing two deployments

### Option 3: Docker + Any Cloud Provider
✅ **Portable**: Works anywhere Docker is supported
✅ **Scalable**: Easy to scale with load balancers

---

## 🌟 Render.com Deployment (Recommended)

### 1. Prepare Your Repository

Ensure your `render.yaml` file is in the root directory (already created).

### 2. Deploy on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` configuration

3. **Environment Variables**
   The `render.yaml` file is already configured with the correct environment variables:
   ```yaml
   NODE_ENV=production
   JWT_SECRET=auto-generated-by-render
   JWT_EXPIRES_IN=24h
   PORT=5000
   FRONTEND_URL=https://protege-lecture-frontend.onrender.com
   DATABASE_PATH=/opt/render/project/src/database.sqlite
   INITIAL_ADMIN_EMAIL=yvangodimomo@gmail.com
   INITIAL_ADMIN_PASSWORD=auto-generated-by-render
   INITIAL_ADMIN_NAME=Super Administrateur
   ```

   The frontend is configured to use:
   ```
   VITE_API_URL=https://protege-lecture-backend.onrender.com/api
   ```

4. **Deploy**
   - Click "Create New Resources"
   - Render will build and deploy both services automatically

### 3. Custom Domain (Optional)

1. In Render Dashboard → Settings → Custom Domains
2. Add your domain (e.g., `protegelecture.org`)
3. Update DNS records as instructed by Render

---

## 🐳 Docker Deployment

### Local Docker Testing

```bash
# Build and run locally
docker-compose up --build

# App will be available at http://localhost:5000
```

### Production Docker Deployment

```bash
# Build production image
docker build -t protege-lecture-plus .

# Run container
docker run -p 5000:5000 \
  -e JWT_SECRET=your-secret \
  -e NODE_ENV=production \
  -v $(pwd)/database.sqlite:/app/database.sqlite \
  protege-lecture-plus
```

---

## 📊 Excel Data Import

Your Excel inventory file can be imported after deployment:

### Method 1: Server-side Import

```bash
# On your server or locally
npm run import-excel
```

### Method 2: Via Admin Interface

The enhanced BulkImport component can handle CSV files through the admin panel.

### Excel File Format

Your `Inventaire de la bibliothèque Protege QV.xlsx` should have these columns (or similar):
- `titre` / `nom` / `title` - Book title
- `auteur` / `author` - Author name  
- `categorie` / `category` - Book category
- `isbn` - ISBN number
- `quantite` / `stock` - Number of copies
- `pages` - Number of pages
- `editeur` / `publisher` - Publisher
- `annee` / `year` - Publication year

The import script will auto-detect column names and create missing authors/categories.

---

## 🔧 Environment Configuration

### Development
```bash
# .env file
NODE_ENV=development
PORT=5000
JWT_SECRET=dev-secret-key
FRONTEND_URL=http://localhost:5173
DATABASE_PATH=./database.sqlite
```

### Production
```bash
# Render Environment Variables
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-secret-key
FRONTEND_URL=https://your-app.onrender.com
DATABASE_PATH=/opt/render/project/src/database.sqlite
```

---

## 🚀 Deployment Commands

### Initial Setup (One-time)
```bash
# Install dependencies
npm ci

# Run database migrations
npm run migrate

# Seed with default data
npm run seed

# Import Excel data (optional)
npm run import-excel
```

### Start Production Server
```bash
# Build frontend
npm run build

# Start server (serves both API and frontend)
npm start
```

---

## 📋 Post-Deployment Checklist

### ✅ Essential Checks

1. **Health Check**
   ```bash
   curl https://your-app.onrender.com/api/health
   # Should return: {"status":"UP","message":"Backend is running"}
   ```

2. **Frontend Loads**
   - Visit your app URL
   - Check if React app loads correctly

3. **Admin Login**
   - Go to `/login`
   - Default credentials:
     - Email: `admin@protegeqv.org`
     - Password: `Admin123!`

4. **Database Status**
   - Login to admin panel
   - Check if books, categories, and authors exist

### ✅ Functionality Tests

1. **Create a Book**
   - Admin → Books → Add Book
   - Fill form and save

2. **Make a Reservation**
   - Public site → Books → Select book → Reserve

3. **Test API Endpoints**
   ```bash
   # Test books API
   curl https://your-app.onrender.com/api/books
   ```

---

## 🔐 Security Configuration

### JWT Secret
```bash
# Generate strong secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Production Security Headers
Already configured in `server/index.js`:
- Helmet for security headers
- CORS protection
- Rate limiting
- Request size limits

---

## 📞 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check database file permissions
   ls -la database.sqlite
   ```

2. **Frontend Not Loading**
   - Verify `npm run build` completed successfully
   - Check if `dist/` folder exists

3. **API 404 Errors**
   - Ensure server is running on correct port
   - Verify API routes in `server/routes/`

4. **Excel Import Fails**
   - Check file path: `Exceel-sheet-book/Inventaire de la bibliothèque Protege QV.xlsx`
   - Verify Excel file format and column names

### Logs and Debugging

```bash
# Check server logs in Render dashboard
# Or locally:
npm run dev  # Shows detailed logs
```

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ App loads at your domain URL
✅ Admin panel accessible at `/login`
✅ Books catalog displays properly
✅ Users can make reservations
✅ Admin can manage books and users
✅ Database persists between deployments

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [SQLite Best Practices](https://www.sqlite.org/bestpractices.html)

---

*Happy Deploying! 🚀*
