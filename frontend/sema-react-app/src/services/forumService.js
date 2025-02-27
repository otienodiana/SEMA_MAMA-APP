import axios from "axios";

const API_URL = "http://localhost:8000/api/support/forums/";  // ✅ Ensure trailing slash

// ✅ Get all forums
export const getForums = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;  // ✅ Return only the data
  } catch (error) {
    console.error("Error fetching forums:", error);
    return [];
  }
};

// ✅ Create a forum
export const createForum = async (forumData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(API_URL, forumData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating forum:", error);
    throw error;  // Forward error to the calling function
  }
};

// ✅ Delete a forum
export const deleteForum = async (forumId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}${forumId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting forum:", error);
    throw error;
  }
};

// ✅ Get posts for a forum
export const getForumPosts = async (forumId) => {
  try {
    const response = await axios.get(`${API_URL}${forumId}/posts/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// ✅ Create a post in a forum
export const createPost = async (forumId, postData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${API_URL}${forumId}/posts/`, postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// ✅ Get comments for a post
export const getPostComments = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}${postId}/comments/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

// ✅ Create a comment on a post
export const createComment = async (postId, commentData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${API_URL}${postId}/comments/`, commentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
