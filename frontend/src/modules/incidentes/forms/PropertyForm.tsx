import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export default function PropertyForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Grid container spacing={2}>
      {/* Tipo de Inmueble */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Inmueble *</InputLabel>
          <Controller
            name="tipoInmueble"
            control={control}
            defaultValue=""
            rules={{ required: 'El tipo de inmueble es requerido' }}
            render={({ field }) => (
              <Select {...field} label="Tipo de Inmueble *" error={!!errors.tipoInmueble}>
                <MenuItem value="CASA">Casa</MenuItem>
                <MenuItem value="DEPARTAMENTO">Departamento</MenuItem>
                <MenuItem value="LOCAL_COMERCIAL">Local Comercial</MenuItem>
                <MenuItem value="EDIFICIO">Edificio</MenuItem>
                <MenuItem value="TERRENO">Terreno</MenuItem>
                <MenuItem value="BODEGA">Bodega</MenuItem>
                <MenuItem value="OFICINA">Oficina</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Uso del Inmueble */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Uso</InputLabel>
          <Controller
            name="usoInmueble"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Uso">
                <MenuItem value="HABITACIONAL">Habitacional</MenuItem>
                <MenuItem value="COMERCIAL">Comercial</MenuItem>
                <MenuItem value="INDUSTRIAL">Industrial</MenuItem>
                <MenuItem value="MIXTO">Mixto</MenuItem>
                <MenuItem value="DESHABITADO">Deshabitado</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Calle */}
      <Grid item xs={12} md={6}>
        <Controller
          name="calleInmueble"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Calle" />}
        />
      </Grid>

      {/* Número Exterior */}
      <Grid item xs={12} md={3}>
        <Controller
          name="numeroExterior"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Núm. Exterior" />}
        />
      </Grid>

      {/* Número Interior */}
      <Grid item xs={12} md={3}>
        <Controller
          name="numeroInterior"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Núm. Interior" />}
        />
      </Grid>

      {/* Colonia */}
      <Grid item xs={12} md={6}>
        <Controller
          name="coloniaInmueble"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Colonia" />}
        />
      </Grid>

      {/* Código Postal */}
      <Grid item xs={12} md={3}>
        <Controller
          name="codigoPostalInmueble"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="C.P." inputProps={{ maxLength: 5 }} />}
        />
      </Grid>

      {/* Municipio */}
      <Grid item xs={12} md={3}>
        <Controller
          name="municipioInmueble"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Municipio" />}
        />
      </Grid>

      {/* Referencias */}
      <Grid item xs={12}>
        <Controller
          name="referenciasInmueble"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Referencias del Inmueble" multiline rows={2} />}
        />
      </Grid>

      {/* Color o Características */}
      <Grid item xs={12} md={6}>
        <Controller
          name="colorFachada"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Color de Fachada" />}
        />
      </Grid>

      {/* Número de Niveles */}
      <Grid item xs={12} md={3}>
        <Controller
          name="numeroNiveles"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth type="number" label="Niveles" />}
        />
      </Grid>

      {/* Estado del Inmueble */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Controller
            name="estadoInmueble"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Estado">
                <MenuItem value="BUENO">Bueno</MenuItem>
                <MenuItem value="REGULAR">Regular</MenuItem>
                <MenuItem value="MALO">Malo</MenuItem>
                <MenuItem value="EN_CONSTRUCCION">En Construcción</MenuItem>
                <MenuItem value="ABANDONADO">Abandonado</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Propietario Conocido */}
      <Grid item xs={12} md={6}>
        <Controller
          name="propietarioConocido"
          control={control}
          defaultValue={false}
          render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Propietario Conocido" />}
        />
      </Grid>

      {/* Datos del Propietario */}
      <Grid item xs={12} md={6}>
        <Controller
          name="nombrePropietario"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Nombre del Propietario" />}
        />
      </Grid>

      {/* Observaciones */}
      <Grid item xs={12}>
        <Controller
          name="observacionesInmueble"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Observaciones" multiline rows={3} />}
        />
      </Grid>
    </Grid>
  )
}
