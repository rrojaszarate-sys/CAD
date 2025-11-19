import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

class SocketService {
  private socket: Socket | null = null

  connect() {
    const token = localStorage.getItem('accessToken')

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO conectado:', this.socket?.id)
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO desconectado')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Eventos de llamadas
  onIncomingCall(callback: (data: any) => void) {
    this.socket?.on('call:incoming', callback)
  }

  // Eventos de incidentes
  onIncidentCreated(callback: (data: any) => void) {
    this.socket?.on('incident:created', callback)
  }

  onIncidentUpdated(callback: (data: any) => void) {
    this.socket?.on('incident:updated', callback)
  }

  // Eventos de unidades
  onUnitStatusChanged(callback: (data: any) => void) {
    this.socket?.on('unit:status_changed', callback)
  }

  // Eventos de misiones
  onMissionAssigned(callback: (data: any) => void) {
    this.socket?.on('mission:assigned', callback)
  }

  onMissionUpdated(callback: (data: any) => void) {
    this.socket?.on('mission:updated', callback)
  }

  // Alertas
  onAlert(callback: (data: any) => void) {
    this.socket?.on('alert:restriction', callback)
    this.socket?.on('alert:supervisor', callback)
  }

  // Emitir eventos
  emit(event: string, data: any) {
    this.socket?.emit(event, data)
  }

  getSocket() {
    return this.socket
  }
}

export default new SocketService()
