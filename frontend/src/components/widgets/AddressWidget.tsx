import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material'
import {
  Search as SearchIcon,
  Map as MapIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material'
import catalogService from '@services/catalogService'

interface AddressData {
  municipalityId: string
  municipalityName: string
  street: string
  crossStreet?: string
  colonyId: string
  colonyName: string
  postalCode: string
  pointOfInterest?: string
  references?: string
  latitude?: number
  longitude?: number
  fullAddress: string
}

interface AddressWidgetProps {
  value?: AddressData
  onChange: (data: AddressData | null) => void
  error?: boolean
  helperText?: string
  defaultMunicipalityId?: string
}

export default function AddressWidget({
  value,
  onChange,
  error,
  helperText,
  defaultMunicipalityId,
}: AddressWidgetProps) {
  const [municipality, setMunicipality] = useState<any>(null)
  const [municipalities, setMunicipalities] = useState<any[]>([])
  const [street, setStreet] = useState('')
  const [streets, setStreets] = useState<any[]>([])
  const [loadingStreets, setLoadingStreets] = useState(false)
  const [crossStreet, setCrossStreet] = useState('')
  const [colony, setColony] = useState<any>(null)
  const [colonies, setColonies] = useState<any[]>([])
  const [loadingColonies, setLoadingColonies] = useState(false)
  const [postalCode, setPostalCode] = useState('')
  const [pointOfInterest, setPointOfInterest] = useState('')
  const [references, setReferences] = useState('')

  // Cargar municipios
  useEffect(() => {
    const loadMunicipalities = async () => {
      try {
        const data = await catalogService.getMunicipalities()
        setMunicipalities(data)

        // Auto-seleccionar municipio por defecto
        if (defaultMunicipalityId) {
          const defaultMun = data.find((m: any) => m.id === defaultMunicipalityId)
          if (defaultMun) {
            setMunicipality(defaultMun)
          }
        }
      } catch (error) {
        console.error('Error loading municipalities:', error)
      }
    }

    loadMunicipalities()
  }, [defaultMunicipalityId])

  // Cargar calles cuando cambia el texto
  useEffect(() => {
    const loadStreets = async () => {
      if (street.length >= 3 && municipality) {
        setLoadingStreets(true)
        try {
          const data = await catalogService.getStreets(municipality.id, street)
          setStreets(data)
        } catch (error) {
          console.error('Error loading streets:', error)
        } finally {
          setLoadingStreets(false)
        }
      } else {
        setStreets([])
      }
    }

    const debounce = setTimeout(loadStreets, 300)
    return () => clearTimeout(debounce)
  }, [street, municipality])

  // Cargar colonias cuando se selecciona una calle
  useEffect(() => {
    const loadColonies = async () => {
      if (street && municipality) {
        setLoadingColonies(true)
        try {
          const data = await catalogService.getColoniesByStreet(street, municipality.id)
          setColonies(data)

          // Auto-seleccionar si solo hay una colonia
          if (data.length === 1) {
            handleColonySelect(data[0])
          }
        } catch (error) {
          console.error('Error loading colonies:', error)
        } finally {
          setLoadingColonies(false)
        }
      }
    }

    loadColonies()
  }, [street, municipality])

  const handleColonySelect = (selectedColony: any) => {
    if (!selectedColony) {
      setColony(null)
      setPostalCode('')
      notifyChange(null)
      return
    }

    setColony(selectedColony)
    setPostalCode(selectedColony.postalCode)

    // Construir datos completos
    const addressData: AddressData = {
      municipalityId: municipality?.id || '',
      municipalityName: municipality?.name || '',
      street,
      crossStreet: crossStreet || undefined,
      colonyId: selectedColony.id,
      colonyName: selectedColony.name,
      postalCode: selectedColony.postalCode,
      pointOfInterest: pointOfInterest || undefined,
      references: references || undefined,
      latitude: selectedColony.latitude,
      longitude: selectedColony.longitude,
      fullAddress: buildFullAddress(selectedColony),
    }

    notifyChange(addressData)
  }

  const buildFullAddress = (col: any): string => {
    const parts = [
      street,
      crossStreet ? `esquina ${crossStreet}` : '',
      col.name,
      col.postalCode,
      municipality?.name,
    ].filter(Boolean)

    return parts.join(', ')
  }

  const notifyChange = (data: AddressData | null) => {
    onChange(data)
  }

  const handleViewOnMap = () => {
    if (colony?.latitude && colony?.longitude) {
      // TODO: Abrir modal con mapa
      console.log('Ver en mapa:', colony.latitude, colony.longitude)
    }
  }

  const isComplete = () => {
    return !!municipality && !!street && !!colony
  }

  return (
    <Card variant="outlined" sx={{ borderColor: error ? 'error.main' : undefined }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Dirección del Incidente</Typography>
          {isComplete() && (
            <IconButton
              size="small"
              onClick={handleViewOnMap}
              sx={{ ml: 'auto' }}
              disabled={!colony?.latitude}
            >
              <MapIcon />
            </IconButton>
          )}
        </Box>

        {/* Municipio */}
        <Autocomplete
          value={municipality}
          onChange={(_, newValue) => setMunicipality(newValue)}
          options={municipalities}
          getOptionLabel={(option) => option.name || ''}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Municipio"
              required
              placeholder="Seleccione municipio"
            />
          )}
          disabled={!!defaultMunicipalityId}
          sx={{ mb: 2 }}
        />

        {/* Calle */}
        <Autocomplete
          freeSolo
          value={street}
          onChange={(_, newValue) => setStreet(typeof newValue === 'string' ? newValue : '')}
          inputValue={street}
          onInputChange={(_, newValue) => setStreet(newValue)}
          options={streets.map((s: any) => s.name)}
          loading={loadingStreets}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Calle"
              required
              placeholder="Escriba para buscar..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingStreets && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          disabled={!municipality}
          sx={{ mb: 2 }}
        />

        {/* Esquina */}
        <TextField
          fullWidth
          label="Esquina con (opcional)"
          value={crossStreet}
          onChange={(e) => setCrossStreet(e.target.value)}
          placeholder="Nombre de calle de cruce"
          sx={{ mb: 2 }}
        />

        {/* Colonia */}
        <Autocomplete
          value={colony}
          onChange={(_, newValue) => handleColonySelect(newValue)}
          options={colonies}
          getOptionLabel={(option) => option.name || ''}
          loading={loadingColonies}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Colonia"
              required
              placeholder="Seleccione colonia"
              error={error}
              helperText={helperText}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingColonies && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          disabled={!street || colonies.length === 0}
          sx={{ mb: 2 }}
        />

        {/* Código Postal */}
        <TextField
          fullWidth
          label="Código Postal"
          value={postalCode}
          disabled
          sx={{ mb: 2 }}
        />

        {/* Punto de Interés */}
        <TextField
          fullWidth
          label="Punto de Interés (opcional)"
          value={pointOfInterest}
          onChange={(e) => setPointOfInterest(e.target.value)}
          placeholder="Ej: Frente al Oxxo, junto a..."
          sx={{ mb: 2 }}
        />

        {/* Referencias */}
        <TextField
          fullWidth
          label="Referencias"
          value={references}
          onChange={(e) => setReferences(e.target.value)}
          placeholder="Descripción adicional del lugar"
          multiline
          rows={2}
        />

        {/* Validación visual */}
        {isComplete() && (
          <Box
            sx={{
              mt: 2,
              p: 1,
              bgcolor: 'success.light',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="success.dark">
              ✓ Dirección completa: {value?.fullAddress}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
