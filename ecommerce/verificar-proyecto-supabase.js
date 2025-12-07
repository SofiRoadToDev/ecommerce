#!/usr/bin/env node

// Verificar si el proyecto Supabase está activo y accesible
require('dotenv').config({ path: '.env.local' })

console.log('🔍 VERIFICANDO PROYECTO SUPABASE')
console.log('=================================')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('📋 Configuración actual:')
console.log('- URL:', supabaseUrl)
console.log('- Anon Key presente:', !!supabaseAnonKey)
console.log('- Service Role Key presente:', !!serviceRoleKey && serviceRoleKey !== 'dummy_service_key')

// Verificar acceso al proyecto
async function verificarProyecto() {
  try {
    console.log('\n📡 Verificando acceso al proyecto...')
    
    // Test 1: Verificar que la URL responda
    const healthResponse = await fetch(`${supabaseUrl}/health`)
    console.log('Estado health check:', healthResponse.status)
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('✅ Health check:', healthData)
    } else {
      console.log('❌ Health check falló:', healthResponse.status)
    }

    // Test 2: Verificar acceso al REST API
    console.log('\n📡 Verificando REST API...')
    const restResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    console.log('Estado REST API:', restResponse.status)

    // Test 3: Verificar acceso al Auth service
    console.log('\n📡 Verificando Auth service...')
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    console.log('Estado Auth service:', authResponse.status)
    
    if (authResponse.ok) {
      const authData = await authResponse.json()
      console.log('✅ Auth service:', authData)
    } else {
      console.log('❌ Auth service falló:', authResponse.status)
      const errorText = await authResponse.text()
      console.log('Mensaje de error:', errorText)
    }

    // Test 4: Verificar Service Role Key
    console.log('\n🔑 Verificando Service Role Key...')
    const serviceResponse = await fetch(`${supabaseUrl}/rest/v1/products?select=*&limit=1`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      }
    })
    console.log('Estado con Service Role:', serviceResponse.status)

    console.log('\n✅ Verificación completada')
    
  } catch (error) {
    console.error('❌ Error crítico:', error.message)
    console.log('\n💡 Sugerencias:')
    console.log('   1. Verifica que el proyecto esté activo en el dashboard')
    console.log('   2. Revisa que la URL sea exactamente la correcta')
    console.log('   3. Verifica que el proyecto no esté pausado')
    console.log('   4. Revisa la región del proyecto')
  }
}

verificarProyecto()