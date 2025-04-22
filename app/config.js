// Base API URL
const API_BASE_URL = "http://192.168.1.22:3000/api";

// API Endpoints
const config = {
  CATEGORY_API: `${API_BASE_URL}/category`,
  AUTH_API: `${API_BASE_URL}/auth`,
  LEADERBOARD_API: `${API_BASE_URL}/leaderboard`,
};

export default config;

// Utility Functions
export const fetchCategories = async () => {
  try {
    const response = await fetch(config.CATEGORY_API);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Unable to fetch categories. Please try again later.");
  }
};

export const fetchQuizSets = async (categoryId) => {
  try {
    const response = await fetch(config.QUIZSETS_API(categoryId));
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz sets: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching quiz sets:", error);
    throw new Error("Unable to fetch quiz sets. Please try again later.");
  }
};