import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export default function SubstanceForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Grid container spacing={2}>
      {/* Tipo de Sustancia */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Sustancia *</InputLabel>
          <Controller
            name="tipoSustancia"
            control={control}
            defaultValue=""
            rules={{ required: 'El tipo de sustancia es requerido' }}
            render={({ field }) => (
              <Select {...field} label="Tipo de Sustancia *" error={!!errors.tipoSustancia}>
                <MenuItem value="NARCOTICO">Narcótico</MenuItem>
                <MenuItem value="ESTIMULANTE">Estimulante</MenuItem>
                <MenuItem value="DEPRESIVO">Depresivo</MenuItem>
                <MenuItem value="ALUCINOGENO">Alucinógeno</MenuItem>
                <MenuItem value="INHALANTE">Inhalante</MenuItem>
                <MenuItem value="PRECURSOR">Precursor Químico</MenuItem>
                <MenuItem value="MEDICAMENTO">Medicamento Controlado</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Sustancia Específica */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Sustancia Específica</InputLabel>
          <Controller
            name="sustanciaEspecifica"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Sustancia Específica">
                <MenuItem value="MARIHUANA">Marihuana</MenuItem>
                <MenuItem value="COCAINA">Cocaína</MenuItem>
                <MenuItem value="HEROINA">Heroína</MenuItem>
                <MenuItem value="METANFETAMINA">Metanfetamina</MenuItem>
                <MenuItem value="CRISTAL">Cristal</MenuItem>
                <MenuItem value="CRACK">Crack</MenuItem>
                <MenuItem value="EXTASIS">Éxtasis</MenuItem>
                <MenuItem value="LSD">LSD</MenuItem>
                <MenuItem value="FENTANILO">Fentanilo</MenuItem>
                <MenuItem value="OPIACEOS">Opiáceos</MenuItem>
                <MenuItem value="BENZODIACEPINAS">Benzodiacepinas</MenuItem>
                <MenuItem value="DESCONOCIDA">Desconocida</MenuItem>
                <MenuItem value="OTRA">Otra</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Presentación */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Presentación</InputLabel>
          <Controller
            name="presentacion"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Presentación">
                <MenuItem value="POLVO">Polvo</MenuItem>
                <MenuItem value="PIEDRA">Piedra/Roca</MenuItem>
                <MenuItem value="LIQUIDO">Líquido</MenuItem>
                <MenuItem value="PASTILLAS">Pastillas</MenuItem>
                <MenuItem value="CAPSULAS">Cápsulas</MenuItem>
                <MenuItem value="VEGETALES">Vegetales/Hierba</MenuItem>
                <MenuItem value="CRISTALES">Cristales</MenuItem>
                <MenuItem value="PAPEL">Papel (LSD)</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Empaque */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Empaque</InputLabel>
          <Controller
            name="empaque"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Empaque">
                <MenuItem value="BOLSA_PLASTICO">Bolsa de Plástico</MenuItem>
                <MenuItem value="BOLSA_CELOFAN">Bolsa de Celofán</MenuItem>
                <MenuItem value="FRASCO">Frasco</MenuItem>
                <MenuItem value="BLISTER">Blíster</MenuItem>
                <MenuItem value="CAJA">Caja</MenuItem>
                <MenuItem value="PAPEL_ALUMINIO">Papel Aluminio</MenuItem>
                <MenuItem value="SIN_EMPAQUE">Sin Empaque</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Cantidad */}
      <Grid item xs={12} md={4}>
        <Controller
          name="cantidadSustancia"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth type="number" label="Cantidad" inputProps={{ step: '0.01' }} />}
        />
      </Grid>

      {/* Unidad de Medida */}
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Unidad</InputLabel>
          <Controller
            name="unidadMedida"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Unidad">
                <MenuItem value="GRAMOS">Gramos (g)</MenuItem>
                <MenuItem value="KILOGRAMOS">Kilogramos (kg)</MenuItem>
                <MenuItem value="MILIGRAMOS">Miligramos (mg)</MenuItem>
                <MenuItem value="LITROS">Litros (L)</MenuItem>
                <MenuItem value="MILILITROS">Mililitros (mL)</MenuItem>
                <MenuItem value="PIEZAS">Piezas</MenuItem>
                <MenuItem value="DOSIS">Dosis</MenuItem>
                <MenuItem value="ENVOLTORIOS">Envoltorios</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* Peso Aproximado */}
      <Grid item xs={12} md={4}>
        <Controller
          name="pesoAproximado"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth type="number" label="Peso (g)" inputProps={{ step: '0.01' }} />}
        />
      </Grid>

      {/* Color */}
      <Grid item xs={12} md={6}>
        <Controller
          name="colorSustancia"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Color" />}
        />
      </Grid>

      {/* Olor */}
      <Grid item xs={12} md={6}>
        <Controller
          name="olorSustancia"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Olor Característico" />}
        />
      </Grid>

      {/* Asegurada */}
      <Grid item xs={12} md={6}>
        <Controller
          name="sustanciaAsegurada"
          control={control}
          defaultValue={false}
          render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Sustancia Asegurada" />}
        />
      </Grid>

      {/* Requiere Análisis */}
      <Grid item xs={12} md={6}>
        <Controller
          name="requiereAnalisis"
          control={control}
          defaultValue={true}
          render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Requiere Análisis de Laboratorio" />}
        />
      </Grid>

      {/* Lugar de Aseguramiento */}
      <Grid item xs={12}>
        <Controller
          name="lugarAseguramientoSustancia"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Lugar de Aseguramiento" />}
        />
      </Grid>

      {/* Portador/Propietario */}
      <Grid item xs={12} md={6}>
        <Controller
          name="portadorSustancia"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Portador/Propietario" />}
        />
      </Grid>

      {/* Cadena de Custodia */}
      <Grid item xs={12} md={6}>
        <Controller
          name="cadenaCustodia"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Número de Cadena de Custodia" />}
        />
      </Grid>

      {/* Observaciones */}
      <Grid item xs={12}>
        <Controller
          name="observacionesSustancia"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} fullWidth label="Observaciones" multiline rows={3} />}
        />
      </Grid>
    </Grid>
  )
}
