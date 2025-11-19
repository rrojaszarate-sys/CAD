import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Chip,
  Divider,
} from '@mui/material'
import { Phone as PhoneIcon, Map as MapIcon } from '@mui/icons-material'
import { useState } from 'react'

interface IncomingCallPopupProps {
  open: boolean
  onClose: () => void
  callData?: {
    phoneNumber: string
    phoneType: string
    carrier: string
    street?: string
    colony?: string
    coordinates?: { lat: number; lng: number }
    restriction?: { type: string; color: string }
  }
}

const RESTRICTION_COLORS: Record<string, string> = {
  BROMA: '#000000',
  ORDEN: '#f44336',
  CAUTELAR: '#ffeb3b',
  PROTECCION: '#ff9800',
  GEAVI: '#ffc0cb',
  RECURRENTE: '#000080',
}

export default function IncomingCallPopup({
  open,
  onClose,
  callData,
}: IncomingCallPopupProps) {
  const [classification, setClassification] = useState('CREAR_NUEVO')
  const [timer, setTimer] = useState('00:00:00')

  const handleProcess = () => {
    // TODO: Procesar según clasificación
    alert(`Procesando llamada como: ${classification}`)
    onClose()
  }

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon />
            <Typography variant="h6">LLAMADA ENTRANTE</Typography>
          </Box>
          <Typography variant="h6">{timer} ⏱️</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Información ANI/ALI */}
        <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            INFORMACIÓN ANI/ALI
          </Typography>
          <Typography>
            Número: <strong>{callData?.phoneNumber || '55-1234-5678'}</strong>
            {callData?.restriction && (
              <Chip
                label={callData.restriction.type}
                size="small"
                sx={{
                  ml: 2,
                  bgcolor: RESTRICTION_COLORS[callData.restriction.type],
                  color: 'white',
                }}
              />
            )}
          </Typography>
          <Typography>Tipo: {callData?.phoneType || 'MÓVIL'}</Typography>
          <Typography>Operadora: {callData?.carrier || 'TELCEL'}</Typography>
        </Box>

        {/* Localización CNI */}
        <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">LOCALIZACIÓN CNI</Typography>
            <Button size="small" startIcon={<MapIcon />}>
              VER EN MAPA
            </Button>
          </Box>
          <Typography>Calle: {callData?.street || 'Hidalgo'}</Typography>
          <Typography>Colonia: {callData?.colony || 'Centro'}</Typography>
          {callData?.coordinates && (
            <Typography>
              Coordenadas: {callData.coordinates.lat}, {callData.coordinates.lng}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Clasificación */}
        <Typography variant="subtitle2" gutterBottom>
          CLASIFICACIÓN DE LLAMADA
        </Typography>
        <RadioGroup value={classification} onChange={(e) => setClassification(e.target.value)}>
          <FormControlLabel
            value="CREAR_NUEVO"
            control={<Radio />}
            label="Crear Nuevo Incidente"
          />
          <FormControlLabel
            value="ADJUNTAR"
            control={<Radio />}
            label="Adjuntar a incidente existente"
          />
          <FormControlLabel
            value="COMPLEMENTAR"
            control={<Radio />}
            label="Complementar Información"
          />
          <FormControlLabel
            value="NO_PROCEDENTE"
            control={<Radio />}
            label="No Procedente (Broma/Muda/Error)"
          />
        </RadioGroup>

        {/* Botones */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button variant="contained" fullWidth onClick={handleProcess}>
            PROCESAR
          </Button>
          <Button variant="outlined" onClick={onClose}>
            TRANSFERIR
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            COLGAR
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
