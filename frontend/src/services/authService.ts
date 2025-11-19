import apiClient from './api'

export interface LoginCredentials {
  username: string
  password: string
  profileId?: string
  phoneAccess?: boolean
  extension?: string
}

export interface LoginResponse {
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    email?: string
    profile: {
      id: string
      name: string
      permissions: any
    }
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export interface Profile {
  id: string
  name: string
  description?: string
  permissions: any
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', credentials)

    if (response.data.success) {
      const { user, tokens } = response.data.data

      // Guardar en localStorage
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(user))

      return response.data.data
    }

    throw new Error(response.data.error || 'Error al iniciar sesión')
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  async getProfiles(username: string): Promise<Profile[]> {
    const response = await apiClient.get('/auth/profiles', {
      params: { username },
    })

    if (response.data.success) {
      return response.data.data
    }

    throw new Error(response.data.error || 'Error al obtener perfiles')
  }

  async validateExtension(extension: string): Promise<boolean> {
    const response = await apiClient.get('/auth/validate-extension', {
      params: { extension },
    })

    if (response.data.success) {
      return response.data.data.valid
    }

    return false
  }

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me')

    if (response.data.success) {
      return response.data.data
    }

    throw new Error(response.data.error || 'Error al obtener usuario actual')
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
  }

  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  }
}

export default new AuthService()
