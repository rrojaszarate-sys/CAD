import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export default function WeaponForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Grid container spacing={2}>
      {/* Tipo de Arma */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Arma *</InputLabel>
          <Controller
            name="tipoArma"
            control={control}
            defaultValue=""
            rules={{ required: 'El tipo de arma es requerido' }}
            render={({ field }) => (
              <Select {...field} label="Tipo de Arma *" error={!!errors.tipoArma}>
                <MenuItem value="ARMA_FUEGO">Arma de Fuego</MenuItem>
                <MenuItem value="ARMA_BLANCA">Arma Blanca</MenuItem>
                <MenuItem value="CONTUNDENTE">Arma Contundente</MenuItem>
                <MenuItem value="EXPLOSIVO">Explosivo</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Subtipo */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Subtipo</InputLabel>
          <Controller
            name="subtipoArma"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Subtipo">
                {/* Armas de Fuego */}
                <MenuItem value="PISTOLA">Pistola</MenuItem>
                <MenuItem value="REVOLVER">Revólver</MenuItem>
                <MenuItem value="RIFLE">Rifle</MenuItem>
                <MenuItem value="ESCOPETA">Escopeta</MenuItem>
                <MenuItem value="SUBFUSIL">Subfusil</MenuItem>
                {/* Armas Blancas */}
                <MenuItem value="CUCHILLO">Cuchillo</MenuItem>
                <MenuItem value="NAVAJA">Navaja</MenuItem>
                <MenuItem value="MACHETE">Machete</MenuItem>
                <MenuItem value="HACHA">Hacha</MenuItem>
                {/* Contundentes */}
                <MenuItem value="BATE">Bate</MenuItem>
                <MenuItem value="TUBO">Tubo</MenuItem>
                <MenuItem value="PIEDRA">Piedra</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Marca */}
      <Grid item xs={12} md={4}>
        <Controller
          name="marcaArma"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Marca" />}
        />
      </Grid>

      {/* Calibre */}
      <Grid item xs={12} md={4}>
        <Controller
          name="calibre"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Calibre" />}
        />
      </Grid>

      {/* Modelo */}
      <Grid item xs={12} md={4}>
        <Controller
          name="modeloArma"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Modelo" />}
        />
      </Grid>

      {/* Número de Serie */}
      <Grid item xs={12} md={6}>
        <Controller
          name="numeroSerieArma"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Número de Serie" />}
        />
      </Grid>

      {/* Matrícula */}
      <Grid item xs={12} md={6}>
        <Controller
          name="matriculaArma"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Matrícula" />}
        />
      </Grid>

      {/* Color */}
      <Grid item xs={12} md={4}>
        <Controller
          name="colorArma"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Color" />}
        />
      </Grid>

      {/* Material */}
      <Grid item xs={12} md={4}>
        <Controller
          name="materialArma"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Material" />}
        />
      </Grid>

      {/* Longitud Aproximada */}
      <Grid item xs={12} md={4}>
        <Controller
          name="longitudArma"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Longitud (cm)" type="number" />}
        />
      </Grid>

      {/* Estado del Arma */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Controller
            name="estadoArma"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Estado">
                <MenuItem value="BUENO">Bueno</MenuItem>
                <MenuItem value="REGULAR">Regular</MenuItem>
                <MenuItem value="DETERIORADO">Deteriorado</MenuItem>
                <MenuItem value="OXIDADO">Oxidado</MenuItem>
                <MenuItem value="INOPERABLE">Inoperable</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Cargadores */}
      <Grid item xs={12} md={3}>
        <Controller
          name="numeroCargadores"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth type="number" label="Núm. Cargadores" />}
        />
      </Grid>

      {/* Cartuchos */}
      <Grid item xs={12} md={3}>
        <Controller
          name="numeroCartuchos"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth type="number" label="Núm. Cartuchos" />}
        />
      </Grid>

      {/* Asegurada */}
      <Grid item xs={12} md={6}>
        <Controller
          name="armaAsegurada"
          control={control}
          defaultValue={false}
          render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Arma Asegurada" />}
        />
      </Grid>

      {/* Portador */}
      <Grid item xs={12} md={6}>
        <Controller
          name="portadorArma"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Portador del Arma" />}
        />
      </Grid>

      {/* Documentación */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Documentación</InputLabel>
          <Controller
            name="documentacionArma"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Documentación">
                <MenuItem value="LICENCIA_PORTACION">Licencia de Portación</MenuItem>
                <MenuItem value="LICENCIA_COLECCION">Licencia de Colección</MenuItem>
                <MenuItem value="SIN_DOCUMENTACION">Sin Documentación</MenuItem>
                <MenuItem value="DESCONOCIDO">Desconocido</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Lugar de Aseguramiento */}
      <Grid item xs={12} md={6}>
        <Controller
          name="lugarAseguramiento"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Lugar de Aseguramiento" />}
        />
      </Grid>

      {/* Observaciones */}
      <Grid item xs={12}>
        <Controller
          name="observacionesArma"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Observaciones" multiline rows={3} />}
        />
      </Grid>
    </Grid>
  )
}
