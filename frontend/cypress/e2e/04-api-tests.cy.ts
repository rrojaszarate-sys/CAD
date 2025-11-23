// ===========================================
// PRUEBAS DE API - SISTEMA CAD
// ===========================================

describe('API Backend Tests', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:4000/api'
  let authToken: string

  beforeEach(() => {
    cy.fixture('testData').as('testData')
  })

  describe('Endpoints de Autenticación', () => {
    it('TC-API-001: POST /auth/login - Login exitoso', function () {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/auth/login`,
        body: {
          username: 'ADMIN',
          password: 'Admin123',
        },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.eq(true)
        expect(response.body.data).to.have.property('user')
        expect(response.body.data).to.have.property('tokens')
        expect(response.body.data.tokens).to.have.property('accessToken')
        authToken = response.body.data.tokens.accessToken
      })
    })

    it('TC-API-002: POST /auth/login - Credenciales inválidas', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/auth/login`,
        body: {
          username: 'NOEXISTE',
          password: 'incorrecta',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401])
        expect(response.body.success).to.eq(false)
      })
    })

    it('TC-API-003: GET /auth/profiles - Obtener perfiles disponibles', () => {
      // Primero hacer login
      cy.request({
        method: 'POST',
        url: `${apiUrl}/auth/login`,
        body: { username: 'ADMIN', password: 'Admin123' },
      }).then((loginResponse) => {
        const token = loginResponse.body.data.tokens.accessToken

        cy.request({
          method: 'GET',
          url: `${apiUrl}/catalogs/profiles`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.eq(true)
          expect(response.body.data).to.be.an('array')
        })
      })
    })
  })

  describe('Endpoints de Usuarios', () => {
    beforeEach(() => {
      // Obtener token de autenticación
      cy.request({
        method: 'POST',
        url: `${apiUrl}/auth/login`,
        body: { username: 'ADMIN', password: 'Admin123' },
      }).then((response) => {
        authToken = response.body.data.tokens.accessToken
      })
    })

    it('TC-API-004: GET /users - Listar usuarios', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/users`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.eq(true)
        expect(response.body.data).to.be.an('array')
        expect(response.body.data.length).to.be.greaterThan(0)
      })
    })

    it('TC-API-005: GET /users?search=ADMIN - Filtrar por búsqueda', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/users?search=ADMIN`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
        const adminUser = response.body.data.find((u: any) => u.nombreUsuario === 'ADMIN')
        expect(adminUser).to.exist
      })
    })

    it('TC-API-006: POST /users - Crear usuario', function () {
      const timestamp = Date.now()
      const newUser = {
        nombreUsuario: `API_TEST_${timestamp}`,
        contrasena: 'Test123456',
        nombre: 'API',
        apellidoPaterno: 'Test',
        perfilId: '', // Se llenará dinámicamente
      }

      // Obtener ID de perfil
      cy.request({
        method: 'GET',
        url: `${apiUrl}/catalogs/profiles`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((profileResponse) => {
        const operadorPerfil = profileResponse.body.data.find((p: any) => p.nombre === 'Operador')
        newUser.perfilId = operadorPerfil.id

        cy.request({
          method: 'POST',
          url: `${apiUrl}/users`,
          headers: { Authorization: `Bearer ${authToken}` },
          body: newUser,
        }).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body.success).to.eq(true)
          expect(response.body.data.nombreUsuario).to.eq(newUser.nombreUsuario)
        })
      })
    })

    it('TC-API-007: PUT /users/:id - Actualizar usuario', () => {
      // Primero obtener lista de usuarios
      cy.request({
        method: 'GET',
        url: `${apiUrl}/users?search=OP_001`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        const user = response.body.data[0]

        cy.request({
          method: 'PUT',
          url: `${apiUrl}/users/${user.id}`,
          headers: { Authorization: `Bearer ${authToken}` },
          body: {
            nombre: 'Operador Actualizado',
          },
        }).then((updateResponse) => {
          expect(updateResponse.status).to.eq(200)
          expect(updateResponse.body.success).to.eq(true)
        })
      })
    })

    it('TC-API-008: POST /users/:id/reset-password - Resetear contraseña', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/users?search=OP_001`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        const user = response.body.data[0]

        cy.request({
          method: 'POST',
          url: `${apiUrl}/users/${user.id}/reset-password`,
          headers: { Authorization: `Bearer ${authToken}` },
          body: { nuevaContrasena: 'Admin123' },
        }).then((resetResponse) => {
          expect(resetResponse.status).to.eq(200)
          expect(resetResponse.body.success).to.eq(true)
        })
      })
    })
  })

  describe('Endpoints de Catálogos', () => {
    beforeEach(() => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/auth/login`,
        body: { username: 'ADMIN', password: 'Admin123' },
      }).then((response) => {
        authToken = response.body.data.tokens.accessToken
      })
    })

    it('TC-API-009: GET /catalogs/municipalities - Listar municipios', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/catalogs/municipalities`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
        expect(response.body.data.length).to.be.greaterThan(0)
      })
    })

    it('TC-API-010: GET /catalogs/colonies - Listar colonias', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/catalogs/colonies`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
      })
    })

    it('TC-API-011: GET /catalogs/streets - Listar calles', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/catalogs/streets`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
      })
    })

    it('TC-API-012: GET /catalogs/corporations - Listar corporaciones', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/catalogs/corporations`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
        expect(response.body.data.length).to.be.greaterThan(0)
      })
    })

    it('TC-API-013: GET /catalogs/units - Listar unidades', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/catalogs/units`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
      })
    })

    it('TC-API-014: GET /catalogs/incident-types - Listar tipos de incidente', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/catalogs/incident-types`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
      })
    })

    it('TC-API-015: GET /catalogs/incident-types/hierarchy - Obtener jerarquía', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/catalogs/incident-types/hierarchy`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
      })
    })

    it('TC-API-016: GET /catalogs/profiles - Listar perfiles', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/catalogs/profiles`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.be.an('array')
        expect(response.body.data.length).to.eq(4) // 4 perfiles por defecto
      })
    })
  })

  describe('Seguridad de API', () => {
    it('TC-API-017: Endpoints protegidos requieren autenticación', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/users`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('TC-API-018: Token inválido es rechazado', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/users`,
        headers: { Authorization: 'Bearer token_invalido' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('TC-API-019: Operador no puede crear usuarios', () => {
      // Login como operador
      cy.request({
        method: 'POST',
        url: `${apiUrl}/auth/login`,
        body: { username: 'OP_001', password: 'Admin123' },
      }).then((response) => {
        const operatorToken = response.body.data.tokens.accessToken

        cy.request({
          method: 'POST',
          url: `${apiUrl}/users`,
          headers: { Authorization: `Bearer ${operatorToken}` },
          body: {
            nombreUsuario: 'UNAUTHORIZED_USER',
            contrasena: 'Test123',
            nombre: 'Test',
            apellidoPaterno: 'Test',
            perfilId: 'some-id',
          },
          failOnStatusCode: false,
        }).then((createResponse) => {
          expect(createResponse.status).to.eq(403)
        })
      })
    })
  })

  describe('Health Check', () => {
    it('TC-API-020: GET /health - API está funcionando', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/health`,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.status).to.eq('OK')
      })
    })
  })
})
