# 🌆 Namma Bengaluru 360° Fix-It AI

A production-ready, mobile-first, AI-driven civic issue reporting and analysis platform for Bengaluru.

## 🎯 Features

### Core Features
- **Interactive Map Dashboard** - Real-time issue reporting with Mapbox GL JS
- **Guest Mode** - No login required, instant access
- **AI-Powered Analysis** - Image classification, severity detection, duplicate detection
- **IoT Integration** - Real-time sensor data simulation
- **Predictive Analytics** - ML-based issue hotspot prediction
- **Blockchain Transparency** - Proof of fix verification
- **3D Visualization** - Digital twin with Cesium.js
- **Voice Reporting** - Speech-to-text issue submission
- **Gamification** - Points, badges, and leaderboards
- **Multi-language** - English + Kannada support
- **Dark Mode** - Full accessibility features

### AI Features
1. **Image Classification** - Auto-detect issue type from photos
2. **Severity Analysis** - Classify issues as Minor/Moderate/Severe
3. **Duplicate Detection** - Prevent redundant reports
4. **Sentiment Analysis** - Analyze citizen feedback
5. **AI Copilot** - Auto-generate admin reports
6. **Text Summarization** - Ward-wise report summaries

### Advanced Features
- Real-time updates via WebSocket
- Route optimization for field workers
- Weather-based risk prediction
- Community collaboration tools
- Comprehensive admin dashboard
- Data visualization and analytics

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TailwindCSS |
| Maps | Mapbox GL JS + Cesium.js |
| AI/ML | TensorFlow.js + MobileNet |
| Blockchain | ethers.js (Polygon Testnet) |
| Real-time | Socket.io + MQTT |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Storage | Cloudinary |
| Charts | Recharts + Chart.js |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (optional)
- Mapbox API key (optional - demo works without it)

### Installation

```bash
# Clone the repository
git clone <your-repo-link>
cd bengaluru-fixit-ai

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# In another terminal, start backend server
npm run server
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Mapbox (optional - app works with demo mode)
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# MongoDB (optional - uses in-memory storage by default)
MONGODB_URI=your_mongodb_connection_string

# Cloudinary (optional - uses base64 by default)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenWeatherMap (optional)
VITE_WEATHER_API_KEY=your_openweather_api_key

# Polygon Testnet (optional)
VITE_BLOCKCHAIN_RPC=https://rpc-mumbai.maticvigil.com
```

## 📱 Usage

### For Citizens
1. Open the app - automatically logged in as guest
2. Click on the map to report an issue
3. Upload a photo and add description
4. AI automatically detects issue type and severity
5. Track your report status in real-time
6. Earn points and badges for contributions

### For Admins
1. Access admin dashboard from menu
2. View all reports on map with filters
3. Assign issues to field workers
4. View analytics and AI-generated insights
5. Export reports as PDF
6. Verify blockchain proof of fix

### Voice Reporting
1. Click microphone icon
2. Say: "There's a pothole near MG Road"
3. AI extracts location and creates report

## 🏗️ Project Structure

```
bengaluru-fixit-ai/
├── src/
│   ├── components/        # React components
│   │   ├── Map/          # Map components
│   │   ├── Report/       # Report submission
│   │   ├── Admin/        # Admin dashboard
│   │   ├── AI/           # AI features
│   │   └── UI/           # Reusable UI components
│   ├── services/         # API and service integrations
│   │   ├── ai/           # AI models and processing
│   │   ├── blockchain/   # Web3 integration
│   │   ├── iot/          # IoT simulation
│   │   └── api/          # Backend API calls
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React contexts
│   ├── i18n/             # Internationalization
│   └── App.jsx           # Main app component
├── server/               # Backend server
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   └── index.js          # Server entry point
├── public/               # Static assets
└── package.json
```

## 🧪 Testing

The app includes demo data and mock services for testing without external dependencies:
- Mock IoT sensors update every 5 seconds
- Sample reports pre-loaded on map
- AI models work offline with TensorFlow.js
- Blockchain uses local mock transactions

## 🌐 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Render)
```bash
# Push to GitHub
# Connect to Render
# Deploy automatically
```

## 📊 Features Breakdown

### Map Dashboard
- Drop pins anywhere in Bengaluru
- Auto-detect GPS location
- Color-coded markers by issue type
- Real-time updates
- Filter by category, severity, date
- Cluster markers for better performance

### AI Engine
- **TensorFlow.js** for browser-based ML
- **MobileNet** for image classification
- Custom severity detection algorithm
- Cosine similarity for duplicate detection
- Sentiment analysis on comments

### IoT Simulation
- Smart bins (capacity monitoring)
- Streetlights (fault detection)
- Water quality sensors
- Air quality monitors
- Updates via WebSocket/MQTT

### Blockchain Layer
- Immutable proof of fix
- Transaction hash verification
- Polygon Mumbai testnet
- Transparent audit trail

### 3D Visualization
- Cesium.js digital twin
- Ward-wise issue density
- Animated transitions
- Camera controls

### Gamification
- Points for valid reports
- Badges (Bronze/Silver/Gold)
- Leaderboard rankings
- Community groups
- Verification rewards

## 🎨 UI/UX Features

- **Mobile-first design** - Optimized for smartphones
- **Dark mode** - Eye-friendly interface
- **High contrast** - Accessibility compliant
- **Responsive** - Works on all screen sizes
- **Smooth animations** - Modern interactions
- **Intuitive navigation** - Easy to use

## 🌍 Localization

Supports English and Kannada:
- UI translations
- Voice input in both languages
- Report descriptions
- Admin interface

## 🔒 Privacy & Security

- No personal data collection in guest mode
- Images stored securely
- API rate limiting
- Input validation
- XSS protection

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md for guidelines.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Bengaluru Smart City Initiative
- OpenStreetMap contributors
- TensorFlow.js team
- Mapbox and Cesium communities

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@bengalurufixit.ai

---

Built with ❤️ for Namma Bengaluru
