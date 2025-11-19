import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from '@mui/material'
import { Assessment as ReportIcon, Download as DownloadIcon } from '@mui/icons-material'

export default function ReportsPanel() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <ReportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Generador de Reportes
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Tipo de Reporte */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              TIPO DE REPORTE
            </Typography>
            <RadioGroup defaultValue="incidentes">
              <FormControlLabel
                value="incidentes"
                control={<Radio />}
                label="Reporte de Incidentes"
              />
              <FormControlLabel
                value="operadores"
                control={<Radio />}
                label="Estadísticas de Operadores"
              />
              <FormControlLabel
                value="unidades"
                control={<Radio />}
                label="Desempeño de Unidades"
              />
              <FormControlLabel
                value="llamadas"
                control={<Radio />}
                label="Análisis de Llamadas"
              />
              <FormControlLabel
                value="ejecutivo"
                control={<Radio />}
                label="Reporte Ejecutivo"
              />
            </RadioGroup>
          </Grid>

          {/* Periodo */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              PERIODO
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth type="date" label="Desde" InputLabelProps={{ shrink: true }} />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth type="date" label="Hasta" InputLabelProps={{ shrink: true }} />
          </Grid>

          {/* Filtros */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Incidente</InputLabel>
              <Select label="Tipo de Incidente">
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="robo">Robo</MenuItem>
                <MenuItem value="accidente">Accidente</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Corporación</InputLabel>
              <Select label="Corporación">
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="pm">Policía Municipal</MenuItem>
                <MenuItem value="pe">Policía Estatal</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Formato */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              FORMATO DE SALIDA
            </Typography>
            <RadioGroup row defaultValue="pdf">
              <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
              <FormControlLabel value="excel" control={<Radio />} label="Excel" />
              <FormControlLabel value="csv" control={<Radio />} label="CSV" />
            </RadioGroup>
          </Grid>

          {/* Opciones */}
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox />} label="Incluir gráficos" />
            <FormControlLabel control={<Checkbox />} label="Incluir detalles" />
            <FormControlLabel control={<Checkbox />} label="Agrupar por tipo" />
          </Grid>

          {/* Botones */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" startIcon={<DownloadIcon />} fullWidth>
                GENERAR REPORTE
              </Button>
              <Button variant="outlined">PROGRAMAR</Button>
              <Button variant="outlined">CANCELAR</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
