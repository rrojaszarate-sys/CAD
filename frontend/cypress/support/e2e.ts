// ***********************************************************
// CYPRESS E2E SUPPORT FILE - SISTEMA CAD
// Este archivo se ejecuta antes de cada prueba
// ***********************************************************

import './commands'

// Suprimir errores de scripts externos
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false previene que Cypress falle la prueba
  return false
})

// Limpiar localStorage antes de cada prueba
beforeEach(() => {
  cy.clearLocalStorage()
  cy.clearCookies()
})

// Log de cada prueba que inicia
beforeEach(function () {
  const testName = this.currentTest?.title
  cy.task('log', `\n🧪 Iniciando prueba: ${testName}`)
})

// Log de resultados de cada prueba
afterEach(function () {
  const testName = this.currentTest?.title
  const state = this.currentTest?.state
  const emoji = state === 'passed' ? '✅' : '❌'
  cy.task('log', `${emoji} Prueba "${testName}": ${state?.toUpperCase()}`)
})
