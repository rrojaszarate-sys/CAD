// ***********************************************************
// COMANDOS PERSONALIZADOS DE CYPRESS - SISTEMA CAD
// ***********************************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Iniciar sesión con credenciales
       * @param username - Nombre de usuario
       * @param password - Contraseña
       */
      login(username: string, password: string): Chainable<void>

      /**
       * Iniciar sesión con usuario administrador
       */
      loginAsAdmin(): Chainable<void>

      /**
       * Iniciar sesión con usuario operador
       */
      loginAsOperator(): Chainable<void>

      /**
       * Cerrar sesión
       */
      logout(): Chainable<void>

      /**
       * Verificar que el usuario está autenticado
       */
      checkAuthenticated(): Chainable<void>

      /**
       * Realizar petición API autenticada
       * @param method - Método HTTP
       * @param url - URL del endpoint
       * @param body - Cuerpo de la petición
       */
      apiRequest(method: string, url: string, body?: object): Chainable<any>

      /**
       * Obtener elemento por data-testid
       * @param testId - ID de prueba
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>

      /**
       * Esperar a que cargue la tabla
       */
      waitForTableLoad(): Chainable<void>

      /**
       * Abrir modal de creación
       */
      openCreateModal(): Chainable<void>

      /**
       * Llenar campo de formulario
       * @param fieldName - Nombre del campo
       * @param value - Valor a ingresar
       */
      fillFormField(fieldName: string, value: string): Chainable<void>

      /**
       * Seleccionar opción en dropdown
       * @param fieldName - Nombre del campo
       * @param optionText - Texto de la opción
       */
      selectOption(fieldName: string, optionText: string): Chainable<void>

      /**
       * Verificar mensaje de éxito
       * @param message - Mensaje esperado
       */
      checkSuccessMessage(message: string): Chainable<void>

      /**
       * Verificar mensaje de error
       * @param message - Mensaje esperado
       */
      checkErrorMessage(message: string): Chainable<void>
    }
  }
}

// ===========================================
// COMANDOS DE AUTENTICACIÓN
// ===========================================

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login')
  cy.get('input[name="username"]').clear().type(username)
  cy.get('input[name="password"]').clear().type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('loginAsAdmin', () => {
  const username = Cypress.env('adminUser')
  const password = Cypress.env('adminPassword')
  cy.login(username, password)
})

Cypress.Commands.add('loginAsOperator', () => {
  const username = Cypress.env('operatorUser')
  const password = Cypress.env('operatorPassword')
  cy.login(username, password)
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click()
  cy.url().should('include', '/login')
})

Cypress.Commands.add('checkAuthenticated', () => {
  cy.window().its('localStorage.token').should('exist')
})

// ===========================================
// COMANDOS DE API
// ===========================================

Cypress.Commands.add('apiRequest', (method: string, url: string, body?: object) => {
  const token = window.localStorage.getItem('token')
  const apiUrl = Cypress.env('apiUrl')

  return cy.request({
    method,
    url: `${apiUrl}${url}`,
    body,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    failOnStatusCode: false,
  })
})

// ===========================================
// COMANDOS DE UTILIDAD
// ===========================================

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add('waitForTableLoad', () => {
  cy.get('table').should('be.visible')
  cy.get('.MuiCircularProgress-root').should('not.exist')
})

Cypress.Commands.add('openCreateModal', () => {
  cy.contains('button', /nuevo|crear|agregar/i).click()
  cy.get('.MuiDialog-root').should('be.visible')
})

Cypress.Commands.add('fillFormField', (fieldName: string, value: string) => {
  cy.get(`input[name="${fieldName}"]`).clear().type(value)
})

Cypress.Commands.add('selectOption', (fieldName: string, optionText: string) => {
  cy.get(`[name="${fieldName}"]`).parent().click()
  cy.get('.MuiMenu-list').contains(optionText).click()
})

Cypress.Commands.add('checkSuccessMessage', (message: string) => {
  cy.get('.MuiAlert-standardSuccess, .MuiSnackbar-root')
    .should('be.visible')
    .and('contain', message)
})

Cypress.Commands.add('checkErrorMessage', (message: string) => {
  cy.get('.MuiAlert-standardError, .MuiSnackbar-root')
    .should('be.visible')
    .and('contain', message)
})

export {}
