import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import incidentReducer from './slices/incidentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incident: incidentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
