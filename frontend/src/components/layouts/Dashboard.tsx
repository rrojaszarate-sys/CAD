import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@store/index'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  LocalShipping as DespachoIcon,
  Visibility as SupervisionIcon,
  Settings as AdminIcon,
  Assessment as ReportesIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '@store/slices/authSlice'
import authService from '@services/authService'

const drawerWidth = 260

interface MenuItemType {
  text: string
  icon: React.ReactElement
  path: string
  profiles: string[]
}

const menuItems: MenuItemType[] = [
  {
    text: 'Panel Principal',
    icon: <DashboardIcon />,
    path: '/dashboard',
    profiles: ['Administrador', 'Supervisor', 'Operador', 'Despachador'],
  },
  {
    text: 'Llamadas',
    icon: <PhoneIcon />,
    path: '/dashboard/llamadas',
    profiles: ['Operador', 'Supervisor', 'Administrador'],
  },
  {
    text: 'Incidentes',
    icon: <AssignmentIcon />,
    path: '/dashboard/incidentes',
    profiles: ['Operador', 'Despachador', 'Supervisor', 'Administrador'],
  },
  {
    text: 'Despacho',
    icon: <DespachoIcon />,
    path: '/dashboard/despacho',
    profiles: ['Despachador', 'Supervisor', 'Administrador'],
  },
  {
    text: 'Supervisión',
    icon: <SupervisionIcon />,
    path: '/dashboard/supervision',
    profiles: ['Supervisor', 'Administrador'],
  },
  {
    text: 'Administración',
    icon: <AdminIcon />,
    path: '/dashboard/admin',
    profiles: ['Administrador'],
  },
  {
    text: 'Reportes',
    icon: <ReportesIcon />,
    path: '/dashboard/reportes',
    profiles: ['Supervisor', 'Administrador'],
  },
]

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      dispatch(logout())
      navigate('/login')
    }
  }

  // Filtrar menú según perfil
  const filteredMenuItems = menuItems.filter((item) =>
    item.profiles.includes(user?.profile.name || '')
  )

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" fontWeight={600}>
          Sistema CAD
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.profile.name}
          </Typography>

          {/* User info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.firstName.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem disabled>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{user?.username}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cerrar Sesión</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          overflow: 'auto',
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/llamadas" element={<div>Módulo de Llamadas (En desarrollo)</div>} />
          <Route path="/incidentes" element={<div>Módulo de Incidentes (En desarrollo)</div>} />
          <Route path="/despacho" element={<div>Módulo de Despacho (En desarrollo)</div>} />
          <Route path="/supervision" element={<div>Módulo de Supervisión (En desarrollo)</div>} />
          <Route path="/admin" element={<div>Módulo de Administración (En desarrollo)</div>} />
          <Route path="/reportes" element={<div>Módulo de Reportes (En desarrollo)</div>} />
        </Routes>
      </Box>
    </Box>
  )
}

// Componente placeholder para el home
function DashboardHome() {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {user?.firstName}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Perfil: {user?.profile.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Sistema CAD - Panel de Control en Desarrollo
      </Typography>
    </Box>
  )
}

export default Dashboard
