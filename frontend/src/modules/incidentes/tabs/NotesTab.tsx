import { Box, TextField } from '@mui/material'

interface NotesTabProps {
  value: string
  onChange: (notes: string) => void
}

export default function NotesTab({ value, onChange }: NotesTabProps) {
  return (
    <Box>
      <TextField
        fullWidth
        label="Notas del Incidente"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        multiline
        rows={10}
        placeholder="Detalles adicionales, observaciones, cronología de hechos..."
      />
    </Box>
  )
}
