import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Incident {
  id: string
  folio: string
  status: string
  priority: string
  incidentType: {
    id: string
    name: string
  }
  createdAt: string
}

interface IncidentState {
  currentIncident: Incident | null
  incidents: Incident[]
  isLoading: boolean
}

const initialState: IncidentState = {
  currentIncident: null,
  incidents: [],
  isLoading: false,
}

const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    setCurrentIncident: (state, action: PayloadAction<Incident | null>) => {
      state.currentIncident = action.payload
    },
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.incidents = action.payload
    },
    addIncident: (state, action: PayloadAction<Incident>) => {
      state.incidents.unshift(action.payload)
    },
    updateIncident: (state, action: PayloadAction<Incident>) => {
      const index = state.incidents.findIndex(
        (inc) => inc.id === action.payload.id
      )
      if (index !== -1) {
        state.incidents[index] = action.payload
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  setCurrentIncident,
  setIncidents,
  addIncident,
  updateIncident,
  setLoading,
} = incidentSlice.actions

export default incidentSlice.reducer
