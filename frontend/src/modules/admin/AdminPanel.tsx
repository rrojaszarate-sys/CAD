import { Box, Grid, Paper, Typography, List, ListItemButton, ListItemText } from '@mui/material'
import { Settings as AdminIcon } from '@mui/icons-material'

export default function AdminPanel() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <AdminIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Administración del Sistema
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              👥 Usuarios
            </Typography>
            <List>
              <ListItemButton>
                <ListItemText primary="Gestión de usuarios" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Perfiles y permisos" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Extensiones telefónicas" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              📋 Catálogos
            </Typography>
            <List>
              <ListItemButton>
                <ListItemText primary="Tipos de incidentes" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Corporaciones" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Colonias y calles" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Municipios" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              ⚙️ Sistema
            </Typography>
            <List>
              <ListItemButton>
                <ListItemText primary="Configuración general" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Respaldos" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Logs de auditoría" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
