import { useState } from 'react'
import {
  Box,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import PersonForm from '../forms/PersonForm'
import VehicleForm from '../forms/VehicleForm'

interface InvolvedTabProps {
  value: any[]
  onChange: (involved: any[]) => void
}

export default function InvolvedTab({ value, onChange }: InvolvedTabProps) {
  const [currentSubTab, setCurrentSubTab] = useState(0)
  const [showPersonForm, setShowPersonForm] = useState(false)
  const [showVehicleForm, setShowVehicleForm] = useState(false)

  const persons = value.filter((i) => i.type === 'PERSONA')
  const vehicles = value.filter((i) => i.type === 'VEHICULO')

  const handleAddPerson = (person: any) => {
    onChange([...value, { type: 'PERSONA', ...person }])
    setShowPersonForm(false)
  }

  const handleAddVehicle = (vehicle: any) => {
    onChange([...value, { type: 'VEHICULO', ...vehicle }])
    setShowVehicleForm(false)
  }

  const handleDelete = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  return (
    <Box>
      <Tabs value={currentSubTab} onChange={(_, v) => setCurrentSubTab(v)}>
        <Tab label={`Personas (${persons.length})`} />
        <Tab label={`Vehículos (${vehicles.length})`} />
        <Tab label="Inmuebles" />
        <Tab label="Teléfonos" />
        <Tab label="Armas" />
        <Tab label="Sustancias" />
        <Tab label="Documentos" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {/* Tab Personas */}
        {currentSubTab === 0 && (
          <Box>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setShowPersonForm(true)}
              sx={{ mb: 2 }}
            >
              Agregar Persona
            </Button>

            {showPersonForm && (
              <PersonForm
                onSave={handleAddPerson}
                onCancel={() => setShowPersonForm(false)}
              />
            )}

            {persons.length > 0 && (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Nombre Completo</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Características</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {persons.map((person, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {person.firstName} {person.lastName} {person.middleName}
                      </TableCell>
                      <TableCell>{person.role}</TableCell>
                      <TableCell>
                        {person.gender}, {person.age} años, {person.height}cm
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        )}

        {/* Tab Vehículos */}
        {currentSubTab === 1 && (
          <Box>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setShowVehicleForm(true)}
              sx={{ mb: 2 }}
            >
              Agregar Vehículo
            </Button>

            {showVehicleForm && (
              <VehicleForm
                onSave={handleAddVehicle}
                onCancel={() => setShowVehicleForm(false)}
              />
            )}

            {vehicles.length > 0 && (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Placas</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Marca/Modelo</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicles.map((vehicle, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{vehicle.plates}</TableCell>
                      <TableCell>{vehicle.vehicleType}</TableCell>
                      <TableCell>
                        {vehicle.brand} {vehicle.model}
                      </TableCell>
                      <TableCell>{vehicle.color}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        )}

        {/* Otros tabs - Placeholders */}
        {currentSubTab > 1 && (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            Formulario de {['Inmuebles', 'Teléfonos', 'Armas', 'Sustancias', 'Documentos'][currentSubTab - 2]} (En desarrollo)
          </Box>
        )}
      </Box>
    </Box>
  )
}
