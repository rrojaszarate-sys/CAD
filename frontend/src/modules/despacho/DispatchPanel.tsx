import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
} from '@mui/material'
import {
  RadioButtonChecked as DispIcon,
  Assignment as AssignmentIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material'

const UNIT_STATUS_COLORS: Record<string, string> = {
  DISPONIBLE: '#4caf50',
  EN_CAMINO: '#ffeb3b',
  EN_LUGAR: '#ff9800',
  NO_DISPONIBLE: '#9e9e9e',
}

export default function DispatchPanel() {
  const mockIncidents = [
    { id: '1', folio: 'EDOMEX/1/001', type: 'Robo', priority: 'ALTA', status: 'PENDIENTE' },
    { id: '2', folio: 'EDOMEX/1/002', type: 'Accidente', priority: 'CRITICA', status: 'ASIGNADO' },
  ]

  const mockUnits = [
    { id: '1', economic: 'PM-101', status: 'DISPONIBLE', sector: 'Norte', mission: null },
    { id: '2', economic: 'PM-102', status: 'EN_CAMINO', sector: 'Centro', mission: '#001' },
    { id: '3', economic: 'PM-103', status: 'EN_LUGAR', sector: 'Sur', mission: '#002' },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <DispIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Panel de Despacho
      </Typography>

      <Grid container spacing={2}>
        {/* Columna Incidentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Incidentes Pendientes
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Folio</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Prioridad</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockIncidents.map((inc) => (
                  <TableRow key={inc.id}>
                    <TableCell>{inc.folio}</TableCell>
                    <TableCell>{inc.type}</TableCell>
                    <TableCell>
                      <Chip label={inc.priority} size="small" color="error" />
                    </TableCell>
                    <TableCell>{inc.status}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Columna Unidades */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Unidades de Fuerza
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Económico</TableCell>
                  <TableCell>Estatus</TableCell>
                  <TableCell>Sector</TableCell>
                  <TableCell>Misión</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>{unit.economic}</TableCell>
                    <TableCell>
                      <Chip
                        label={unit.status}
                        size="small"
                        sx={{
                          bgcolor: UNIT_STATUS_COLORS[unit.status],
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>{unit.sector}</TableCell>
                    <TableCell>{unit.mission || '---'}</TableCell>
                    <TableCell>
                      {unit.status === 'DISPONIBLE' ? (
                        <Button size="small" variant="contained">
                          Asignar
                        </Button>
                      ) : (
                        <IconButton size="small">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Detalle de Incidente Seleccionado */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Detalle de Incidente</Typography>
            <Typography color="text.secondary">
              Seleccione un incidente para ver detalles y asignar unidades
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
