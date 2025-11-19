import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { Phone as PhoneIcon } from '@mui/icons-material'

interface CallerData {
  firstName?: string
  lastName?: string
  middleName?: string
  phone?: string
  alternativePhone?: string
  relation?: string
  requiresFollowup: boolean
  isAnonymous: boolean
}

interface CallerWidgetProps {
  value?: CallerData
  onChange: (data: CallerData) => void
  defaultPhone?: string
}

const RELATIONS = [
  'Víctima',
  'Testigo',
  'Familiar',
  'Anónimo',
  'Tercero',
  'Autoridad',
]

export default function CallerWidget({
  value,
  onChange,
  defaultPhone,
}: CallerWidgetProps) {
  const [data, setData] = useState<CallerData>(
    value || {
      requiresFollowup: false,
      isAnonymous: false,
    }
  )

  const handleChange = (field: keyof CallerData, newValue: any) => {
    const newData = { ...data, [field]: newValue }
    setData(newData)
    onChange(newData)
  }

  const handleAnonymousChange = (isAnon: boolean) => {
    if (isAnon) {
      const anonymousData: CallerData = {
        relation: 'Anónimo',
        requiresFollowup: false,
        isAnonymous: true,
      }
      setData(anonymousData)
      onChange(anonymousData)
    } else {
      const normalData: CallerData = {
        ...data,
        isAnonymous: false,
        relation: '',
      }
      setData(normalData)
      onChange(normalData)
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PhoneIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Datos del Llamante</Typography>
        </Box>

        {/* Checkbox Anónimo */}
        <FormControlLabel
          control={
            <Checkbox
              checked={data.isAnonymous}
              onChange={(e) => handleAnonymousChange(e.target.checked)}
            />
          }
          label="No proporciona datos (anónimo)"
          sx={{ mb: 2 }}
        />

        {!data.isAnonymous && (
          <>
            {/* Nombre */}
            <TextField
              fullWidth
              label="Nombre"
              value={data.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Apellido Paterno */}
            <TextField
              fullWidth
              label="Apellido Paterno"
              value={data.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Apellido Materno */}
            <TextField
              fullWidth
              label="Apellido Materno"
              value={data.middleName || ''}
              onChange={(e) => handleChange('middleName', e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Teléfono */}
            <TextField
              fullWidth
              label="Teléfono"
              value={data.phone || defaultPhone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="55-1234-5678"
              helperText="Auto-llenado desde ANI"
              sx={{ mb: 2 }}
            />

            {/* Teléfono alternativo */}
            <TextField
              fullWidth
              label="Teléfono alternativo"
              value={data.alternativePhone || ''}
              onChange={(e) => handleChange('alternativePhone', e.target.value)}
              placeholder="55-1234-5678"
              sx={{ mb: 2 }}
            />

            {/* Relación con incidente */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Relación con incidente</InputLabel>
              <Select
                value={data.relation || ''}
                onChange={(e) => handleChange('relation', e.target.value)}
                label="Relación con incidente"
              >
                {RELATIONS.map((rel) => (
                  <MenuItem key={rel} value={rel}>
                    {rel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Requiere seguimiento */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.requiresFollowup}
                  onChange={(e) => handleChange('requiresFollowup', e.target.checked)}
                />
              }
              label="Requiere seguimiento"
            />
          </>
        )}

        {data.isAnonymous && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'warning.light',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="warning.dark">
              Llamada anónima - No se registrarán datos del llamante
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
