import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@store/index'
import socketService from '@services/socketService'

export function useSocket() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect()

      return () => {
        socketService.disconnect()
      }
    }
  }, [isAuthenticated])

  return socketService
}
