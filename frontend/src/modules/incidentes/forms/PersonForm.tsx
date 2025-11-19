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

interface PersonFormProps {
  onSave: (person: any) => void
  onCancel: () => void
}

export default function PersonForm({ onSave, onCancel }: PersonFormProps) {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    alias: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    complexion: '',
    skinTone: '',
    hairColor: '',
    eyeColor: '',
    distinguishingMarks: '',
    role: '',
    status: '',
    notes: '',
  })

  const handleSubmit = () => {
    if (!data.firstName || !data.lastName || !data.role) {
      alert('Nombre, apellido paterno y tipo de implicación son requeridos')
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
        Agregar Persona Involucrada
      </Typography>

      <Grid container spacing={2}>
        {/* Datos Básicos */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Datos Básicos *
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Nombre *"
            value={data.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Apellido Paterno *"
            value={data.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Apellido Materno"
            value={data.middleName}
            onChange={(e) => update('middleName', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Alias/Apodo"
            value={data.alias}
            onChange={(e) => update('alias', e.target.value)}
          />
        </Grid>

        {/* Características Físicas */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Características Físicas
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            select
            label="Sexo"
            value={data.gender}
            onChange={(e) => update('gender', e.target.value)}
          >
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Femenino</MenuItem>
            <MenuItem value="O">Otro</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Edad (años)"
            type="number"
            value={data.age}
            onChange={(e) => update('age', e.target.value)}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Estatura (cm)"
            type="number"
            value={data.height}
            onChange={(e) => update('height', e.target.value)}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Peso (kg)"
            type="number"
            value={data.weight}
            onChange={(e) => update('weight', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Complexión"
            value={data.complexion}
            onChange={(e) => update('complexion', e.target.value)}
          >
            <MenuItem value="Delgada">Delgada</MenuItem>
            <MenuItem value="Media">Media</MenuItem>
            <MenuItem value="Robusta">Robusta</MenuItem>
            <MenuItem value="Atlética">Atlética</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Tez"
            value={data.skinTone}
            onChange={(e) => update('skinTone', e.target.value)}
          >
            <MenuItem value="Clara">Clara</MenuItem>
            <MenuItem value="Morena">Morena</MenuItem>
            <MenuItem value="Morena Clara">Morena Clara</MenuItem>
            <MenuItem value="Morena Oscura">Morena Oscura</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Señas Particulares"
            value={data.distinguishingMarks}
            onChange={(e) => update('distinguishingMarks', e.target.value)}
            multiline
            rows={2}
            placeholder="Tatuajes, cicatrices, lunares, etc."
          />
        </Grid>

        {/* Tipo de Implicación */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Tipo de Implicación *
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Rol *"
            value={data.role}
            onChange={(e) => update('role', e.target.value)}
            required
          >
            <MenuItem value="Víctima">Víctima</MenuItem>
            <MenuItem value="Agresor">Agresor</MenuItem>
            <MenuItem value="Testigo">Testigo</MenuItem>
            <MenuItem value="Detenido">Detenido</MenuItem>
            <MenuItem value="Lesionado">Lesionado</MenuItem>
            <MenuItem value="Fallecido">Fallecido</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Estado"
            value={data.status}
            onChange={(e) => update('status', e.target.value)}
          >
            <MenuItem value="Consciente">Consciente</MenuItem>
            <MenuItem value="Inconsciente">Inconsciente</MenuItem>
            <MenuItem value="Alterado">Alterado</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas Adicionales"
            value={data.notes}
            onChange={(e) => update('notes', e.target.value)}
            multiline
            rows={2}
          />
        </Grid>

        {/* Botones */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>
              Guardar y Cerrar
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
