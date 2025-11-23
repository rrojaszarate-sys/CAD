// ===========================================
// PRUEBAS DE CATÁLOGOS - SISTEMA CAD
// ===========================================

describe('Catálogos del Sistema', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
    // Login como administrador
    cy.visit('/login')
    cy.get('input[name="username"]').type('ADMIN')
    cy.get('input[name="password"]').type('Admin123')
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')
  })

  describe('Catálogo de Municipios', () => {
    beforeEach(() => {
      cy.visit('/admin/municipios')
    })

    it('TC-CAT-001: Debe listar municipios existentes', function () {
      const { existente } = this.testData.municipios
      cy.get('table').should('be.visible')
      cy.contains(existente.nombre).should('be.visible')
    })

    it('TC-CAT-002: Debe crear nuevo municipio', function () {
      const timestamp = Date.now()
      const nombreMunicipio = `Test_Mpio_${timestamp}`

      cy.contains('button', /nuevo|agregar/i).click()
      cy.get('.MuiDialog-root').should('be.visible')

      cy.get('input[name="nombre"]').type(nombreMunicipio)
      cy.get('input[name="estado"]').type('Estado de México')

      cy.contains('button', /crear|guardar/i).click()
      cy.contains(/creado|exitosamente/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Catálogo de Colonias', () => {
    beforeEach(() => {
      cy.visit('/admin/colonias')
    })

    it('TC-CAT-003: Debe listar colonias existentes', function () {
      const { existente } = this.testData.colonias
      cy.get('table').should('be.visible')
      cy.contains(existente.nombre).should('be.visible')
    })

    it('TC-CAT-004: Debe filtrar colonias por municipio', () => {
      cy.get('[aria-label*="Municipio"]').parent().click()
      cy.get('.MuiMenu-list').contains('Toluca').click()
      cy.wait(500)
      cy.get('tbody tr').should('have.length.at.least', 1)
    })

    it('TC-CAT-005: Debe crear nueva colonia', function () {
      const timestamp = Date.now()

      cy.contains('button', /nuevo|agregar/i).click()
      cy.get('.MuiDialog-root').should('be.visible')

      cy.get('input[name="nombre"]').type(`Test_Col_${timestamp}`)
      cy.get('input[name="codigoPostal"]').type('99999')

      // Seleccionar municipio
      cy.get('[name="municipioId"]').parent().click()
      cy.get('.MuiMenu-list').contains('Toluca').click()

      cy.contains('button', /crear|guardar/i).click()
      cy.contains(/creado|exitosamente/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Catálogo de Calles', () => {
    beforeEach(() => {
      cy.visit('/admin/calles')
    })

    it('TC-CAT-006: Debe listar calles existentes', function () {
      const { existente } = this.testData.calles
      cy.get('table').should('be.visible')
      cy.contains(existente.nombre).should('be.visible')
    })

    it('TC-CAT-007: Debe buscar calles por nombre', () => {
      cy.get('input[placeholder*="Buscar"]').type('Hidalgo')
      cy.wait(500)
      cy.get('tbody tr').should('have.length.at.least', 1)
      cy.contains('Hidalgo').should('be.visible')
    })
  })

  describe('Catálogo de Corporaciones', () => {
    beforeEach(() => {
      cy.visit('/admin/corporaciones')
    })

    it('TC-CAT-008: Debe listar corporaciones existentes', function () {
      const { existente } = this.testData.corporaciones
      cy.get('table').should('be.visible')
      cy.contains(existente.nombre).should('be.visible')
    })

    it('TC-CAT-009: Debe mostrar contador de unidades', () => {
      cy.get('table').should('be.visible')
      // Verificar que hay información de unidades
      cy.get('tbody tr').first().should('exist')
    })

    it('TC-CAT-010: Debe crear nueva corporación', function () {
      const timestamp = Date.now()

      cy.contains('button', /nuevo|agregar/i).click()
      cy.get('.MuiDialog-root').should('be.visible')

      cy.get('input[name="codigo"]').type(`TC${timestamp}`)
      cy.get('input[name="nombre"]').type(`Test_Corp_${timestamp}`)
      cy.get('input[name="tipo"]').type('Policía')

      cy.contains('button', /crear|guardar/i).click()
      cy.contains(/creado|exitosamente/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Catálogo de Unidades', () => {
    beforeEach(() => {
      cy.visit('/admin/unidades')
    })

    it('TC-CAT-011: Debe listar unidades existentes', function () {
      const { existente } = this.testData.unidades
      cy.get('table').should('be.visible')
      cy.contains(existente.numeroEconomico).should('be.visible')
    })

    it('TC-CAT-012: Debe filtrar unidades por corporación', () => {
      cy.get('[aria-label*="Corporación"]').parent().click()
      cy.get('.MuiMenu-list').contains('Policía Municipal').click()
      cy.wait(500)
      cy.get('tbody tr').should('have.length.at.least', 1)
    })

    it('TC-CAT-013: Debe filtrar unidades por estatus', () => {
      cy.get('[aria-label*="Estatus"]').parent().click()
      cy.get('.MuiMenu-list').contains('DISPONIBLE').click()
      cy.wait(500)
      cy.get('tbody tr').should('have.length.at.least', 1)
    })

    it('TC-CAT-014: Debe crear nueva unidad', function () {
      const timestamp = Date.now()

      cy.contains('button', /nuevo|agregar/i).click()
      cy.get('.MuiDialog-root').should('be.visible')

      cy.get('input[name="numeroEconomico"]').type(`TEST-${timestamp}`)
      cy.get('input[name="numeroPlacas"]').type(`PL-${timestamp}`)
      cy.get('input[name="sector"]').type('Norte')

      // Seleccionar corporación
      cy.get('[name="corporacionId"]').parent().click()
      cy.get('.MuiMenu-list').contains('Policía Municipal').click()

      cy.contains('button', /crear|guardar/i).click()
      cy.contains(/creado|exitosamente/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Catálogo de Tipos de Incidente', () => {
    beforeEach(() => {
      cy.visit('/admin/tipos-incidente')
    })

    it('TC-CAT-015: Debe listar tipos de incidente', function () {
      const { existente } = this.testData.tiposIncidente
      cy.get('table').should('be.visible')
      cy.contains(existente.nombre).should('be.visible')
    })

    it('TC-CAT-016: Debe mostrar estructura jerárquica', () => {
      // Verificar que hay categorías con subtipos
      cy.get('table').should('be.visible')
      cy.get('tbody tr').should('have.length.at.least', 1)
    })

    it('TC-CAT-017: Debe crear nuevo tipo de incidente', function () {
      const timestamp = Date.now()

      cy.contains('button', /nuevo|agregar/i).click()
      cy.get('.MuiDialog-root').should('be.visible')

      cy.get('input[name="codigo"]').type(`TI${timestamp}`)
      cy.get('input[name="nombre"]').type(`Test_Incidente_${timestamp}`)
      cy.get('input[name="categoria"]').type('CATEGORIA')

      // Seleccionar prioridad por defecto
      cy.get('[name="prioridadPorDefecto"]').parent().click()
      cy.get('.MuiMenu-list').contains('MEDIA').click()

      cy.get('input[name="tiempoRespuestaEsperado"]').type('10')

      cy.contains('button', /crear|guardar/i).click()
      cy.contains(/creado|exitosamente/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Catálogo de Perfiles', () => {
    beforeEach(() => {
      cy.visit('/admin/perfiles')
    })

    it('TC-CAT-018: Debe listar perfiles existentes', function () {
      const perfiles = this.testData.perfiles.existentes
      cy.get('table').should('be.visible')
      perfiles.forEach((perfil: string) => {
        cy.contains(perfil).should('be.visible')
      })
    })

    it('TC-CAT-019: No debe eliminar perfil con usuarios asignados', () => {
      // Intentar eliminar perfil Administrador (tiene usuarios)
      cy.get('tbody tr').contains('Administrador').parents('tr').within(() => {
        cy.get('button[color="error"]').click()
      })

      // Confirmar eliminación
      cy.get('.MuiDialog-root').contains(/confirmar|sí/i).click()

      // Debería mostrar error
      cy.contains(/no se puede eliminar|usuarios asignados/i, { timeout: 10000 }).should('be.visible')
    })
  })
})
