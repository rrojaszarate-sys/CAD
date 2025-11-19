import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  Grid,
  Autocomplete,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  VpnKey as ResetPasswordIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import api from '@services/api'

interface User {
  id: string
  nombreUsuario: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno?: string
  correoElectronico?: string
  estaActivo: boolean
  estaBloqueado: boolean
  perfil: {
    id: string
    nombre: string
  }
  municipios: Array<{
    municipio: {
      id: string
      nombre: string
    }
  }>
  corporaciones: Array<{
    corporacion: {
      id: string
      nombre: string
    }
  }>
  accesoTelefoniaHabilitado: boolean
  extension?: string
  extensionActiva: boolean
}

interface Profile {
  id: string
  nombre: string
}

interface Municipality {
  id: string
  nombre: string
}

interface Corporation {
  id: string
  nombre: string
}

const userSchema = yup.object().shape({
  nombreUsuario: yup.string().required('El nombre de usuario es requerido'),
  contrasena: yup.string().when('$isEditing', {
    is: false,
    then: (schema) => schema.required('La contraseña es requerida').min(8, 'Mínimo 8 caracteres'),
    otherwise: (schema) => schema.notRequired(),
  }),
  correoElectronico: yup.string().email('Correo inválido'),
  nombre: yup.string().required('El nombre es requerido'),
  apellidoPaterno: yup.string().required('El apellido paterno es requerido'),
  apellidoMaterno: yup.string(),
  perfilId: yup.string().required('El perfil es requerido'),
  accesoTelefoniaHabilitado: yup.boolean(),
  extension: yup.string(),
  extensionActiva: yup.boolean(),
})

