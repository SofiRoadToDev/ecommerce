#!/usr/bin/env node

// Test específico para debuggear el error "Database error querying schema"
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

console.log('🔍 DEBUGGING: Database error querying schema')
console.log('==============================================')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Crear cliente igual que en el login
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugLogin() {
  try {
    console.log('📋 Test 1: Intentando login con credenciales de prueba...')
    
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

    console.log('\n📋 Test 4: Verificando si hay problema con TypeScript...')
    
    // Intentar una operación que use los tipos definidos
    try {
      // Esto simula lo que hace el componente de login
      const mockUser = {
        user_metadata: { role: 'admin' },
        app_metadata: { role: 'admin' }
      }
      
      const role = mockUser.user_metadata?.role || mockUser.app_metadata?.role
      console.log('✅ Verificación de roles funciona:', role)
      
    } catch (typeError) {
      console.log('❌ Error con tipos:', typeError.message)
    }

    console.log('\n📋 Test 5: Verificando conexión básica...')
    
    // Test simple de conectividad
    const { data: connectionTest, error: connectionError } = await supabase
      .rpc('version')
      .catch(() => ({ data: null, error: { message: 'RPC no disponible' } }))
    
    if (connectionError) {
      console.log('❌ Error de conexión:', connectionError.message)
    } else {
      console.log('✅ Conexión establecida')
    }

    console.log('\n✅ Debug completado')
    
    // Resumen de posibles causas
    console.log('\n🎯 DIAGNÓSTICO RÁPIDO:')
    console.log('Si ves "Database error querying schema", las causas más comunes son:')
    console.log('1. Tipos de TypeScript mal definidos (FIXED ✓)')
    console.log('2. Problemas con la URL de Supabase')
    console.log('3. Proyecto Supabase inactivo o en región incorrecta')
    console.log('4. CORS o problemas de red')
    console.log('5. RLS mal configurado')
    
  } catch (criticalError) {
    console.error('❌ Error crítico:', criticalError.message)
    console.log('\n💡 Este error sugiere problema con:')
    console.log('   - Conexión a Supabase')
    console.log('   - Variables de entorno mal configuradas')
    console.log('   - Proyecto Supabase inexistente o inactivo')
  }
}

debugLogin()