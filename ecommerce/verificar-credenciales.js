#!/usr/bin/env node

// Verificar que las credenciales sean las correctas del dashboard
require('dotenv').config({ path: '.env.local' })

console.log('🔍 VERIFICANDO CREDENCIALES')
console.log('============================')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('📋 Credenciales actuales:')
console.log('URL:', supabaseUrl)
console.log('Anon Key (primeros 50 chars):', supabaseAnonKey?.substring(0, 50) + '...')
console.log('Service Role (primeros 50):', serviceRoleKey?.substring(0, 50) + '...')

// Validar formato de las claves
console.log('\n🔍 Validando formato de claves:')

// Las claves JWT de Supabase típicamente empiezan así:
const expectedFormat = /^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./

console.log('Anon Key formato:', expectedFormat.test(supabaseAnonKey || '') ? '✅ OK' : '❌ Inusual')
console.log('Service Role formato:', expectedFormat.test(serviceRoleKey || '') ? '✅ OK' : '❌ Inusual')

// Verificar que la URL tenga el formato correcto
console.log('\n🔍 Validando URL:')
const urlFormat = /^https:\/\/[a-z0-9-]+\.supabase\.co$/
console.log('URL formato:', urlFormat.test(supabaseUrl || '') ? '✅ OK' : '❌ Inusual')

console.log('\n💡 PARA COMPARAR:')
console.log('Ve a Supabase Dashboard → Settings → API')
console.log('Copia exactamente:')
console.log('1. Project URL (debe coincidir con arriba)')
console.log('2. anon key (debe coincidir)')
console.log('3. service_role key (debe coincidir)')

console.log('\n🚨 IMPORTANTE: Las claves deben ser EXACTAMENTE las del dashboard')