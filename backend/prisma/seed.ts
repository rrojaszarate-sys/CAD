import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes (opcional - comentar en producción)
  console.log('🧹 Limpiando datos existentes...')
  await prisma.auditLog.deleteMany()
  await prisma.absence.deleteMany()
  await prisma.missionStatus.deleteMany()
  await prisma.mission.deleteMany()
  await prisma.unitLog.deleteMany()
  await prisma.incidentHistory.deleteMany()
  await prisma.incidentCorporation.deleteMany()
  await prisma.involved.deleteMany()
  await prisma.phoneCall.deleteMany()
  await prisma.incident.deleteMany()
  await prisma.phoneRestriction.deleteMany()
  await prisma.unit.deleteMany()
  await prisma.corporation.deleteMany()
  await prisma.incidentType.deleteMany()
  await prisma.street.deleteMany()
  await prisma.colony.deleteMany()
  await prisma.userCorporation.deleteMany()
  await prisma.userMunicipality.deleteMany()
  await prisma.user.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.municipality.deleteMany()

  // 1. Crear Perfiles
  console.log('👥 Creando perfiles...')
  const profiles = await Promise.all([
    prisma.profile.create({
      data: {
        name: 'Administrador',
        description: 'Acceso completo al sistema',
        permissions: {
          all: true,
        },
      },
    }),
    prisma.profile.create({
      data: {
        name: 'Supervisor',
        description: 'Supervisión de operaciones',
        permissions: {
          viewAll: true,
          manageRestrictions: true,
          approveAbsences: true,
          reactivateIncidents: true,
          viewReports: true,
        },
      },
    }),
    prisma.profile.create({
      data: {
        name: 'Operador',
        description: 'Operador de recepción de llamadas',
        permissions: {
          receiveCalls: true,
          createIncidents: true,
          viewIncidents: true,
        },
      },
    }),
    prisma.profile.create({
      data: {
        name: 'Despachador',
        description: 'Despacho de unidades',
        permissions: {
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
    prisma.municipality.create({ data: { name: 'Toluca', state: 'Estado de México' } }),
    prisma.municipality.create({ data: { name: 'Metepec', state: 'Estado de México' } }),
    prisma.municipality.create({ data: { name: 'Lerma', state: 'Estado de México' } }),
    prisma.municipality.create({ data: { name: 'Zinacantepec', state: 'Estado de México' } }),
  ])

  console.log(`✅ ${municipalities.length} municipios creados`)

  // 3. Crear Colonias (Toluca)
  console.log('🏘️  Creando colonias...')
  const colonies = await Promise.all([
    prisma.colony.create({
      data: {
        name: 'Centro',
        postalCode: '50000',
        municipalityId: municipalities[0].id,
        latitude: 19.2926,
        longitude: -99.6568,
      },
    }),
    prisma.colony.create({
      data: {
        name: 'La Merced',
        postalCode: '50080',
        municipalityId: municipalities[0].id,
        latitude: 19.2850,
        longitude: -99.6600,
      },
    }),
    prisma.colony.create({
      data: {
        name: 'San Sebastián',
        postalCode: '50090',
        municipalityId: municipalities[0].id,
        latitude: 19.2950,
        longitude: -99.6450,
      },
    }),
  ])

  console.log(`✅ ${colonies.length} colonias creadas`)

  // 4. Crear Calles
  console.log('🛣️  Creando calles...')
  const streets = await Promise.all([
    prisma.street.create({
      data: { name: 'Hidalgo', municipalityId: municipalities[0].id },
    }),
    prisma.street.create({
      data: { name: 'Juárez', municipalityId: municipalities[0].id },
    }),
    prisma.street.create({
      data: { name: 'Independencia', municipalityId: municipalities[0].id },
    }),
    prisma.street.create({
      data: { name: 'Morelos', municipalityId: municipalities[0].id },
    }),
  ])

  console.log(`✅ ${streets.length} calles creadas`)

  // 5. Crear Tipos de Incidente
  console.log('🚨 Creando tipos de incidente...')
  const incidentTypes = await Promise.all([
    // Seguridad Pública
    prisma.incidentType.create({
      data: {
        code: 'SEG',
        name: 'Seguridad Pública',
        category: 'CATEGORIA',
        defaultPriority: 'ALTA',
        expectedResponseTime: 5,
        suggestedCorporations: [],
      },
    }),
    // Robo
    prisma.incidentType.create({
      data: {
        code: 'SEG_ROBO',
        name: 'Robo',
        category: 'Seguridad Pública',
        defaultPriority: 'ALTA',
        expectedResponseTime: 5,
        requiresQuestionnaire: true,
        suggestedCorporations: [],
      },
    }),
    // Emergencias Médicas
    prisma.incidentType.create({
      data: {
        code: 'MED',
        name: 'Emergencias Médicas',
        category: 'CATEGORIA',
        defaultPriority: 'CRITICA',
        expectedResponseTime: 3,
        suggestedCorporations: [],
      },
    }),
    // Protección Civil
    prisma.incidentType.create({
      data: {
        code: 'PC',
        name: 'Protección Civil',
        category: 'CATEGORIA',
        defaultPriority: 'MEDIA',
        expectedResponseTime: 10,
        suggestedCorporations: [],
      },
    }),
  ])

  console.log(`✅ ${incidentTypes.length} tipos de incidente creados`)

  // 6. Crear Corporaciones
  console.log('🚔 Creando corporaciones...')
  const corporations = await Promise.all([
    prisma.corporation.create({
      data: {
        code: 'PM',
        name: 'Policía Municipal',
        type: 'Policía',
      },
    }),
    prisma.corporation.create({
      data: {
        code: 'PE',
        name: 'Policía Estatal',
        type: 'Policía',
      },
    }),
    prisma.corporation.create({
      data: {
        code: 'CR',
        name: 'Cruz Roja',
        type: 'Médica',
      },
    }),
    prisma.corporation.create({
      data: {
        code: 'BOM',
        name: 'Bomberos',
        type: 'Protección Civil',
      },
    }),
    prisma.corporation.create({
      data: {
        code: 'PC',
        name: 'Protección Civil',
        type: 'Protección Civil',
      },
    }),
  ])

  console.log(`✅ ${corporations.length} corporaciones creadas`)

  // 7. Crear Unidades
  console.log('🚓 Creando unidades...')
  const units = []
  for (let i = 1; i <= 10; i++) {
    const unit = await prisma.unit.create({
      data: {
        economicNumber: `PM-${String(i).padStart(3, '0')}`,
        plateNumber: `ABC-${String(i).padStart(3, '0')}-A`,
        corporationId: corporations[0].id, // Policía Municipal
        status: 'DISPONIBLE',
        sector: i <= 3 ? 'Norte' : i <= 6 ? 'Centro' : 'Sur',
      },
    })
    units.push(unit)
  }

  console.log(`✅ ${units.length} unidades creadas`)

  // 8. Crear Usuarios
  console.log('👤 Creando usuarios...')
  const hashedPassword = await bcrypt.hash('Admin123', 12)

  const admin = await prisma.user.create({
    data: {
      username: 'ADMIN',
      password: hashedPassword,
      email: 'admin@cad.local',
      firstName: 'Administrador',
      lastName: 'Sistema',
      profileId: profiles[0].id, // Administrador
      phoneAccessEnabled: false,
    },
  })

  const supervisor = await prisma.user.create({
    data: {
      username: 'SUP_001',
      password: hashedPassword,
      firstName: 'Supervisor',
      lastName: 'Principal',
      profileId: profiles[1].id, // Supervisor
      phoneAccessEnabled: false,
    },
  })

  const operador = await prisma.user.create({
    data: {
      username: 'OP_001',
      password: hashedPassword,
      firstName: 'Operador',
      lastName: 'Uno',
      profileId: profiles[2].id, // Operador
      phoneAccessEnabled: true,
      extension: '1001',
      extensionActive: true,
    },
  })

  const despachador = await prisma.user.create({
    data: {
      username: 'DESP_001',
      password: hashedPassword,
      firstName: 'Despachador',
      lastName: 'Uno',
      profileId: profiles[3].id, // Despachador
      phoneAccessEnabled: false,
    },
  })

  console.log(`✅ 4 usuarios creados`)

  // 9. Asignar Municipios a Usuarios
  console.log('🗺️  Asignando municipios a usuarios...')
  await Promise.all([
    prisma.userMunicipality.create({
      data: {
        userId: admin.id,
        municipalityId: municipalities[0].id,
      },
    }),
    prisma.userMunicipality.create({
      data: {
        userId: operador.id,
        municipalityId: municipalities[0].id,
      },
    }),
  ])

  // 10. Crear Restricciones de ejemplo
  console.log('📵 Creando restricciones telefónicas de ejemplo...')
  await prisma.phoneRestriction.create({
    data: {
      phoneNumber: '55-1234-5678',
      type: 'BROMA',
      personName: 'Juan Pérez',
      startDate: new Date(),
      isIndefinite: true,
      observations: 'Llamadas recurrentes falsas',
      createdBy: admin.id,
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
