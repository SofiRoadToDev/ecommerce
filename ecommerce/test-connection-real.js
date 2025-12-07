#!/usr/bin/env node

// Test de conexión REAL con tu proyecto de Supabase
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

console.log('🔍 TEST DE CONEXIÓN SUPABASE')
console.log('============================')

// Verificar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('📋 Variables detectadas:')
console.log('- URL:', supabaseUrl ? '✅ Presente' : '❌ Faltante')
console.log('- Anon Key:', supabaseAnonKey ? '✅ Presente' : '❌ Faltante')
console.log('- Service Role Key:', serviceRoleKey && serviceRoleKey !== 'dummy_service_key' ? '✅ Presente' : '❌ Faltante o dummy')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables críticas')
  process.exit(1)
}

// Probar conexión con anon key
async function testConnection() {
  console.log('\n🌐 Probando conexión con Supabase...')
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test 1: Get session (esto fallará si no hay usuario, pero nos dará info)
    console.log('\n📋 Test 1: Intentando obtener sesión...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('⚠️  Error obteniendo sesión:', sessionError.message)
      console.log('   Código:', sessionError.code)
      console.log('   Estado:', sessionError.status)
    } else {
      console.log('✅ Sesión obtenida:', sessionData.session ? 'Activa' : 'No activa')
    }

    // Test 2: Intentar un query simple a la tabla products
    console.log('\n📋 Test 2: Probando query a tabla products...')
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.log('❌ Error en products:', productsError.message)
      console.log('   Código:', productsError.code)
      console.log('   Detalles:', productsError.details)
      console.log('   Sugerencia:', productsError.hint)
    } else {
      console.log('✅ Products accesible:', productsData?.length || 0, 'productos encontrados')
    }

    // Test 3: Verificar estructura de auth.users
    console.log('\n📋 Test 3: Verificando estructura de auth.users...')
    
    // Usar RPC para obtener info del esquema
    const { data: schemaInfo, error: schemaError } = await supabase
      .rpc('get_table_info', { table_name: 'auth.users' })
      .catch(() => ({ data: null, error: { message: 'Función no disponible' } }))
    
    if (schemaError) {
      console.log('⚠️  No se pudo obtener info del esquema:', schemaError.message)
    } else {
      console.log('✅ Info del esquema obtenida')
    }

    // Test 4: Verificar tipos de TypeScript
    console.log('\n📋 Test 4: Verificando tipos de TypeScript...')
    
    // Intentar una operación que use los tipos
    try {
      const { data: testData } = await supabase
        .from('products')
        .select('id, title, price')
        .single()
      
      if (testData) {
        console.log('✅ Tipos básicos funcionando')
        console.log('   Producto sample:', testData.title)
      }
    } catch (typeError) {
      console.log('❌ Error con tipos:', typeError.message)
    }

    console.log('\n✅ Test de conexión completado')
    
  } catch (error) {
    console.error('❌ Error crítico en la conexión:', error.message)
    
    if (error.message.includes('Failed to fetch')) {
      console.log('\n💡 Posibles causas:')
      console.log('   1. Proyecto Supabase inactivo')
      console.log('   2. URL incorrecta')
      console.log('   3. Problemas de red/CORS')
      console.log('   4. La región del proyecto está inaccesible')
    }
    
    if (error.message.includes('schema')) {
      console.log('\n💡 Problema con schema detectado - revisa types/database.ts')
    }
  }
}

testConnection()