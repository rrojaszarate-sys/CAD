import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export default function DocumentForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Grid container spacing={2}>
      {/* Tipo de Documento */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Documento *</InputLabel>
          <Controller
            name="tipoDocumento"
            control={control}
            defaultValue=""
            rules={{ required: 'El tipo de documento es requerido' }}
            render={({ field }) => (
              <Select {...field} label="Tipo de Documento *" error={!!errors.tipoDocumento}>
                <MenuItem value="INE_IFE">INE/IFE</MenuItem>
                <MenuItem value="LICENCIA_CONDUCIR">Licencia de Conducir</MenuItem>
                <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
                <MenuItem value="ACTA_NACIMIENTO">Acta de Nacimiento</MenuItem>
                <MenuItem value="CURP">CURP</MenuItem>
                <MenuItem value="RFC">RFC</MenuItem>
                <MenuItem value="TARJETA_CREDITO">Tarjeta de Crédito</MenuItem>
                <MenuItem value="TARJETA_DEBITO">Tarjeta de Débito</MenuItem>
                <MenuItem value="TARJETA_CIRCULACION">Tarjeta de Circulación</MenuItem>
                <MenuItem value="FACTURA">Factura</MenuItem>
                <MenuItem value="TITULO_PROPIEDAD">Título de Propiedad</MenuItem>
                <MenuItem value="CONTRATO">Contrato</MenuItem>
                <MenuItem value="CEDULA_PROFESIONAL">Cédula Profesional</MenuItem>
                <MenuItem value="CERTIFICADO_ESTUDIOS">Certificado de Estudios</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Número de Documento */}
      <Grid item xs={12} md={6}>
        <Controller
          name="numeroDocumento"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Número/Folio del Documento" />}
        />
      </Grid>

      {/* Nombre del Titular */}
      <Grid item xs={12} md={6}>
        <Controller
          name="nombreTitular"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Nombre del Titular" />}
        />
      </Grid>

      {/* CURP del Titular */}
      <Grid item xs={12} md={6}>
        <Controller
          name="curpTitular"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="CURP del Titular" inputProps={{ maxLength: 18 }} />}
        />
      </Grid>

      {/* Fecha de Expedición */}
      <Grid item xs={12} md={6}>
        <Controller
          name="fechaExpedicion"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth type="date" label="Fecha de Expedición" InputLabelProps={{ shrink: true }} />}
        />
      </Grid>

      {/* Fecha de Vigencia */}
      <Grid item xs={12} md={6}>
        <Controller
          name="fechaVigencia"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth type="date" label="Fecha de Vigencia" InputLabelProps={{ shrink: true }} />}
        />
      </Grid>

      {/* Autoridad Emisora */}
      <Grid item xs={12} md={6}>
        <Controller
          name="autoridadEmisora"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Autoridad Emisora" />}
        />
      </Grid>

      {/* Entidad Federativa */}
      <Grid item xs={12} md={6}>
        <Controller
          name="entidadEmisora"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Entidad Federativa" />}
        />
      </Grid>

      {/* Estado del Documento */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Estado del Documento</InputLabel>
          <Controller
            name="estadoDocumento"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Estado del Documento">
                <MenuItem value="VIGENTE">Vigente</MenuItem>
                <MenuItem value="VENCIDO">Vencido</MenuItem>
                <MenuItem value="DETERIORADO">Deteriorado</MenuItem>
                <MenuItem value="ILEGIBLE">Ilegible</MenuItem>
                <MenuItem value="INCOMPLETO">Incompleto</MenuItem>
                <MenuItem value="POSIBLE_FALSO">Posible Falsificación</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Documento Físico o Digital */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Formato</InputLabel>
          <Controller
            name="formatoDocumento"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Formato">
                <MenuItem value="FISICO">Físico/Original</MenuItem>
                <MenuItem value="FOTOCOPIA">Fotocopia</MenuItem>
                <MenuItem value="DIGITAL">Digital/Escaneado</MenuItem>
                <MenuItem value="FOTOGRAFIA">Fotografía</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Relación con el Incidente */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Relación con el Incidente</InputLabel>
          <Controller
            name="relacionIncidenteDoc"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Relación con el Incidente">
                <MenuItem value="VICTIMA">Víctima</MenuItem>
                <MenuItem value="SOSPECHOSO">Sospechoso</MenuItem>
                <MenuItem value="TESTIGO">Testigo</MenuItem>
                <MenuItem value="EVIDENCIA">Evidencia</MenuItem>
                <MenuItem value="ROBADO">Robado/Extraviado</MenuItem>
                <MenuItem value="FALSIFICADO">Falsificado</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Documento Asegurado */}
      <Grid item xs={12} md={6}>
        <Controller
          name="documentoAsegurado"
          control={control}
          defaultValue={false}
          render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Documento Asegurado/Retenido" />}
        />
      </Grid>

      {/* Características de Seguridad */}
      <Grid item xs={12}>
        <Controller
          name="caracteristicasSeguridad"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Características de Seguridad Visibles"
              placeholder="Hologramas, marcas de agua, microtextos, etc."
              multiline
              rows={2}
            />
          )}
        />
      </Grid>

      {/* Lugar de Localización */}
      <Grid item xs={12} md={6}>
        <Controller
          name="lugarLocalizacion"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Lugar donde se Localizó" />}
        />
      </Grid>

      {/* Cadena de Custodia */}
      <Grid item xs={12} md={6}>
        <Controller
          name="cadenaCustodiaDoc"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Número de Cadena de Custodia" />}
        />
      </Grid>

      {/* Observaciones */}
      <Grid item xs={12}>
        <Controller
          name="observacionesDocumento"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Observaciones" multiline rows={3} />}
        />
      </Grid>
    </Grid>
  )
}
