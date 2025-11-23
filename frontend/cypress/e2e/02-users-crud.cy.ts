// ===========================================
// PRUEBAS CRUD DE USUARIOS - SISTEMA CAD
// ===========================================

describe('CRUD de Usuarios', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
    // Login como administrador antes de cada prueba
    cy.visit('/login')
    cy.get('input[name="username"]').type('ADMIN')
    cy.get('input[name="password"]').type('Admin123')
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')
    // Navegar a la sección de usuarios
    cy.visit('/admin/usuarios')
  })

  describe('Listado de Usuarios', () => {
    it('TC-USR-001: Debe mostrar la tabla de usuarios', () => {
      cy.get('table').should('be.visible')
      cy.get('tbody tr').should('have.length.at.least', 1)
    })

    it('TC-USR-002: Debe mostrar las columnas correctas', () => {
      cy.get('thead').within(() => {
        cy.contains('Usuario').should('be.visible')
        cy.contains('Nombre').should('be.visible')
        cy.contains('Perfil').should('be.visible')
        cy.contains('Estado').should('be.visible')
        cy.contains('Acciones').should('be.visible')
      })
    })

    it('TC-USR-003: Debe filtrar usuarios por búsqueda', () => {
      cy.get('input[placeholder*="Buscar"]').type('ADMIN')
      cy.wait(500)
      cy.get('tbody tr').should('have.length.at.least', 1)
      cy.contains('ADMIN').should('be.visible')
    })

    it('TC-USR-004: Debe filtrar usuarios por perfil', () => {
      cy.get('[aria-label="Perfil"]').parent().click()
      cy.get('.MuiMenu-list').contains('Administrador').click()
      cy.wait(500)
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row).contains('Administrador').should('be.visible')
      })
    })

    it('TC-USR-005: Debe filtrar usuarios por estado', () => {
      cy.get('[aria-label="Estado"]').parent().click()
      cy.get('.MuiMenu-list').contains('Activos').click()
      cy.wait(500)
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row).contains('ACTIVO').should('be.visible')
      })
    })
  })

  describe('Crear Usuario', () => {
    it('TC-USR-006: Debe abrir modal de creación', function () {
      cy.contains('button', /nuevo/i).click()
      cy.get('.MuiDialog-root').should('be.visible')
      cy.contains('Nuevo Usuario').should('be.visible')
    })

    it('TC-USR-007: Debe validar campos requeridos al crear', function () {
      cy.contains('button', /nuevo/i).click()
      cy.get('.MuiDialog-root').should('be.visible')

      // Intentar guardar sin llenar campos
      cy.contains('button', 'Crear').click()

      // Verificar errores de validación
      cy.contains('requerido').should('be.visible')
    })

    it('TC-USR-008: Debe crear usuario correctamente', function () {
      const { nuevo } = this.testData.usuarios
      const timestamp = Date.now()
      const uniqueUsername = `TEST_${timestamp}`

      cy.contains('button', /nuevo/i).click()
      cy.get('.MuiDialog-root').should('be.visible')

      // Llenar formulario
      cy.get('input[name="nombreUsuario"]').type(uniqueUsername)
      cy.get('input[name="contrasena"]').type(nuevo.contrasena)
      cy.get('input[name="nombre"]').type(nuevo.nombre)
      cy.get('input[name="apellidoPaterno"]').type(nuevo.apellidoPaterno)
      cy.get('input[name="apellidoMaterno"]').type(nuevo.apellidoMaterno)
      cy.get('input[name="correoElectronico"]').type(`test${timestamp}@cad.local`)

      // Seleccionar perfil
      cy.get('[name="perfilId"]').parent().click()
      cy.get('.MuiMenu-list').contains('Operador').click()

      // Guardar
      cy.contains('button', 'Crear').click()

      // Verificar éxito
      cy.contains(/creado exitosamente/i, { timeout: 10000 }).should('be.visible')
    })

    it('TC-USR-009: Debe validar correo electrónico inválido', function () {
      cy.contains('button', /nuevo/i).click()
      cy.get('.MuiDialog-root').should('be.visible')

      cy.get('input[name="correoElectronico"]').type('correo-invalido')
      cy.get('input[name="nombre"]').click() // Blur para disparar validación

      cy.contains(/correo inválido/i).should('be.visible')
    })

    it('TC-USR-010: No debe permitir nombre de usuario duplicado', function () {
      cy.contains('button', /nuevo/i).click()
      cy.get('.MuiDialog-root').should('be.visible')

      // Intentar crear con usuario existente
      cy.get('input[name="nombreUsuario"]').type('ADMIN')
      cy.get('input[name="contrasena"]').type('Test123456')
      cy.get('input[name="nombre"]').type('Test')
      cy.get('input[name="apellidoPaterno"]').type('Test')

      cy.get('[name="perfilId"]').parent().click()
      cy.get('.MuiMenu-list').contains('Operador').click()

      cy.contains('button', 'Crear').click()

      // Verificar error de duplicado
      cy.contains(/ya existe/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Editar Usuario', () => {
    it('TC-USR-011: Debe abrir modal de edición', () => {
      cy.get('tbody tr').first().within(() => {
        cy.get('button[aria-label="Editar"], button:has(svg)').first().click()
      })
      cy.get('.MuiDialog-root').should('be.visible')
      cy.contains('Editar Usuario').should('be.visible')
    })

    it('TC-USR-012: Debe cargar datos del usuario en el formulario', () => {
      cy.get('tbody tr').first().within(() => {
        cy.get('button[aria-label="Editar"], button:has(svg)').first().click()
      })
      cy.get('.MuiDialog-root').should('be.visible')

      // El campo nombreUsuario debe estar deshabilitado y con valor
      cy.get('input[name="nombreUsuario"]').should('be.disabled').and('not.have.value', '')
    })

    it('TC-USR-013: Debe actualizar usuario correctamente', () => {
      // Buscar un usuario de prueba
      cy.get('input[placeholder*="Buscar"]').type('OP_001')
      cy.wait(500)

      cy.get('tbody tr').first().within(() => {
        cy.get('button[aria-label="Editar"], button:has(svg)').first().click()
      })
      cy.get('.MuiDialog-root').should('be.visible')

      // Modificar nombre
      cy.get('input[name="nombre"]').clear().type('Operador Actualizado')

      cy.contains('button', 'Actualizar').click()

      cy.contains(/actualizado exitosamente/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Acciones de Usuario', () => {
    it('TC-USR-014: Debe poder resetear contraseña', () => {
      cy.get('tbody tr').contains('OP_001').parents('tr').within(() => {
        cy.get('button[aria-label*="Resetear"], button[color="info"]').click()
      })

      // En el prompt, se ingresaría la nueva contraseña
      // Cypress maneja prompts con cy.stub
    })

    it('TC-USR-015: Debe poder activar/desactivar usuario', () => {
      cy.get('tbody tr').first().within(() => {
        cy.get('button[color="secondary"]').click()
      })

      cy.contains(/activado|desactivado/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Permisos de Usuario', () => {
    it('TC-USR-016: Solo Administrador puede crear usuarios', () => {
      // Ya estamos como admin, verificar que el botón existe
      cy.contains('button', /nuevo/i).should('be.visible')
    })

    it('TC-USR-017: Operador no puede acceder a gestión de usuarios', () => {
      // Cerrar sesión actual
      cy.clearLocalStorage()
      cy.visit('/login')

      // Login como operador
      cy.get('input[name="username"]').type('OP_001')
      cy.get('input[name="password"]').type('Admin123')
      cy.get('button[type="submit"]').click()

      // Intentar acceder a usuarios
      cy.visit('/admin/usuarios')

      // Debería mostrar acceso denegado o redirigir
      cy.url().should('not.include', '/admin/usuarios')
    })
  })
})
