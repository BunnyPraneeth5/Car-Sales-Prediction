# Car Price Predictor - Deployment Guide

## 📋 Prerequisites
- Git installed
- GitHub account
- Python 3.11+
- Node.js 18+

## 🚀 Deployment Options

### Option 1: Render.com (Recommended - Free Tier)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment

3. **Your app will be live at:** `https://your-app-name.onrender.com`

---

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set build settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

**Backend on Railway:**
1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables if needed
5. Railway will auto-detect Python and deploy

---

### Option 3: Heroku

1. **Install Heroku CLI:**
   ```bash
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App:**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **Open App:**
   ```bash
   heroku open
   ```

---

### Option 4: Docker (Any Cloud Provider)

1. **Build Docker Image:**
   ```bash
   docker build -t car-price-predictor .
   ```

2. **Run Locally:**
   ```bash
   docker run -p 8000:8000 car-price-predictor
   ```

3. **Deploy to Cloud:**
   - **AWS ECS/Fargate**
   - **Google Cloud Run**
   - **Azure Container Instances**
   - **DigitalOcean App Platform**

---

### Option 5: AWS (EC2)

1. **Launch EC2 Instance** (Ubuntu 22.04)

2. **SSH into instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3-pip nodejs npm git -y
   ```

4. **Clone and setup:**
   ```bash
   git clone YOUR_REPO_URL
   cd car-sales-prediction
   pip3 install -r requirements.txt
   cd frontend && npm install && npm run build
   cd ..
   ```

5. **Run with PM2:**
   ```bash
   sudo npm install -g pm2
   pm2 start "uvicorn api.main:app --host 0.0.0.0 --port 8000" --name car-api
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx (optional):**
   ```bash
   sudo apt install nginx -y
   # Configure nginx to proxy to port 8000
   ```

---

## 🔧 Local Development

1. **Backend:**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Train model (if needed)
   python ml/train.py
   
   # Run backend
   uvicorn api.main:app --reload --port 8000
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access:** http://localhost:5173

---

## 🌐 Environment Variables (if needed)

Create `.env` file:
```
DATABASE_URL=your_database_url
MODEL_PATH=ml/model_store/car_model.joblib
```

---

## 📦 Build for Production

```bash
# Build frontend
cd frontend
npm run build

# This creates frontend/dist folder
# Backend serves this automatically
```

---

## ✅ Verify Deployment

After deployment, test these endpoints:
- `GET /health` - Check API status
- `POST /predict` - Test prediction
- `GET /history` - View prediction history
- `/` - Frontend UI

---

## 🐛 Troubleshooting

**Issue: Module not found**
```bash
pip install -r requirements.txt
```

**Issue: Frontend not building**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue: Model file missing**
```bash
python ml/train.py
```

**Issue: Port already in use**
```bash
# Change port in command
uvicorn api.main:app --port 8001
```

---

## 🎯 Recommended: Render.com

**Why Render?**
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Built-in SSL
- ✅ Easy setup
- ✅ No credit card required

**Steps:**
1. Push code to GitHub
2. Connect to Render
3. Deploy (automatic)
4. Done! 🎉

---

## 📱 Access Your App

After deployment, share your link:
- Render: `https://your-app.onrender.com`
- Heroku: `https://your-app.herokuapp.com`
- Vercel: `https://your-app.vercel.app`

---

## 🔒 Security Notes

- Add `.env` to `.gitignore`
- Never commit API keys
- Use environment variables for secrets
- Enable HTTPS (automatic on most platforms)

---

## 📊 Monitoring

- Check logs: `heroku logs --tail` or platform dashboard
- Monitor uptime: Use UptimeRobot (free)
- Track errors: Sentry integration (optional)

---

## 🚀 Quick Deploy Commands

```bash
# 1. Prepare
git init
git add .
git commit -m "Ready for deployment"

# 2. Push to GitHub
git remote add origin YOUR_REPO_URL
git push -u origin main

# 3. Deploy on Render.com (via dashboard)
# Or use Render CLI:
render deploy

# Done! 🎉
```
