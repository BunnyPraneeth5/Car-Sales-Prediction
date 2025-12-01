# 🚗 Car Price Predictor AI

An AI-powered web application that predicts car prices based on various features using machine learning.

## ✨ Features

- 💬 Interactive chat interface
- 🤖 AI-powered price prediction
- 📊 Real-time valuation
- 🎨 Modern, responsive design
- 📱 Mobile-friendly
- 💾 Prediction history tracking

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- TailwindCSS
- Axios

**Backend:**
- FastAPI
- Python 3.11
- Scikit-learn
- Pandas
- SQLite

**ML Model:**
- Gradient Boosting Regressor
- Feature engineering
- Cross-validation

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BunnyPraneeeth5/car-sales-prediction.git
   cd car-sales-prediction
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the ML model:**
   ```bash
   python ml/train.py
   ```

4. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

5. **Build frontend:**
   ```bash
   npm run build
   cd ..
   ```

6. **Run the application:**
   ```bash
   uvicorn api.main:app --reload
   ```

7. **Open browser:** http://localhost:8000

## 📁 Project Structure

```
car-sales-prediction/
├── api/
│   ├── main.py           # FastAPI application
│   └── database.py       # Database operations
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Styles
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   └── package.json
├── ml/
│   ├── train.py          # Model training script
│   ├── model_store/      # Saved models
│   └── data/             # Training data
├── requirements.txt      # Python dependencies
├── Dockerfile           # Docker configuration
└── README.md
```

## 🎯 Usage

1. Open the application
2. Answer the chatbot's questions about your car:
   - Brand
   - Model
   - Year
   - Kilometers driven
   - Number of owners
   - Fuel type
   - Transmission
   - Engine capacity
   - Number of seats
3. Get instant price prediction!

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy Options:**
- ✅ Render.com (Recommended)
- Vercel + Railway
- Heroku
- Docker
- AWS EC2

## 📊 Model Performance

- **R² Score:** 0.868 (86.8% accuracy)
- **MAE:** 1.27 lakhs
- **RMSE:** 1.61 lakhs
- **Algorithm:** Gradient Boosting Regressor

## 🔧 Development

**Run backend only:**
```bash
uvicorn api.main:app --reload --port 8000
```

**Run frontend only:**
```bash
cd frontend
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Praneeth Kumar - [@BunnyPraneeth5](https://github.com/BunnyPraneeth5)

## 🙏 Acknowledgments

- FastAPI for the amazing web framework
- Scikit-learn for ML capabilities
- React team for the frontend library
- TailwindCSS for styling

## 📧 Contact

For questions or support, please open an issue or contact: bunnypraneeth25@gmail.com

---

Made with ❤️ and AI
