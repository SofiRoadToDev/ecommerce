#!/usr/bin/env node

// Versión sin dotenv - usa las variables directamente
const { createClient } = require('@supabase/supabase-js')

// Leer variables manualmente del archivo .env.local
const fs = require('fs')
const path = require('path')

console.log('🔍 DEBUGGING: Database error querying schema (SIN DOTENV)')
console.log('=======================================================')

// Función simple para leer el archivo .env.local
function readEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    const env = {}
    envContent.split('\n').forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split('=')
        if (key && value) {
          env[key.trim()] = value.trim()
        }
      }
    })
    
    return env
  } catch (error) {
    console.error('❌ Error leyendo .env.local:', error.message)
    return {}
  }
}

const env = readEnvFile()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('📋 Variables detectadas:')
console.log('- URL:', supabaseUrl ? '✅ Presente' : '❌ Faltante')
console.log('- Anon Key:', supabaseAnonKey ? '✅ Presente' : '❌ Faltante')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables críticas')
  process.exit(1)
}

// Crear cliente igual que en el login
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugLogin() {
  try {
    console.log('\n📋 Test 1: Intentando login con credenciales de prueba...')
    
    // Test con credenciales que sabemos que fallarán, pero nos darán info
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'wrongpassword'
    })
    
    if (error) {
      console.log('❌ Error en login (esperado):', error.message)
      console.log('   Código:', error.code)
      console.log('   Estado:', error.status)
      console.log('   Detalles:', error.details)
    } else {
      console.log('✅ Login exitoso (inesperado)')
    }

    console.log('\n📋 Test 2: Verificando estructura de auth...')
    
    // Intentar obtener información del usuario actual
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.log('⚠️  Error obteniendo usuario:', userError.message)
    } else {
      console.log('✅ Usuario obtenido:', userData.user?.email || 'No hay usuario')
    }

    console.log('\n📋 Test 3: Verificando tablas de datos...')
    
    // Test tabla products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.log('❌ Error en products:', productsError.message)
      console.log('   Esto podría indicar problema con RLS o conexión')
    } else {
      console.log('✅ Tabla products accesible')
    }

    console.log('\n✅ Debug completado')
    
    // Resumen de posibles causas
    console.log('\n🎯 DIAGNÓSTICO RÁPIDO:')
    console.log('Si ves "Database error querying schema", las causas más comunes son:')
    console.log('1. Problemas con la URL de Supabase')
    console.log('2. Proyecto Supabase inactivo o en región incorrecta')
    console.log('3. CORS o problemas de red')
    console.log('4. RLS mal configurado')
    
  } catch (criticalError) {
    console.error('❌ Error crítico:', criticalError.message)
    console.log('\n💡 Este error sugiere problema con:')
    console.log('   - Conexión a Supabase')
    console.log('   - Variables de entorno mal configuradas')
    console.log('   - Proyecto Supabase inexistente o inactivo')
  }
}

debugLogin()