// ===========================================
// PRUEBAS DE AUTENTICACIÓN - SISTEMA CAD
// ===========================================

describe('Módulo de Autenticación', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
    cy.visit('/login')
  })

  describe('Página de Login', () => {
    it('TC-AUTH-001: Debe mostrar el formulario de login correctamente', () => {
      // Verificar elementos del formulario
      cy.get('input[name="username"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')

      // Verificar labels
      cy.contains('Usuario').should('be.visible')
      cy.contains('Contraseña').should('be.visible')
    })

    it('TC-AUTH-002: Debe validar campos requeridos', function () {
      // Intentar enviar formulario vacío
      cy.get('button[type="submit"]').click()

      // Verificar mensajes de validación
      cy.get('input[name="username"]').should('have.attr', 'aria-invalid', 'true')
    })
  })

  describe('Login Exitoso', () => {
    it('TC-AUTH-003: Login exitoso con usuario Administrador', function () {
      const { admin } = this.testData.usuarios

      cy.get('input[name="username"]').type(admin.nombreUsuario)
      cy.get('input[name="password"]').type(admin.contrasena)
      cy.get('button[type="submit"]').click()

      // Verificar redirección al dashboard
      cy.url().should('not.include', '/login')
      cy.contains(admin.nombre).should('be.visible')
    })

    it('TC-AUTH-004: Login exitoso con usuario Operador', function () {
      const { operador } = this.testData.usuarios

      cy.get('input[name="username"]').type(operador.nombreUsuario)
      cy.get('input[name="password"]').type(operador.contrasena)
      cy.get('button[type="submit"]').click()

      cy.url().should('not.include', '/login')
    })

    it('TC-AUTH-005: Login exitoso con usuario Supervisor', function () {
      const { supervisor } = this.testData.usuarios

      cy.get('input[name="username"]').type(supervisor.nombreUsuario)
      cy.get('input[name="password"]').type(supervisor.contrasena)
      cy.get('button[type="submit"]').click()

      cy.url().should('not.include', '/login')
    })

    it('TC-AUTH-006: Login exitoso con usuario Despachador', function () {
      const { despachador } = this.testData.usuarios

      cy.get('input[name="username"]').type(despachador.nombreUsuario)
      cy.get('input[name="password"]').type(despachador.contrasena)
      cy.get('button[type="submit"]').click()

      cy.url().should('not.include', '/login')
    })
  })

  describe('Login Fallido', () => {
    it('TC-AUTH-007: Debe mostrar error con usuario inexistente', function () {
      const { usuarioNoExiste } = this.testData.credencialesInvalidas

      cy.get('input[name="username"]').type(usuarioNoExiste.nombreUsuario)
      cy.get('input[name="password"]').type(usuarioNoExiste.contrasena)
      cy.get('button[type="submit"]').click()

      // Verificar mensaje de error
      cy.contains(/usuario no registrado|no encontrado/i).should('be.visible')
      cy.url().should('include', '/login')
    })

    it('TC-AUTH-008: Debe mostrar error con contraseña incorrecta', function () {
      const { contrasenaIncorrecta } = this.testData.credencialesInvalidas

      cy.get('input[name="username"]').type(contrasenaIncorrecta.nombreUsuario)
      cy.get('input[name="password"]').type(contrasenaIncorrecta.contrasena)
      cy.get('button[type="submit"]').click()

      // Verificar mensaje de error
      cy.contains(/contraseña incorrecta|credenciales inválidas/i).should('be.visible')
      cy.url().should('include', '/login')
    })

    it('TC-AUTH-009: Debe bloquear después de múltiples intentos fallidos', function () {
      const { contrasenaIncorrecta } = this.testData.credencialesInvalidas

      // Intentar 3 veces con contraseña incorrecta
      for (let i = 0; i < 3; i++) {
        cy.get('input[name="username"]').clear().type(contrasenaIncorrecta.nombreUsuario)
        cy.get('input[name="password"]').clear().type(contrasenaIncorrecta.contrasena)
        cy.get('button[type="submit"]').click()
        cy.wait(500)
      }

      // El usuario debería estar bloqueado
      cy.contains(/bloqueado|múltiples intentos/i).should('be.visible')
    })
  })

  describe('Logout', () => {
    it('TC-AUTH-010: Debe poder cerrar sesión correctamente', function () {
      const { admin } = this.testData.usuarios

      // Login primero
      cy.get('input[name="username"]').type(admin.nombreUsuario)
      cy.get('input[name="password"]').type(admin.contrasena)
      cy.get('button[type="submit"]').click()

      // Esperar a que cargue el dashboard
      cy.url().should('not.include', '/login')

      // Buscar y hacer click en logout
      cy.get('[data-testid="logout-button"], [aria-label="logout"], button:contains("Cerrar")').first().click()

      // Verificar redirección a login
      cy.url().should('include', '/login')
    })
  })

  describe('Sesión Persistente', () => {
    it('TC-AUTH-011: Token debe guardarse en localStorage', function () {
      const { admin } = this.testData.usuarios

      cy.get('input[name="username"]').type(admin.nombreUsuario)
      cy.get('input[name="password"]').type(admin.contrasena)
      cy.get('button[type="submit"]').click()

      cy.url().should('not.include', '/login')

      // Verificar que el token existe en localStorage
      cy.window().then((win) => {
        const token = win.localStorage.getItem('token') || win.localStorage.getItem('accessToken')
        expect(token).to.not.be.null
      })
    })
  })
})
