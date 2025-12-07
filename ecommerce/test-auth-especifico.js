#!/usr/bin/env node

// Test específico del endpoint de auth que está fallando
require('dotenv').config({ path: '.env.local' })

console.log('🔍 TEST ESPECÍFICO DE AUTH')
console.log('==========================')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Test exactamente el mismo endpoint que falla
async function testAuthEndpoint() {
  try {
    console.log('📡 Probando endpoint:', `${supabaseUrl}/auth/v1/token?grant_type=password`)
    console.log('📡 Con headers:', {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey?.substring(0, 20) + '...',
      'Authorization': `Bearer ${supabaseAnonKey?.substring(0, 20)}...`
    })

    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    })

    console.log('📊 Respuesta completa:')
    console.log('- Status:', response.status)
    console.log('- Status Text:', response.statusText)
    console.log('- Headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('- Body:', responseText)

    if (!response.ok) {
      console.log('\n❌ Error detectado:')
      console.log('Status:', response.status)
      console.log('Mensaje:', responseText)
      
      if (response.status === 500) {
        console.log('\n💡 Error 500 significa problema del lado del servidor Supabase')
        console.log('Posibles causas:')
        console.log('1. Service Role Key incorrecta')
        console.log('2. Problema interno de Supabase')
        console.log('3. Configuración corrupta del proyecto')
      }
    }

  } catch (error) {
    console.error('❌ Error en la petición:', error.message)
    console.log('\n💡 Esto sugiere:')
    console.log('1. Problema de red/CORS')
    console.log('2. URL incorrecta')
    console.log('3. Proyecto inaccesible')
  }
}

testAuthEndpoint()

// También testear el health del auth específicamente
async function testAuthHealth() {
  console.log('\n\n🔍 TEST HEALTH AUTH SERVICE')
  console.log('============================')
  
  try {
    const healthResponse = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        'apikey': supabaseAnonKey
      }
    })
    
    console.log('Auth Health Status:', healthResponse.status)
    const healthData = await healthResponse.text()
    console.log('Auth Health Response:', healthData)
    
  } catch (error) {
    console.log('Auth Health Error:', error.message)
  }
}

setTimeout(testAuthHealth, 2000)