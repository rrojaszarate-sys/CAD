import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials, setLoading } from '@store/slices/authSlice'
import authService from '@services/authService'

interface Profile {
  id: string
  name: string
  description?: string
}

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Estados del formulario
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedProfile, setSelectedProfile] = useState('')
  const [phoneAccess, setPhoneAccess] = useState(false)
  const [extension, setExtension] = useState('')

  // Estados de UI
  const [showPassword, setShowPassword] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoadingState] = useState(false)
  const [error, setError] = useState('')
  const [loadingProfiles, setLoadingProfiles] = useState(false)

  // Cargar perfiles cuando el usuario escribe su username
  useEffect(() => {
    const loadProfiles = async () => {
      if (username.length >= 3) {
        setLoadingProfiles(true)
        try {
          const userProfiles = await authService.getProfiles(username.toUpperCase())
          setProfiles(userProfiles)

          // Auto-seleccionar si solo hay un perfil
          if (userProfiles.length === 1) {
            setSelectedProfile(userProfiles[0].id)
          }
        } catch (err: any) {
          // No mostrar error si el usuario aún no existe
          setProfiles([])
        } finally {
          setLoadingProfiles(false)
        }
      } else {
        setProfiles([])
        setSelectedProfile('')
      }
    }

    const debounceTimer = setTimeout(loadProfiles, 500)
    return () => clearTimeout(debounceTimer)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (!username || !password) {
      setError('Usuario y contraseña son requeridos')
      return
    }

    if (!selectedProfile && profiles.length > 0) {
      setError('Debe seleccionar un perfil')
      return
    }

    if (phoneAccess && !extension) {
      setError('Debe ingresar una extensión para acceso telefónico')
      return
    }

    setLoadingState(true)
    dispatch(setLoading(true))

    try {
      const result = await authService.login({
        username: username.toUpperCase(),
        password,
        profileId: selectedProfile || undefined,
        phoneAccess,
        extension: phoneAccess ? extension : undefined,
      })

      // Actualizar estado global
      dispatch(setCredentials({
        user: result.user,
        token: result.tokens.accessToken,
      }))

      // Redirigir según perfil
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error al iniciar sesión')
    } finally {
      setLoadingState(false)
      dispatch(setLoading(false))
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setUsername(value)
    setError('')
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setError('')
  }

  const isFormValid = username && password && (!profiles.length || selectedProfile)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo y Título */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              SISTEMA CAD
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Acceso al Sistema
            </Typography>
          </Box>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Usuario */}
            <TextField
              fullWidth
              label="Usuario"
              value={username}
              onChange={handleUsernameChange}
              margin="normal"
              required
              autoComplete="username"
              inputProps={{ maxLength: 20 }}
              disabled={loading}
            />

            {/* Contraseña */}
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              margin="normal"
              required
              autoComplete="current-password"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Perfil */}
            {profiles.length > 0 && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Perfil</InputLabel>
                <Select
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  label="Perfil"
                  required
                  disabled={loading || loadingProfiles}
                >
                  {profiles.map((profile) => (
                    <MenuItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Acceso por Telefonía */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={phoneAccess}
                  onChange={(e) => setPhoneAccess(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Acceso por Telefonía"
              sx={{ mt: 2 }}
            />

            {/* Extensión */}
            {phoneAccess && (
              <TextField
                fullWidth
                label="Extensión"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                margin="normal"
                required={phoneAccess}
                inputProps={{ maxLength: 6 }}
                disabled={loading}
              />
            )}

            {/* Botones */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!isFormValid || loading}
                sx={{ position: 'relative' }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'INGRESAR'
                )}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                disabled={loading}
                onClick={() => {
                  setUsername('')
                  setPassword('')
                  setSelectedProfile('')
                  setPhoneAccess(false)
                  setExtension('')
                  setError('')
                }}
              >
                CANCELAR
              </Button>
            </Box>
          </form>

          {/* Versión */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 3 }}
          >
            Sistema CAD v1.0.0
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
