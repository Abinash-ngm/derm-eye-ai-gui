// API configuration using environment variables
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
};

// API endpoints
export const API_ENDPOINTS = {
  // Scan endpoints
  skinAnalysis: `${API_CONFIG.baseUrl}/scan/skin`,
  eyeAnalysis: `${API_CONFIG.baseUrl}/scan/eye`,
  
  // Chatbot endpoint
  chatbot: `${API_CONFIG.baseUrl}/chat`,
  
  // Appointment endpoints
  appointments: `${API_CONFIG.baseUrl}/appointments`,
  
  // Clinic endpoints
  clinicsNearby: `${API_CONFIG.baseUrl}/clinics/nearby`,
  clinicDetails: (placeId: string) => `${API_CONFIG.baseUrl}/clinics/details/${placeId}`,
  
  // Auth endpoints
  authVerify: `${API_CONFIG.baseUrl}/auth/verify`,
  authUser: (uid: string) => `${API_CONFIG.baseUrl}/auth/user/${uid}`,
  
  // Health check
  health: `${API_CONFIG.baseUrl}/health`,
};

// Helper function to call backend chatbot API
export const callChatbotAPI = async (message: string, history?: string): Promise<string> => {
  try {
    const response = await fetch(API_ENDPOINTS.chatbot, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chatbot API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Chatbot API error:', error);
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

// Helper function to search nearby clinics using backend API
export const searchNearbyClinics = async (latitude: number, longitude: number, radius: number = 5000) => {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });

    const response = await fetch(`${API_ENDPOINTS.clinicsNearby}?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch clinic data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Clinics API error:', error);
    throw error;
  }
};

// Helper function to create appointment
export const createAppointment = async (appointmentData: {
  doctor_name: string;
  specialty?: string;
  clinic_name: string;
  date: string;
  time: string;
}) => {
  try {
    const response = await fetch(API_ENDPOINTS.appointments, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }

    return await response.json();
  } catch (error) {
    console.error('Appointment creation error:', error);
    throw error;
  }
};

// Helper function to get user appointments
export const getUserAppointments = async (userUid: string, status?: string) => {
  try {
    const params = status ? `?status=${status}` : '';
    const response = await fetch(`${API_ENDPOINTS.appointments}/${userUid}${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch appointments error:', error);
    throw error;
  }
};

// Helper function to cancel appointment
export const cancelAppointment = async (appointmentId: string) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.appointments}/${appointmentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to cancel appointment');
    }

    return await response.json();
  } catch (error) {
    console.error('Cancel appointment error:', error);
    throw error;
  }
};
