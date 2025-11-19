import { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
} from '@mui/material'

interface VehicleFormProps {
  onSave: (vehicle: any) => void
  onCancel: () => void
}

export default function VehicleForm({ onSave, onCancel }: VehicleFormProps) {
  const [data, setData] = useState({
    plates: '',
    vin: '',
    vehicleType: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    secondaryColor: '',
    status: '',
    distinguishingMarks: '',
    notes: '',
  })

  const handleSubmit = () => {
    if (!data.plates || !data.vehicleType) {
      alert('Placas y tipo de vehículo son requeridos')
      return
    }
    onSave(data)
  }

  const update = (field: string, value: any) => {
    setData({ ...data, [field]: value })
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Agregar Vehículo Involucrado
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Placas *"
            value={data.plates}
            onChange={(e) => update('plates', e.target.value.toUpperCase())}
            placeholder="ABC-123-D"
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="NIV/Serie *"
            value={data.vin}
            onChange={(e) => update('vin', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Tipo *"
            value={data.vehicleType}
            onChange={(e) => update('vehicleType', e.target.value)}
            required
          >
            <MenuItem value="Automóvil">Automóvil</MenuItem>
            <MenuItem value="Camioneta">Camioneta</MenuItem>
            <MenuItem value="Motocicleta">Motocicleta</MenuItem>
            <MenuItem value="Camión">Camión</MenuItem>
            <MenuItem value="Otro">Otro</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Marca"
            value={data.brand}
            onChange={(e) => update('brand', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Submarca/Modelo"
            value={data.model}
            onChange={(e) => update('model', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Año"
            type="number"
            value={data.year}
            onChange={(e) => update('year', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Color Principal"
            value={data.color}
            onChange={(e) => update('color', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Estado del Vehículo"
            value={data.status}
            onChange={(e) => update('status', e.target.value)}
          >
            <MenuItem value="Involucrado">Involucrado</MenuItem>
            <MenuItem value="Robado">Robado</MenuItem>
            <MenuItem value="Recuperado">Recuperado</MenuItem>
            <MenuItem value="Dañado">Dañado</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Señas Particulares"
            value={data.distinguishingMarks}
            onChange={(e) => update('distinguishingMarks', e.target.value)}
            placeholder="Calcomanías, golpes, modificaciones"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas"
            value={data.notes}
            onChange={(e) => update('notes', e.target.value)}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>
              Guardar
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              Cancelar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}
