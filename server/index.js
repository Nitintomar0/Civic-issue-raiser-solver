import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


let reports = [];
let iotSensors = [];


io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

 
  socket.emit('initialReports', reports);


  socket.on('submitReport', (report) => {
    reports.push(report);
    io.emit('newReport', report);
    console.log('New report submitted:', report.id);
  });


  socket.on('updateReport', ({ id, updates }) => {
    const index = reports.findIndex((r) => r.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updates };
      io.emit('reportUpdate', reports[index]);
      console.log('Report updated:', id);
    }
  });


  socket.on('sensorUpdate', (sensor) => {
    const index = iotSensors.findIndex((s) => s.id === sensor.id);
    if (index !== -1) {
      iotSensors[index] = sensor;
    } else {
      iotSensors.push(sensor);
    }
    io.emit('sensorData', sensor);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.get('/api/reports/:id', (req, res) => {
  const report = reports.find((r) => r.id === req.params.id);
  if (report) {
    res.json(report);
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});


app.post('/api/reports', (req, res) => {
  const report = req.body;
  reports.push(report);
  io.emit('newReport', report);
  res.status(201).json(report);
});


app.put('/api/reports/:id', (req, res) => {
  const index = reports.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    reports[index] = { ...reports[index], ...req.body };
    io.emit('reportUpdate', reports[index]);
    res.json(reports[index]);
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});


app.delete('/api/reports/:id', (req, res) => {
  const index = reports.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    const deleted = reports.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});


app.get('/api/sensors', (req, res) => {
  res.json(iotSensors);
});


app.get('/api/weather/:city', async (req, res) => {
  try {
    const apiKey = process.env.VITE_WEATHER_API_KEY;
    if (!apiKey) {
      return res.json({
        temp: 25 + Math.random() * 10,
        condition: 'Partly Cloudy',
        humidity: 60 + Math.random() * 20,
      });
    }

    res.json({
      temp: 25 + Math.random() * 10,
      condition: 'Partly Cloudy',
      humidity: 60 + Math.random() * 20,
    });
  } catch (error) {
    res.status(500).json({ error: 'Weather API error' });
  }
});


app.get('/api/analytics', (req, res) => {
  const analytics = {
    totalReports: reports.length,
    byCategory: reports.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {}),
    byStatus: reports.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {}),
    bySeverity: reports.reduce((acc, r) => {
      acc[r.severity] = (acc[r.severity] || 0) + 1;
      return acc;
    }, {}),
    avgUpvotes: reports.reduce((sum, r) => sum + (r.upvotes || 0), 0) / reports.length || 0,
  };
  res.json(analytics);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready`);
});

export default app;
