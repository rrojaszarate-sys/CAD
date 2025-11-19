import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material'
import { Visibility as SuperIcon } from '@mui/icons-material'

export default function SupervisionPanel() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <SuperIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Panel de Supervisión
      </Typography>

      <Grid container spacing={2}>
        {/* Métricas */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Llamadas Hoy
              </Typography>
              <Typography variant="h3">1,234</Typography>
              <Typography variant="caption" color="success.main">
                72% Procedentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Incidentes Activos
              </Typography>
              <Typography variant="h3">45</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Operadores Activos
              </Typography>
              <Typography variant="h3">12/15</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Tiempo Prom. Resp.
              </Typography>
              <Typography variant="h3">4:35</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Alertas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Alertas Pendientes (3)
            </Typography>
            <Typography color="text.secondary">
              Sistema de alertas para restricciones, medidas cautelares y GEAVI
            </Typography>
          </Paper>
        </Grid>

        {/* Restricciones Telefónicas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Gestión de Restricciones Telefónicas
            </Typography>
            <Typography color="text.secondary">
              Administración de números restringidos (6 tipos)
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
