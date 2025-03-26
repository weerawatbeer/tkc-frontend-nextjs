import axios from 'axios'

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken')

    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const currentToken = localStorage.getItem('accessToken')

        if (currentToken) {
          const refreshResponse = await axios.post(
            'https://dummyjson.com/auth/refresh',
            {},
            {
              headers: {
                Authorization: `Bearer ${currentToken}`,
              },
            }
          )

          const { token } = refreshResponse.data

          // Update token in localStorage
          localStorage.setItem('accessToken', token)

          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${token}`

          // Retry the original request
          return api(originalRequest)
        }
      } catch (refreshError) {
        // If refresh fails, clear auth state and reject
        localStorage.removeItem('accessToken')
        localStorage.removeItem('authUser')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
