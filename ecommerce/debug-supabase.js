#!/usr/bin/env node

// Script de diagnóstico para verificar la conexión a Supabase
const { createClient } = require('@supabase/supabase-js')

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

console.log('🔍 Verificando conexión a Supabase...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test 1: Verificar que podemos obtener el usuario actual
    console.log('\n📋 Test 1: Verificando autenticación...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.log('⚠️  No hay usuario autenticado:', userError.message)
    } else {
      console.log('✅ Usuario obtenido:', user?.email || 'No hay usuario')
    }

    // Test 2: Verificar el esquema de la base de datos
    console.log('\n📋 Test 2: Verificando esquema de base de datos...')
    
    // Verificar tablas
    const tables = ['products', 'orders', 'order_items', 'pending_orders']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Error en tabla ${table}:`, error.message)
        } else {
          console.log(`✅ Tabla ${table}: acceso OK (${data?.length || 0} filas)`)
        }
      } catch (err) {
        console.log(`❌ Error crítico en tabla ${table}:`, err.message)
      }
    }

    // Test 3: Verificar políticas de RLS
    console.log('\n📋 Test 3: Verificando políticas de RLS...')
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies')
      
    if (policiesError) {
      console.log('⚠️  No se pudieron obtener políticas:', policiesError.message)
    } else {
      console.log('✅ Políticas obtenidas')
    }

    // Test 4: Verificar usuarios admin
    console.log('\n📋 Test 4: Buscando usuarios con rol admin...')
    const { data: adminUsers, error: adminError } = await supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
      .like('raw_user_meta_data->role', 'admin')
      .limit(5)

    if (adminError) {
      console.log('⚠️  Error buscando usuarios admin:', adminError.message)
    } else {
      console.log(`✅ Usuarios admin encontrados: ${adminUsers?.length || 0}`)
      adminUsers?.forEach(user => {
        console.log(`   - ${user.email} (${user.id})`)
      })
    }

    console.log('\n✅ Diagnóstico completado')
    
  } catch (error) {
    console.error('❌ Error crítico:', error.message)
    if (error.message.includes('Failed to fetch')) {
      console.log('\n💡 Sugerencia: Verifica que tu proyecto Supabase esté activo y las URLs sean correctas')
    }
  }
}

testConnection()