import { useState, useEffect } from 'react'
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
} from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'
import catalogService from '@services/catalogService'

interface IncidentType {
  id: string
  code: string
  name: string
  parentId?: string
  category: string
  defaultPriority: string
  expectedResponseTime: number
  requiresQuestionnaire: boolean
  protocolCode?: string
  suggestedCorporations: string[]
  children?: IncidentType[]
}

interface IncidentTypeWidgetProps {
  value?: IncidentType
  onChange: (type: IncidentType | null) => void
  error?: boolean
  helperText?: string
}

export default function IncidentTypeWidget({
  value,
  onChange,
  error,
  helperText,
}: IncidentTypeWidgetProps) {
  const [hierarchy, setHierarchy] = useState<IncidentType[]>([])
  const [selectedCategory, setSelectedCategory] = useState<IncidentType | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<IncidentType | null>(null)
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null)
  const [description, setDescription] = useState('')

  // Cargar jerarquía de tipos
  useEffect(() => {
    const loadHierarchy = async () => {
      try {
        const data = await catalogService.getIncidentTypeHierarchy()
        setHierarchy(data)
      } catch (error) {
        console.error('Error loading incident types:', error)
      }
    }

    loadHierarchy()
  }, [])

  const handleCategoryChange = (categoryId: string) => {
    const category = hierarchy.find((h) => h.id === categoryId)
    setSelectedCategory(category || null)
    setSelectedSubcategory(null)
    setSelectedType(null)
    onChange(null)
  }

  const handleSubcategoryChange = (subcategoryId: string) => {
    if (!selectedCategory) return

    const subcategory = selectedCategory.children?.find((c) => c.id === subcategoryId)
    setSelectedSubcategory(subcategory || null)
    setSelectedType(null)

    // Si la subcategoría no tiene hijos, es el tipo final
    if (subcategory && (!subcategory.children || subcategory.children.length === 0)) {
      setSelectedType(subcategory)
      onChange(subcategory)
    } else {
      onChange(null)
    }
  }

  const handleTypeChange = (typeId: string) => {
    if (!selectedSubcategory) return

    const type = selectedSubcategory.children?.find((t) => t.id === typeId)
    setSelectedType(type || null)
    onChange(type || null)
  }

  const hasSubcategories = selectedCategory && selectedCategory.children && selectedCategory.children.length > 0
  const hasTypes = selectedSubcategory && selectedSubcategory.children && selectedSubcategory.children.length > 0

  return (
    <Card variant="outlined" sx={{ borderColor: error ? 'error.main' : undefined }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WarningIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Tipo de Incidente</Typography>
        </Box>

        {/* Categoría Principal */}
        <FormControl fullWidth sx={{ mb: 2 }} required error={error}>
          <InputLabel>Categoría Principal</InputLabel>
          <Select
            value={selectedCategory?.id || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            label="Categoría Principal"
          >
            {hierarchy.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subcategoría */}
        {hasSubcategories && (
          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel>Subcategoría</InputLabel>
            <Select
              value={selectedSubcategory?.id || ''}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
              label="Subcategoría"
            >
              {selectedCategory!.children!.map((subcat) => (
                <MenuItem key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Tipo Específico */}
        {hasTypes && (
          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel>Tipo Específico</InputLabel>
            <Select
              value={selectedType?.id || ''}
              onChange={(e) => handleTypeChange(e.target.value)}
              label="Tipo Específico"
            >
              {selectedSubcategory!.children!.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Descripción adicional */}
        <TextField
          fullWidth
          label="Descripción adicional"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          placeholder="Detalles adicionales del incidente..."
        />

        {/* Mostrar información del tipo seleccionado */}
        {selectedType && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Incidente Seleccionado:
            </Typography>
            <Typography variant="body2">
              <strong>{selectedType.name}</strong>
            </Typography>
            <Typography variant="caption" display="block">
              Prioridad sugerida: {selectedType.defaultPriority}
            </Typography>
            <Typography variant="caption" display="block">
              Tiempo de respuesta esperado: {selectedType.expectedResponseTime} min
            </Typography>
            {selectedType.requiresQuestionnaire && (
              <Typography variant="caption" display="block" color="warning.main">
                ⚠ Requiere cuestionario
              </Typography>
            )}
          </Box>
        )}

        {error && helperText && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {helperText}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
