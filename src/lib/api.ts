// API configuration using environment variables
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
};

// API endpoints
export const API_ENDPOINTS = {
  skinAnalysis: `${API_CONFIG.baseUrl}/scan/skin`,
  eyeAnalysis: `${API_CONFIG.baseUrl}/scan/eye`,
  chatbot: `${API_CONFIG.baseUrl}/chat`,
};

// Helper function to call Gemini API
export const callGeminiAPI = async (prompt: string): Promise<string> => {
  if (!API_CONFIG.geminiApiKey) {
    console.warn('Gemini API key not configured');
    return "Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_CONFIG.geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful AI health assistant. Provide accurate, helpful health information while always reminding users to consult healthcare professionals for serious concerns. User question: ${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Sorry, I encountered an error. Please try again later.';
  }
};

// Helper function to analyze skin disease
export const analyzeSkinImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(API_ENDPOINTS.skinAnalysis, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    return await response.json();
  } catch (error) {
    console.error('Skin analysis error:', error);
    throw error;
  }
};

// Helper function to analyze eye disease
export const analyzeEyeImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(API_ENDPOINTS.eyeAnalysis, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    return await response.json();
  } catch (error) {
    console.error('Eye analysis error:', error);
    throw error;
  }
};
