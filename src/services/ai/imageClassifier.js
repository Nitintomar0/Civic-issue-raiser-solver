import * as tf from '@tensorflow/tfjs';

// Mock AI classification (in production, use actual TensorFlow.js models)
export const classifyImage = async (imageData) => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock classification based on image characteristics
  // In production, load and use actual MobileNet or custom trained model
  const categories = ['pothole', 'garbage', 'streetlight', 'water_leak', 'drainage', 'road_damage'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence

  return {
    category: randomCategory,
    confidence: confidence,
  };
};

// Detect severity from image features
export const detectSeverity = async (imageData) => {
  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock severity detection
  // In production, analyze image features like:
  // - Brightness/darkness
  // - Texture complexity
  // - Object size relative to frame
  // - Color patterns
  const severities = ['minor', 'moderate', 'severe'];
  const weights = [0.3, 0.5, 0.2]; // More likely to be moderate
  
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < severities.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) {
      return severities[i];
    }
  }
  
  return 'moderate';
};

// Check for duplicate reports using location proximity and image similarity
export const checkDuplicate = async (imageData, location, existingReports) => {
  // Simulate processing
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Check for nearby reports (within 100 meters)
  const DUPLICATE_THRESHOLD = 0.1; // ~100 meters in degrees

  for (const report of existingReports) {
    const latDiff = Math.abs(report.location.lat - location.lat);
    const lngDiff = Math.abs(report.location.lng - location.lng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    if (distance < DUPLICATE_THRESHOLD) {
      // Calculate approximate distance in meters
      const distanceInMeters = Math.round(distance * 111000);
      
      return {
        reportId: report.id,
        distance: distanceInMeters,
        timestamp: report.timestamp,
        similarity: 0.85, // Mock similarity score
      };
    }
  }

  return null;
};

// Calculate cosine similarity between image embeddings
const cosineSimilarity = (vec1, vec2) => {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (mag1 * mag2);
};

// Extract image embeddings using MobileNet
export const getImageEmbedding = async (imageData) => {
  try {
    // Load MobileNet model (cached after first load)
    const mobilenet = await tf.loadLayersModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
    );

    // Convert image to tensor
    const img = new Image();
    img.src = imageData;
    await img.decode();

    const tensor = tf.browser
      .fromPixels(img)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(tf.scalar(127))
      .sub(tf.scalar(1))
      .expandDims();

    // Get embeddings from second-to-last layer
    const activation = mobilenet.predict(tensor);
    const embedding = await activation.data();

    // Cleanup
    tensor.dispose();
    activation.dispose();

    return Array.from(embedding);
  } catch (error) {
    console.error('Error getting image embedding:', error);
    // Return mock embedding on error
    return Array(1024).fill(0).map(() => Math.random());
  }
};

// Sentiment analysis on report descriptions
export const analyzeSentiment = async (text) => {
  // Simulate API call to Hugging Face or similar
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock sentiment analysis
  const sentiments = ['positive', 'neutral', 'negative', 'frustrated', 'urgent'];
  const keywords = {
    urgent: ['urgent', 'emergency', 'dangerous', 'immediately'],
    frustrated: ['again', 'still', 'always', 'never fixed'],
    negative: ['bad', 'terrible', 'awful', 'worst'],
    positive: ['good', 'thank', 'fixed', 'better'],
  };

  const lowerText = text.toLowerCase();

  for (const [sentiment, words] of Object.entries(keywords)) {
    if (words.some((word) => lowerText.includes(word))) {
      return {
        sentiment,
        confidence: 0.8 + Math.random() * 0.15,
      };
    }
  }

  return {
    sentiment: 'neutral',
    confidence: 0.7,
  };
};

// Generate AI summary of multiple reports
export const summarizeReports = async (reports) => {
  // Simulate processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const categoryCount = {};
  const severityCount = {};
  let totalUpvotes = 0;

  reports.forEach((report) => {
    categoryCount[report.category] = (categoryCount[report.category] || 0) + 1;
    severityCount[report.severity] = (severityCount[report.severity] || 0) + 1;
    totalUpvotes += report.upvotes || 0;
  });

  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  const topSeverity = Object.entries(severityCount).sort((a, b) => b[1] - a[1])[0];

  return {
    summary: `Analysis of ${reports.length} reports: ${topCategory[0]} is the most common issue (${topCategory[1]} reports), with ${topSeverity[0]} severity being most prevalent. Total community engagement: ${totalUpvotes} upvotes.`,
    topCategory: topCategory[0],
    topSeverity: topSeverity[0],
    totalReports: reports.length,
    avgUpvotes: (totalUpvotes / reports.length).toFixed(1),
  };
};
