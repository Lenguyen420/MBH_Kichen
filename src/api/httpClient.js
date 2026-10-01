import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'API request failed'

    return Promise.reject(new Error(message))
  },
)

export default httpClient
