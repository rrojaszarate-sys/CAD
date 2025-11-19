import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes (opcional - comentar en producción)
  console.log('🧹 Limpiando datos existentes...')
  await prisma.registroAuditoria.deleteMany()
  await prisma.ausencia.deleteMany()
  await prisma.historialEstadoMision.deleteMany()
  await prisma.mision.deleteMany()
  await prisma.registroUnidad.deleteMany()
  await prisma.historialIncidente.deleteMany()
  await prisma.involucrado.deleteMany()
  await prisma.llamadaTelefonica.deleteMany()
  await prisma.incidente.deleteMany()
  await prisma.restriccionTelefonica.deleteMany()
  await prisma.unidad.deleteMany()
  await prisma.corporacion.deleteMany()
  await prisma.tipoIncidente.deleteMany()
  await prisma.calle.deleteMany()
  await prisma.colonia.deleteMany()
  await prisma.usuarioCorporacion.deleteMany()
  await prisma.usuarioMunicipio.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.perfil.deleteMany()
  await prisma.municipio.deleteMany()

  // 1. Crear Perfiles
  console.log('👥 Creando perfiles...')
  const profiles = await Promise.all([
    prisma.perfil.create({
      data: {
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema',
        permisos: {
          all: true,
        },
      },
    }),
    prisma.perfil.create({
      data: {
        nombre: 'Supervisor',
        descripcion: 'Supervisión de operaciones',
        permisos: {
          viewAll: true,
          manageRestrictions: true,
          approveAbsences: true,
          reactivateIncidents: true,
          viewReports: true,
        },
      },
    }),
    prisma.perfil.create({
      data: {
        nombre: 'Operador',
        descripcion: 'Operador de recepción de llamadas',
        permisos: {
          receiveCalls: true,
          createIncidents: true,
          viewIncidents: true,
        },
      },
    }),
    prisma.perfil.create({
      data: {
        nombre: 'Despachador',
        descripcion: 'Despacho de unidades',
        permisos: {
          viewIncidents: true,
          assignUnits: true,
          manageMissions: true,
        },
      },
    }),
  ])

  console.log(`✅ ${profiles.length} perfiles creados`)

  // 2. Crear Municipios
  console.log('🏙️  Creando municipios...')
  const municipalities = await Promise.all([
    prisma.municipio.create({ data: { nombre: 'Toluca', estado: 'Estado de México' } }),
    prisma.municipio.create({ data: { nombre: 'Metepec', estado: 'Estado de México' } }),
    prisma.municipio.create({ data: { nombre: 'Lerma', estado: 'Estado de México' } }),
    prisma.municipio.create({ data: { nombre: 'Zinacantepec', estado: 'Estado de México' } }),
  ])

  console.log(`✅ ${municipalities.length} municipios creados`)

  // 3. Crear Colonias (Toluca)
  console.log('🏘️  Creando colonias...')
  const colonies = await Promise.all([
    prisma.colonia.create({
      data: {
        nombre: 'Centro',
        codigoPostal: '50000',
        municipioId: municipalities[0].id,
        latitud: 19.2926,
        longitud: -99.6568,
      },
    }),
    prisma.colonia.create({
      data: {
        nombre: 'La Merced',
        codigoPostal: '50080',
        municipioId: municipalities[0].id,
        latitud: 19.2850,
        longitud: -99.6600,
      },
    }),
    prisma.colonia.create({
      data: {
        nombre: 'San Sebastián',
        codigoPostal: '50090',
        municipioId: municipalities[0].id,
        latitud: 19.2950,
        longitud: -99.6450,
      },
    }),
  ])

  console.log(`✅ ${colonies.length} colonias creadas`)

  // 4. Crear Calles
  console.log('🛣️  Creando calles...')
  const streets = await Promise.all([
    prisma.calle.create({
      data: { nombre: 'Hidalgo', municipioId: municipalities[0].id },
    }),
    prisma.calle.create({
      data: { nombre: 'Juárez', municipioId: municipalities[0].id },
    }),
    prisma.calle.create({
      data: { nombre: 'Independencia', municipioId: municipalities[0].id },
    }),
    prisma.calle.create({
      data: { nombre: 'Morelos', municipioId: municipalities[0].id },
    }),
  ])

  console.log(`✅ ${streets.length} calles creadas`)

  // 5. Crear Tipos de Incidente
  console.log('🚨 Creando tipos de incidente...')
  const incidentTypes = await Promise.all([
    // Seguridad Pública
    prisma.tipoIncidente.create({
      data: {
        codigo: 'SEG',
        nombre: 'Seguridad Pública',
        categoria: 'CATEGORIA',
        prioridadPorDefecto: 'ALTA',
        tiempoRespuestaEsperado: 5,
        corporacionesSugeridas: [],
      },
    }),
    // Robo
    prisma.tipoIncidente.create({
      data: {
        codigo: 'SEG_ROBO',
        nombre: 'Robo',
        categoria: 'Seguridad Pública',
        prioridadPorDefecto: 'ALTA',
        tiempoRespuestaEsperado: 5,
        requiereCuestionario: true,
        corporacionesSugeridas: [],
      },
    }),
    // Emergencias Médicas
    prisma.tipoIncidente.create({
      data: {
        codigo: 'MED',
        nombre: 'Emergencias Médicas',
        categoria: 'CATEGORIA',
        prioridadPorDefecto: 'CRITICA',
        tiempoRespuestaEsperado: 3,
        corporacionesSugeridas: [],
      },
    }),
    // Protección Civil
    prisma.tipoIncidente.create({
      data: {
        codigo: 'PC',
        nombre: 'Protección Civil',
        categoria: 'CATEGORIA',
        prioridadPorDefecto: 'MEDIA',
        tiempoRespuestaEsperado: 10,
        corporacionesSugeridas: [],
      },
    }),
  ])

  console.log(`✅ ${incidentTypes.length} tipos de incidente creados`)

  // 6. Crear Corporaciones
  console.log('🚔 Creando corporaciones...')
  const corporations = await Promise.all([
    prisma.corporacion.create({
      data: {
        codigo: 'PM',
        nombre: 'Policía Municipal',
        tipo: 'Policía',
      },
    }),
    prisma.corporacion.create({
      data: {
        codigo: 'PE',
        nombre: 'Policía Estatal',
        tipo: 'Policía',
      },
    }),
    prisma.corporacion.create({
      data: {
        codigo: 'CR',
        nombre: 'Cruz Roja',
        tipo: 'Médica',
      },
    }),
    prisma.corporacion.create({
      data: {
        codigo: 'BOM',
        nombre: 'Bomberos',
        tipo: 'Protección Civil',
      },
    }),
    prisma.corporacion.create({
      data: {
        codigo: 'PC',
        nombre: 'Protección Civil',
        tipo: 'Protección Civil',
      },
    }),
  ])

  console.log(`✅ ${corporations.length} corporaciones creadas`)

  // 7. Crear Unidades
  console.log('🚓 Creando unidades...')
  const units = []
  for (let i = 1; i <= 10; i++) {
    const unit = await prisma.unidad.create({
      data: {
        numeroEconomico: `PM-${String(i).padStart(3, '0')}`,
        numeroPlacas: `ABC-${String(i).padStart(3, '0')}-A`,
        corporacionId: corporations[0].id, // Policía Municipal
        estatus: 'DISPONIBLE',
        sector: i <= 3 ? 'Norte' : i <= 6 ? 'Centro' : 'Sur',
      },
    })
    units.push(unit)
  }

  console.log(`✅ ${units.length} unidades creadas`)

  // 8. Crear Usuarios
  console.log('👤 Creando usuarios...')
  const hashedPassword = await bcrypt.hash('Admin123', 12)

  const admin = await prisma.usuario.create({
    data: {
      nombreUsuario: 'ADMIN',
      contrasena: hashedPassword,
      correoElectronico: 'admin@cad.local',
      nombre: 'Administrador',
      apellidoPaterno: 'Sistema',
      perfilId: profiles[0].id, // Administrador
      accesoTelefoniaHabilitado: false,
    },
  })

  const supervisor = await prisma.usuario.create({
    data: {
      nombreUsuario: 'SUP_001',
      contrasena: hashedPassword,
      nombre: 'Supervisor',
      apellidoPaterno: 'Principal',
      perfilId: profiles[1].id, // Supervisor
      accesoTelefoniaHabilitado: false,
    },
  })

  const operador = await prisma.usuario.create({
    data: {
      nombreUsuario: 'OP_001',
      contrasena: hashedPassword,
      nombre: 'Operador',
      apellidoPaterno: 'Uno',
      perfilId: profiles[2].id, // Operador
      accesoTelefoniaHabilitado: true,
      extension: '1001',
      extensionActiva: true,
    },
  })

  const despachador = await prisma.usuario.create({
    data: {
      nombreUsuario: 'DESP_001',
      contrasena: hashedPassword,
      nombre: 'Despachador',
      apellidoPaterno: 'Uno',
      perfilId: profiles[3].id, // Despachador
      accesoTelefoniaHabilitado: false,
    },
  })

  console.log(`✅ 4 usuarios creados`)

  // 9. Asignar Municipios a Usuarios
  console.log('🗺️  Asignando municipios a usuarios...')
  await Promise.all([
    prisma.usuarioMunicipio.create({
      data: {
        usuarioId: admin.id,
        municipioId: municipalities[0].id,
      },
    }),
    prisma.usuarioMunicipio.create({
      data: {
        usuarioId: operador.id,
        municipioId: municipalities[0].id,
      },
    }),
  ])

  // 10. Crear Restricciones de ejemplo
  console.log('📵 Creando restricciones telefónicas de ejemplo...')
  await prisma.restriccionTelefonica.create({
    data: {
      numeroTelefono: '55-1234-5678',
      tipo: 'BROMA',
      nombrePersona: 'Juan Pérez',
      fechaInicio: new Date(),
      esIndefinido: true,
      observaciones: 'Llamadas recurrentes falsas',
      creadoPorId: admin.id,
    },
  })

  console.log('✅ Restricciones creadas')

  console.log('')
  console.log('╔════════════════════════════════════════════════════════╗')
  console.log('║         🎉 SEED COMPLETADO EXITOSAMENTE 🎉            ║')
  console.log('╠════════════════════════════════════════════════════════╣')
  console.log('║  Datos creados:                                       ║')
  console.log(`║  • ${profiles.length} Perfiles                        ║`)
  console.log(`║  • ${municipalities.length} Municipios                ║`)
  console.log(`║  • ${colonies.length} Colonias                        ║`)
  console.log(`║  • ${streets.length} Calles                           ║`)
  console.log(`║  • ${incidentTypes.length} Tipos de Incidente         ║`)
  console.log(`║  • ${corporations.length} Corporaciones               ║`)
  console.log(`║  • ${units.length} Unidades                           ║`)
  console.log('║  • 4 Usuarios                                         ║')
  console.log('║                                                       ║')
  console.log('║  Usuario de prueba:                                   ║')
  console.log('║  - Username: ADMIN                                    ║')
  console.log('║  - Password: Admin123                                 ║')
  console.log('╚════════════════════════════════════════════════════════╝')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
