import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Chip, Button } from '@mui/material'
import {
  PriorityHigh as PriorityIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material'

type PriorityLevel = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA'

interface PriorityWidgetProps {
  value: PriorityLevel
  incidentType?: any
  canOverride?: boolean
  onOverride?: (newPriority: PriorityLevel, reason: string) => void
}

const PRIORITY_CONFIG = {
  CRITICA: {
    label: 'Crítica',
    color: '#f44336',
    textColor: '#fff',
    level: 1,
    time: '< 3 minutos',
    icon: '🔴',
  },
  ALTA: {
    label: 'Alta',
    color: '#ff9800',
    textColor: '#fff',
    level: 2,
    time: '< 5 minutos',
    icon: '🟠',
  },
  MEDIA: {
    label: 'Media',
    color: '#ffeb3b',
    textColor: '#000',
    level: 3,
    time: '< 10 minutos',
    icon: '🟡',
  },
  BAJA: {
    label: 'Baja',
    color: '#4caf50',
    textColor: '#fff',
    level: 4,
    time: '< 30 minutos',
    icon: '🟢',
  },
}

export default function PriorityWidget({
  value,
  incidentType,
  canOverride = false,
  onOverride,
}: PriorityWidgetProps) {
  const [currentPriority, setCurrentPriority] = useState<PriorityLevel>(value)
  const [modifiedBy, setModifiedBy] = useState<string>('Sistema')
  const [modificationReason, setModificationReason] = useState<string>('Tipo de incidente')

  useEffect(() => {
    if (incidentType?.defaultPriority) {
      setCurrentPriority(incidentType.defaultPriority)
      setModifiedBy('Sistema')
      setModificationReason('Tipo de incidente')
    }
  }, [incidentType])

  const handleOverride = () => {
    // TODO: Abrir modal para cambiar prioridad
    // Solo disponible para supervisores
    if (canOverride && onOverride) {
      const reason = prompt('Razón del cambio de prioridad:')
      if (reason) {
        const newPriority = prompt(
          'Nueva prioridad (CRITICA, ALTA, MEDIA, BAJA):'
        )?.toUpperCase() as PriorityLevel
        if (newPriority && PRIORITY_CONFIG[newPriority]) {
          onOverride(newPriority, reason)
          setCurrentPriority(newPriority)
          setModifiedBy('Supervisor')
          setModificationReason(reason)
        }
      }
    }
  }

  const config = PRIORITY_CONFIG[currentPriority]

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PriorityIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Prioridad</Typography>
        </Box>

        {/* Visualización de prioridad */}
        <Box
          sx={{
            p: 3,
            bgcolor: config.color,
            color: config.textColor,
            borderRadius: 2,
            textAlign: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h3" fontWeight={700}>
            {config.icon}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {config.label.toUpperCase()}
          </Typography>
          <Typography variant="h6">RESPUESTA INMEDIATA</Typography>
        </Box>

        {/* Información de prioridad */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Nivel:</strong> {config.level} - {config.label}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Tiempo objetivo:</strong> {config.time}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Modificada por:</strong> {modifiedBy}
          </Typography>
          <Typography variant="body2">
            <strong>Razón:</strong> {modificationReason}
          </Typography>
        </Box>

        {/* Botón de override para supervisores */}
        {canOverride && (
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<WarningIcon />}
            onClick={handleOverride}
          >
            Cambiar Prioridad (Supervisor)
          </Button>
        )}

        {/* Leyenda de colores */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <Chip
              key={key}
              label={cfg.label}
              size="small"
              sx={{
                bgcolor: cfg.color,
                color: cfg.textColor,
                fontWeight: currentPriority === key ? 'bold' : 'normal',
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
