# 🛡️ Rate Limiting Setup Guide

Este proyecto usa **Upstash Redis** para implementar rate limiting y proteger la aplicación contra ataques.

## ¿Por qué es importante?

Rate limiting protege tu e-commerce contra:
- ✅ **Brute force attacks** en login
- ✅ **Spam de órdenes** falsas
- ✅ **Scraping masivo** de productos
- ✅ **DDoS attacks** (denegación de servicio)
- ✅ **Abuso de APIs**

---

## 📋 Configuración (5 minutos)

### Paso 1: Crear cuenta en Upstash (Gratis)

1. Ve a [https://upstash.com](https://upstash.com)
2. Crea una cuenta gratuita
3. Plan gratuito incluye:
   - ✅ 10,000 comandos/día
   - ✅ 256 MB de almacenamiento
   - ✅ Suficiente para pequeños comercios

### Paso 2: Crear base de datos Redis

1. En el dashboard de Upstash, haz clic en **"Create Database"**
2. Configuración recomendada:
   - **Name**: `ecommerce-ratelimit`
   - **Type**: Regional (más rápido)
   - **Region**: Elige la más cercana a tu servidor (ej: `us-east-1` si usas Vercel)
   - **Eviction**: No eviction (para rate limiting)

3. Haz clic en **"Create"**

### Paso 3: Obtener credenciales

1. En tu base de datos, ve a la pestaña **"REST API"**
2. Copia las siguientes credenciales:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Paso 4: Configurar variables de entorno

Agrega las credenciales a tu archivo `.env.local`:

```env
# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxx_your_token_here
```

### Paso 5: Reiniciar servidor de desarrollo

```bash
# Detén el servidor (Ctrl+C)
# Inicia nuevamente
npm run dev
```

---

## ✅ Verificar que funciona

### Test 1: Login Rate Limit

Intenta hacer login con credenciales incorrectas **6 veces seguidas**:

```bash
# Deberías ver este error después del 5to intento:
{
  "error": "Too many login attempts. Please try again in 15 minutes."
}
```

### Test 2: Checkout Rate Limit

Intenta crear **4 órdenes** en menos de 10 minutos:

```bash
# Deberías ver este error después de la 3ra orden:
{
  "error": "Too many order attempts. Please wait 10 minutes."
}
```

### Test 3: API Rate Limit

Haz **101 requests** a cualquier endpoint `/api/` en 1 minuto:

```bash
# Deberías ver:
{
  "error": "Too many requests. Please slow down."
}
```

---

## 📊 Límites Configurados

| Endpoint | Límite | Ventana | Razón |
|----------|--------|---------|-------|
| `/admin/login` | 5 intentos | 15 minutos | Prevenir brute force |
| `/api/create-paypal-order` | 3 órdenes | 10 minutos | Prevenir spam |
| `/api/*` (general) | 100 requests | 1 minuto | Prevenir scraping/DDoS |
| `/api/webhooks/*` | Sin límite | - | PayPal necesita enviar webhooks |

---

## 🔧 Ajustar límites (opcional)

Si necesitas cambiar los límites, edita `middleware.ts`:

```typescript
// Ejemplo: Permitir 10 intentos de login en vez de 5
const loginRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '15 m'), // Cambia el 5 por 10
      analytics: true,
      prefix: 'ratelimit:login',
    })
  : null
```

---

## 🚨 Troubleshooting

### Error: "Rate limiting disabled: Upstash Redis not configured"

**Causa**: Las variables de entorno no están configuradas.

**Solución**:
1. Verifica que `.env.local` tenga las credenciales correctas
2. Reinicia el servidor (`npm run dev`)

### Error: "Rate limiting error: [error details]"

**Causa**: Credenciales incorrectas o base de datos eliminada.

**Solución**:
1. Verifica las credenciales en Upstash dashboard
2. Copia nuevamente a `.env.local`
3. Asegúrate de que la base de datos esté activa

### Rate limiting no funciona en desarrollo

**Causa**: Es normal. Si no configuras Upstash, el middleware permite todas las requests.

**Solución**: Configura Upstash siguiendo los pasos anteriores.

---

## 📈 Monitoreo (Upstash Dashboard)

En tu dashboard de Upstash puedes ver:
- ✅ Número de requests bloqueadas
- ✅ IPs más activas
- ✅ Endpoints más usados
- ✅ Uso de memoria

---

## 🚀 Producción (Vercel)

Cuando despliegues a Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las mismas variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Redeploy tu aplicación

**¡Listo!** Tu e-commerce ahora está protegido contra ataques. 🛡️

---

## 💡 Próximos pasos

- [ ] Configurar alertas en Upstash para IPs sospechosas
- [ ] Agregar whitelist para IPs de confianza
- [ ] Implementar CAPTCHA después de X intentos fallidos
- [ ] Logs centralizados con Sentry