export default function UsersCRUD() {
  const [users, setUsers] = useState<User[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [corporations, setCorporations] = useState<Corporation[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProfile, setFilterProfile] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  const [selectedMunicipalities, setSelectedMunicipalities] = useState<Municipality[]>([])
  const [selectedCorporations, setSelectedCorporations] = useState<Corporation[]>([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    context: { isEditing: !!editingUser },
  })

  useEffect(() => {
    loadData()
  }, [searchTerm, filterProfile, filterStatus])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filterProfile) params.append('perfilId', filterProfile)
      if (filterStatus) params.append('estaActivo', filterStatus)

      const [usersRes, profilesRes, municipalitiesRes, corporationsRes] = await Promise.all([
        api.get(`/users?${params.toString()}`),
        api.get('/catalogs/profiles'),
        api.get('/catalogs/municipalities'),
        api.get('/catalogs/corporations'),
      ])

      setUsers(usersRes.data.data)
      setProfiles(profilesRes.data.data)
      setMunicipalities(municipalitiesRes.data.data)
      setCorporations(corporationsRes.data.data)
    } catch (error: any) {
      showSnackbar('Error al cargar datos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setSelectedMunicipalities(user.municipios.map((m) => m.municipio))
      setSelectedCorporations(user.corporaciones.map((c) => c.corporacion))
      reset({
        nombreUsuario: user.nombreUsuario,
        nombre: user.nombre,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno || '',
        correoElectronico: user.correoElectronico || '',
        perfilId: user.perfil.id,
        accesoTelefoniaHabilitado: user.accesoTelefoniaHabilitado,
        extension: user.extension || '',
        extensionActiva: user.extensionActiva,
      })
    } else {
      setEditingUser(null)
      setSelectedMunicipalities([])
      setSelectedCorporations([])
      reset({
        nombreUsuario: '',
        contrasena: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correoElectronico: '',
        perfilId: '',
        accesoTelefoniaHabilitado: false,
        extension: '',
        extensionActiva: false,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setSelectedMunicipalities([])
    setSelectedCorporations([])
    reset()
  }

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        municipiosIds: selectedMunicipalities.map((m) => m.id),
        corporacionesIds: selectedCorporations.map((c) => c.id),
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload)
        showSnackbar('Usuario actualizado exitosamente', 'success')
      } else {
        await api.post('/users', payload)
        showSnackbar('Usuario creado exitosamente', 'success')
      }

      handleCloseDialog()
      loadData()
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Error al guardar usuario', 'error')
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await api.post(`/users/${id}/toggle-status`)
      showSnackbar('Estado del usuario actualizado', 'success')
      loadData()
    } catch (error: any) {
      showSnackbar('Error al cambiar estado', 'error')
    }
  }

  const handleUnlock = async (id: string) => {
    try {
      await api.post(`/users/${id}/unlock`)
      showSnackbar('Usuario desbloqueado exitosamente', 'success')
      loadData()
    } catch (error: any) {
      showSnackbar('Error al desbloquear usuario', 'error')
    }
  }

  const handleResetPassword = async (id: string) => {
    const nuevaContrasena = prompt('Ingrese la nueva contraseña (mínimo 8 caracteres):')
    if (!nuevaContrasena || nuevaContrasena.length < 8) {
      showSnackbar('La contraseña debe tener al menos 8 caracteres', 'error')
      return
    }

    try {
      await api.post(`/users/${id}/reset-password`, { nuevaContrasena })
      showSnackbar('Contraseña reseteada exitosamente', 'success')
    } catch (error: any) {
      showSnackbar('Error al resetear contraseña', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return

    try {
      await api.delete(`/users/${id}`)
      showSnackbar('Usuario eliminado exitosamente', 'success')
      loadData()
    } catch (error: any) {
      showSnackbar('Error al eliminar usuario', 'error')
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Gestión de Usuarios</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Nuevo Usuario
        </Button>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar"
              placeholder="Usuario, nombre, correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Perfil</InputLabel>
              <Select value={filterProfile} onChange={(e) => setFilterProfile(e.target.value)} label="Perfil">
                <MenuItem value="">Todos</MenuItem>
                {profiles.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Estado">
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Activos</MenuItem>
                <MenuItem value="false">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Perfil</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nombreUsuario}</TableCell>
                <TableCell>
                  {user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}
                </TableCell>
                <TableCell>
                  <Chip label={user.perfil.nombre} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>{user.correoElectronico || '-'}</TableCell>
                <TableCell>
                  {user.estaBloqueado ? (
                    <Chip label="BLOQUEADO" size="small" color="error" />
                  ) : user.estaActivo ? (
                    <Chip label="ACTIVO" size="small" color="success" />
                  ) : (
                    <Chip label="INACTIVO" size="small" color="default" />
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => handleOpenDialog(user)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {user.estaBloqueado && (
                    <Tooltip title="Desbloquear">
                      <IconButton size="small" onClick={() => handleUnlock(user.id)} color="warning">
                        <UnlockIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Resetear Contraseña">
                    <IconButton size="small" onClick={() => handleResetPassword(user.id)} color="info">
                      <ResetPasswordIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={user.estaActivo ? 'Desactivar' : 'Activar'}>
                    <IconButton size="small" onClick={() => handleToggleStatus(user.id)} color="secondary">
                      {user.estaActivo ? <LockIcon fontSize="small" /> : <LockOpen fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" onClick={() => handleDelete(user.id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Crear/Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="nombreUsuario"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre de Usuario *"
                      error={!!errors.nombreUsuario}
                      helperText={errors.nombreUsuario?.message}
                      disabled={!!editingUser}
                    />
                  )}
                />
              </Grid>

              {!editingUser && (
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contrasena"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="password"
                        label="Contraseña *"
                        error={!!errors.contrasena}
                        helperText={errors.contrasena?.message}
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <Controller
                  name="nombre"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre *"
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="apellidoPaterno"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Apellido Paterno *"
                      error={!!errors.apellidoPaterno}
                      helperText={errors.apellidoPaterno?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="apellidoMaterno"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <TextField {...field} fullWidth label="Apellido Materno" />}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="correoElectronico"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Correo Electrónico"
                      error={!!errors.correoElectronico}
                      helperText={errors.correoElectronico?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="perfilId"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.perfilId}>
                      <InputLabel>Perfil *</InputLabel>
                      <Select {...field} label="Perfil *">
                        {profiles.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={municipalities}
                  getOptionLabel={(option) => option.nombre}
                  value={selectedMunicipalities}
                  onChange={(_, newValue) => setSelectedMunicipalities(newValue)}
                  renderInput={(params) => <TextField {...params} label="Municipios" />}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={corporations}
                  getOptionLabel={(option) => option.nombre}
                  value={selectedCorporations}
                  onChange={(_, newValue) => setSelectedCorporations(newValue)}
                  renderInput={(params) => <TextField {...params} label="Corporaciones" />}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="accesoTelefoniaHabilitado"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Acceso por Telefonía" />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="extension"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <TextField {...field} fullWidth label="Extensión" />}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="extensionActiva"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Extensión Activa" />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
