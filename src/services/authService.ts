import api from '@/services/api'
import type { LoginInputDto, RegisterInputDto, AuthResponseDataDto } from '@/types/auth'

export const authService = {
  /**
   * Authenticates user and returns the raw token payload directly
   */
  async login(credentials: LoginInputDto): Promise<AuthResponseDataDto> {
    try {
      const response = await api.post('/auth/Loginv2', {
        user_id: credentials.user_id,
        password: credentials.password
      })

      // Unpack the wrapper immediately here
      if (response.data && response.data.code === 0) {
        return response.data.data // Returns just { token: '...' }
      }
      
      throw new Error(response.data?.message || 'Invalid email or password configuration.')
    } catch (err: any) {
      console.error('📊 Telemetry Log [AuthService - Login]:', err)
      throw new Error(err.message || 'Network connection failed. Please try again later.')
    }
  },

  /**
   * Registers a new user account
   */
  async register(registrationData: RegisterInputDto): Promise<void> {
    try {
      const response = await api.post('/auth/register', {
        name: registrationData.name,
        email: registrationData.email,
        phone: registrationData.phone || null,
        password: registrationData.password
      })

      if (response.data && response.data.code === 0) {
        return // Registration succeeded, nothing to return
      }

      throw new Error(response.data?.message || 'Registration failed.')
    } catch (err: any) {
      console.error('📊 Telemetry Log [AuthService - Register]:', err)
      throw new Error(err.message || 'An error occurred during account registration.')
    }
  }
}