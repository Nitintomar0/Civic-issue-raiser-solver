import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, MapPin, Mic, Loader, AlertTriangle } from 'lucide-react';
import { useReports } from '../../contexts/ReportContext';
import { useAuth } from '../../contexts/AuthContext';
import { classifyImage, detectSeverity, checkDuplicate } from '../../services/ai/imageClassifier';
import { transcribeVoice } from '../../services/ai/voiceRecognition';

const CATEGORIES = [
  'pothole',
  'garbage',
  'streetlight',
  'water_leak',
  'drainage',
  'road_damage',
];

const ReportForm = ({ initialLocation, onClose }) => {
  const { t } = useTranslation();
  const { addReport, reports } = useReports();
  const { user, addPoints, incrementReports } = useAuth();

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: initialLocation || null,
    photoURL: null,
    severity: 'moderate',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [recording, setRecording] = useState(false);

  // Get user's location
  useEffect(() => {
    if (!initialLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [initialLocation]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      analyzeImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData) => {
    setAiAnalyzing(true);
    try {
      // AI Image Classification
      const classification = await classifyImage(imageData);
      const severity = await detectSeverity(imageData);
      
      setAiPrediction({
        type: classification.category,
        confidence: classification.confidence,
        severity: severity,
      });

      // Auto-fill form
      setFormData((prev) => ({
        ...prev,
        category: classification.category,
        severity: severity,
      }));

      // Check for duplicates
      if (formData.location) {
        const duplicate = await checkDuplicate(
          imageData,
          formData.location,
          reports
        );
        if (duplicate) {
          setDuplicateWarning(duplicate);
        }
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleVoiceInput = async () => {
    setRecording(true);
    try {
      const transcript = await transcribeVoice();
      setFormData((prev) => ({
        ...prev,
        description: transcript.text,
        category: transcript.category || prev.category,
      }));
    } catch (error) {
      console.error('Voice recognition error:', error);
    } finally {
      setRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.location) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create report
      const reportData = {
        ...formData,
        photoURL: imagePreview,
        reporter: user.username,
        reporterId: user.uid,
        aiPrediction,
      };

      addReport(reportData);

      // Award points
      addPoints(10);
      incrementReports();

      // Show success message
      alert(t('reportSubmitted') + ' ' + t('pointsEarned', { points: 10 }));

      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('reportIssue')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {t('uploadPhoto')} *
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                {aiAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">AI Analyzing...</p>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                    setAiPrediction(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>

          {/* AI Prediction */}
          {aiPrediction && (
            <div className="p-4 bg-bengaluru-orange/10 border border-bengaluru-orange rounded-lg">
              <h4 className="text-sm font-semibold text-bengaluru-orange mb-2">
                🤖 AI Analysis
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Detected: <span className="font-semibold capitalize">{aiPrediction.type}</span> ({(aiPrediction.confidence * 100).toFixed(0)}% confidence)
                <br />
                Severity: <span className="font-semibold capitalize">{aiPrediction.severity}</span>
              </p>
            </div>
          )}

          {/* Duplicate Warning */}
          {duplicateWarning && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  {t('duplicateWarning')}
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  A similar issue was reported {duplicateWarning.distance}m away on{' '}
                  {new Date(duplicateWarning.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {t('selectCategory')} *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bengaluru-orange"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t(cat)}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {t('addDescription')} *
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bengaluru-orange resize-none"
                placeholder="Describe the issue in detail..."
                required
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={recording}
                className="absolute bottom-2 right-2 p-2 bg-bengaluru-orange text-white rounded-lg hover:bg-bengaluru-orange/90 disabled:opacity-50"
                title="Voice input"
              >
                {recording ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Location *
            </label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <MapPin className="w-5 h-5 text-bengaluru-orange" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formData.location
                  ? `${formData.location.lat.toFixed(4)}, ${formData.location.lng.toFixed(4)}`
                  : 'Getting location...'}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || aiAnalyzing}
              className="flex-1 px-6 py-3 bg-bengaluru-orange text-white rounded-lg hover:bg-bengaluru-orange/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                t('submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
