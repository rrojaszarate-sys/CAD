import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Alert,
  Chip,
} from '@mui/material'
import {
  Save as SaveIcon,
  Send as SendIcon,
  Link as LinkIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import AddressWidget from '@components/widgets/AddressWidget'
import IncidentTypeWidget from '@components/widgets/IncidentTypeWidget'
import PriorityWidget from '@components/widgets/PriorityWidget'
import CorporationsWidget from '@components/widgets/CorporationsWidget'
import CallerWidget from '@components/widgets/CallerWidget'
import InvolvedTab from './tabs/InvolvedTab'
import NotesTab from './tabs/NotesTab'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ padding: '24px 0' }}>
      {value === index && children}
    </div>
  )
}

export default function IncidentForm() {
  const [folio] = useState('EDOMEX/1/19111100072') // TODO: Generar dinámicamente
  const [status] = useState('EN_CAPTURA')
  const [currentTab, setCurrentTab] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  // Datos del formulario
  const [address, setAddress] = useState<any>(null)
  const [incidentType, setIncidentType] = useState<any>(null)
  const [priority, setPriority] = useState<any>('MEDIA')
  const [corporations, setCorporations] = useState<any[]>([])
  const [caller, setCaller] = useState<any>({})
  const [involved, setInvolved] = useState<any[]>([])
  const [notes, setNotes] = useState('')

  const handleSave = () => {
    // TODO: Guardar borrador
    alert('Incidente guardado como borrador')
  }

  const handleChannelize = () => {
    // Validar campos obligatorios
    const newErrors: string[] = []

    if (!address || !address.colonyId) {
      newErrors.push('Necesario seleccionar una colonia para el Domicilio del Incidente')
    }

    if (!incidentType) {
      newErrors.push('Debe seleccionar tipo de incidente')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    // TODO: Enviar a despacho
    alert('Incidente canalizado a despacho')
  }

  const handleAssociate = () => {
    // TODO: Asociar a otro incidente
    alert('Asociar a otro incidente')
  }

  const handleCancel = () => {
    if (confirm('¿Desea cancelar el incidente? Se perderán los datos no guardados.')) {
      // TODO: Limpiar formulario o redirigir
    }
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5">
            INCIDENTE #{folio}
          </Typography>
          <Chip
            label={status}
            color={status === 'EN_CAPTURA' ? 'warning' : 'default'}
            size="small"
          />
        </Box>
      </Paper>

      {/* Errores */}
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrors([])}>
          {errors.map((err, idx) => (
            <div key={idx}>• {err}</div>
          ))}
        </Alert>
      )}

      {/* Widgets Superiores */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <AddressWidget value={address} onChange={setAddress} />
        <Box sx={{ display: 'grid', gap: 2 }}>
          <IncidentTypeWidget value={incidentType} onChange={setIncidentType} />
          <PriorityWidget value={priority} incidentType={incidentType} />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, mb: 2 }}>
        <CorporationsWidget
          value={corporations}
          onChange={setCorporations}
          suggestedIds={incidentType?.suggestedCorporations || []}
        />
        <CallerWidget value={caller} onChange={setCaller} />
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab label="Involucrados" />
          <Tab label="Notas" />
          <Tab label="Cuestionario" />
          <Tab label="Protocolo" />
          <Tab label="Historial" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <InvolvedTab value={involved} onChange={setInvolved} />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <NotesTab value={notes} onChange={setNotes} />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Typography color="text.secondary">
            Cuestionario dinámico según tipo de incidente (En desarrollo)
          </Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <Typography color="text.secondary">
            Protocolo de atención (En desarrollo)
          </Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <Typography color="text.secondary">
            Historial de cambios del incidente (En desarrollo)
          </Typography>
        </TabPanel>
      </Paper>

      {/* Acciones */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Guardar
        </Button>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleChannelize}
        >
          Canalizar
        </Button>
        <Button
          variant="outlined"
          startIcon={<LinkIcon />}
          onClick={handleAssociate}
        >
          Asociar
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={handleCancel}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  )
}
