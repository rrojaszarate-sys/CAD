import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Chip,
  Divider,
} from '@mui/material'
import {
  LocalPolice as PoliceIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon,
  HourglassEmpty as PendingIcon,
  Error as ErrorIcon,
} from '@mui/icons-material'
import catalogService from '@services/catalogService'

interface Corporation {
  id: string
  code: string
  name: string
  type: string
  stats?: {
    total: number
    available: number
    enRoute: number
    onSite: number
    busy: number
  }
}

interface SelectedCorporation extends Corporation {
  status: 'PENDIENTE' | 'ENVIADO' | 'ERROR'
  isSuggested: boolean
}

interface CorporationsWidgetProps {
  value?: SelectedCorporation[]
  onChange: (corporations: SelectedCorporation[]) => void
  suggestedIds?: string[]
}

export default function CorporationsWidget({
  value = [],
  onChange,
  suggestedIds = [],
}: CorporationsWidgetProps) {
  const [allCorporations, setAllCorporations] = useState<Corporation[]>([])
  const [selected, setSelected] = useState<Map<string, SelectedCorporation>>(new Map())

  // Cargar corporaciones
  useEffect(() => {
    const loadCorporations = async () => {
      try {
        const corps = await catalogService.getCorporations()

        // Cargar stats para cada corporación
        const corpsWithStats = await Promise.all(
          corps.map(async (corp: Corporation) => {
            try {
              const stats = await catalogService.getCorporationStats(corp.id)
              return { ...corp, stats }
            } catch {
              return corp
            }
          })
        )

        setAllCorporations(corpsWithStats)

        // Auto-seleccionar sugeridas
        if (suggestedIds.length > 0) {
          const newSelected = new Map<string, SelectedCorporation>()
          corpsWithStats.forEach((corp) => {
            if (suggestedIds.includes(corp.id)) {
              newSelected.set(corp.id, {
                ...corp,
                status: 'PENDIENTE',
                isSuggested: true,
              })
            }
          })
          setSelected(newSelected)
          onChange(Array.from(newSelected.values()))
        }
      } catch (error) {
        console.error('Error loading corporations:', error)
      }
    }

    loadCorporations()
  }, [])

  const handleToggle = (corp: Corporation) => {
    const newSelected = new Map(selected)

    if (newSelected.has(corp.id)) {
      newSelected.delete(corp.id)
    } else {
      newSelected.set(corp.id, {
        ...corp,
        status: 'PENDIENTE',
        isSuggested: suggestedIds.includes(corp.id),
      })
    }

    setSelected(newSelected)
    onChange(Array.from(newSelected.values()))
  }

  const handleSendSelected = () => {
    const newSelected = new Map(selected)
    newSelected.forEach((corp) => {
      if (corp.status === 'PENDIENTE') {
        corp.status = 'ENVIADO'
      }
    })
    setSelected(newSelected)
    onChange(Array.from(newSelected.values()))
  }

  const handleSendAll = () => {
    const newSelected = new Map<string, SelectedCorporation>()
    allCorporations.forEach((corp) => {
      newSelected.set(corp.id, {
        ...corp,
        status: 'ENVIADO',
        isSuggested: suggestedIds.includes(corp.id),
      })
    })
    setSelected(newSelected)
    onChange(Array.from(newSelected.values()))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ENVIADO':
        return <CheckIcon sx={{ fontSize: 16, color: '#1565c0' }} />
      case 'PENDIENTE':
        return <PendingIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
      case 'ERROR':
        return <ErrorIcon sx={{ fontSize: 16, color: '#f44336' }} />
      default:
        return null
    }
  }

  const suggested = allCorporations.filter((c) => suggestedIds.includes(c.id))
  const available = allCorporations.filter((c) => !suggestedIds.includes(c.id))

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PoliceIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Corporaciones</Typography>
        </Box>

        {/* Sugeridas */}
        {suggested.length > 0 && (
          <>
            <Typography variant="subtitle2" gutterBottom color="primary">
              Sugeridas (auto-seleccionadas):
            </Typography>
            <Box sx={{ mb: 2 }}>
              {suggested.map((corp) => {
                const sel = selected.get(corp.id)
                return (
                  <Box
                    key={corp.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      mb: 1,
                      bgcolor: sel ? 'primary.light' : 'grey.100',
                      borderRadius: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selected.has(corp.id)}
                          onChange={() => handleToggle(corp)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {corp.name}
                          </Typography>
                          {corp.stats && (
                            <Typography variant="caption" color="text.secondary">
                              {corp.stats.available} disponibles de {corp.stats.total}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    {sel && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption">
                          {sel.status === 'ENVIADO' ? 'Enviado' : 'Pendiente'}
                        </Typography>
                        {getStatusIcon(sel.status)}
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Disponibles */}
        <Typography variant="subtitle2" gutterBottom>
          Disponibles:
        </Typography>
        <Box sx={{ mb: 2, maxHeight: 300, overflow: 'auto' }}>
          {available.map((corp) => {
            const sel = selected.get(corp.id)
            return (
              <Box
                key={corp.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  mb: 1,
                  bgcolor: sel ? 'grey.200' : 'transparent',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selected.has(corp.id)}
                      onChange={() => handleToggle(corp)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">{corp.name}</Typography>
                      {corp.stats && (
                        <Typography variant="caption" color="text.secondary">
                          {corp.stats.available} disponibles
                        </Typography>
                      )}
                    </Box>
                  }
                />
                {sel && getStatusIcon(sel.status)}
              </Box>
            )
          })}
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<SendIcon />}
            onClick={handleSendSelected}
            disabled={selected.size === 0}
          >
            Enviar Seleccionadas ({selected.size})
          </Button>
          <Button variant="outlined" onClick={handleSendAll}>
            Enviar Todas
          </Button>
        </Box>

        {/* Estado de envío */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" display="block">
            ● Azul marino = Enviado correctamente
          </Typography>
          <Typography variant="caption" display="block">
            ● Gris = Pendiente de envío
          </Typography>
          <Typography variant="caption" display="block">
            ● Rojo = Error en envío
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
