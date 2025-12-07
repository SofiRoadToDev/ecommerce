#!/bin/bash

# Script rápido para diagnosticar y arreglar el error de login

echo "🔧 Diagnóstico de Login de Supabase"
echo "=================================="

# 1. Verificar variables de entorno
echo "📋 Verificando variables de entorno..."
if [ -f ".env.local" ]; then
    echo "✅ Archivo .env.local encontrado"
    source .env.local
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        echo "❌ Falta NEXT_PUBLIC_SUPABASE_URL"
    else
        echo "✅ NEXT_PUBLIC_SUPABASE_URL configurada"
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
        echo "❌ Falta NEXT_PUBLIC_SUPABASE_ANON_KEY"
    else
        echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurada"
    fi
else
    echo "❌ No se encontró .env.local"
fi

# 2. Verificar tipos de TypeScript
echo ""
echo "📋 Verificando tipos de TypeScript..."
if grep -q "never" types/database.ts; then
    echo "⚠️  Se encontraron tipos 'never' en types/database.ts - esto puede causar errores"
else
    echo "✅ No se encontraron tipos 'never' problemáticos"
fi

# 3. Verificar que el proyecto esté construido
echo ""
echo "📋 Verificando build..."
if [ -d ".next" ]; then
    echo "✅ Directorio .next encontrado"
else
    echo "⚠️  No se encontró .next - necesitas construir el proyecto"
fi

# 4. Intentar construir para ver errores
echo ""
echo "📋 Intentando construir para detectar errores..."
npm run build 2>&1 | grep -i "error" || echo "✅ Build exitoso"

echo ""
echo "🎯 Acciones Recomendadas:"
echo "1. Verifica que tus claves de Supabase sean las correctas en el dashboard"
echo "2. Ejecuta: node debug-supabase.js"
echo "3. Si hay errores de tipos, revisa types/database.ts"
echo "4. Asegúrate de tener un usuario admin con metadata correcto"
echo "5. Revisa la guía completa: SOLUCION_ERROR_LOGIN.md"