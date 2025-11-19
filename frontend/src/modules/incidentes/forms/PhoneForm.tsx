import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export default function PhoneForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Grid container spacing={2}>
      {/* Número de Teléfono */}
      <Grid item xs={12} md={6}>
        <Controller
          name="numeroTelefono"
          control={control}
          defaultValue=""
          rules={{ required: 'El número de teléfono es requerido' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Número de Teléfono *"
              error={!!errors.numeroTelefono}
              helperText={errors.numeroTelefono?.message as string}
              inputProps={{ maxLength: 15 }}
            />
          )}
        />
      </Grid>

      {/* Tipo de Teléfono */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Teléfono *</InputLabel>
          <Controller
            name="tipoTelefono"
            control={control}
            defaultValue=""
            rules={{ required: 'El tipo es requerido' }}
            render={({ field }) => (
              <Select {...field} label="Tipo de Teléfono *" error={!!errors.tipoTelefono}>
                <MenuItem value="CELULAR">Celular</MenuItem>
                <MenuItem value="FIJO">Fijo</MenuItem>
                <MenuItem value="OFICINA">Oficina</MenuItem>
                <MenuItem value="PUBLICO">Público</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Compañía */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Compañía</InputLabel>
          <Controller
            name="compania"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Compañía">
                <MenuItem value="">Desconocida</MenuItem>
                <MenuItem value="TELCEL">Telcel</MenuItem>
                <MenuItem value="MOVISTAR">Movistar</MenuItem>
                <MenuItem value="AT&T">AT&T</MenuItem>
                <MenuItem value="TELMEX">Telmex</MenuItem>
                <MenuItem value="TOTALPLAY">Totalplay</MenuItem>
                <MenuItem value="MEGACABLE">Megacable</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Propietario del Teléfono */}
      <Grid item xs={12} md={6}>
        <Controller
          name="propietarioTelefono"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Propietario del Teléfono" />}
        />
      </Grid>

      {/* Relación con el Incidente */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Relación con el Incidente</InputLabel>
          <Controller
            name="relacionIncidente"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Relación con el Incidente">
                <MenuItem value="REPORTANTE">Reportante</MenuItem>
                <MenuItem value="VICTIMA">Víctima</MenuItem>
                <MenuItem value="SOSPECHOSO">Sospechoso</MenuItem>
                <MenuItem value="TESTIGO">Testigo</MenuItem>
                <MenuItem value="CONTACTO">Contacto</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Verificado */}
      <Grid item xs={12} md={6}>
        <Controller
          name="telefonoVerificado"
          control={control}
          defaultValue={false}
          render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Teléfono Verificado" />}
        />
      </Grid>

      {/* Teléfono Activo */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Estado del Teléfono</InputLabel>
          <Controller
            name="estadoTelefono"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Estado del Teléfono">
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="FUERA_SERVICIO">Fuera de Servicio</MenuItem>
                <MenuItem value="NO_CONTESTA">No Contesta</MenuItem>
                <MenuItem value="INVALIDO">Inválido</MenuItem>
                <MenuItem value="BLOQUEADO">Bloqueado</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Tipo de Línea */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Línea</InputLabel>
          <Controller
            name="tipoLinea"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Tipo de Línea">
                <MenuItem value="PREPAGO">Prepago</MenuItem>
                <MenuItem value="POSPAGO">Pospago</MenuItem>
                <MenuItem value="DESCONOCIDO">Desconocido</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* IMEI (para celulares) */}
      <Grid item xs={12} md={6}>
        <Controller
          name="imei"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="IMEI (si aplica)" inputProps={{ maxLength: 15 }} />}
        />
      </Grid>

      {/* Dirección Asociada */}
      <Grid item xs={12}>
        <Controller
          name="direccionAsociada"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Dirección Asociada al Teléfono" />}
        />
      </Grid>

      {/* Observaciones */}
      <Grid item xs={12}>
        <Controller
          name="observacionesTelefono"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Observaciones" multiline rows={3} />}
        />
      </Grid>
    </Grid>
  )
}
