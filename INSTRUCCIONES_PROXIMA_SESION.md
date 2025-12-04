# 🚀 Instrucciones para Próxima Sesión con Claude

## 📋 Al iniciar nueva sesión, di esto:

```markdown
Hola Claude, continuamos con el proyecto e-commerce.

**Última sesión:** 2025-12-02 23:40 UTC

**Lee estos documentos para contexto:**
- @WORKFLOW_KIMI_CLAUDE.md (estado del proyecto actualizado)
- @SESION_2025-12-02.md (resumen de última sesión)
- @FASE_4_COMPLETADA.md (última fase completada)

**Situación actual:**
Kimi está trabajando en Fase 5 (Checkout Page UI + Forms).

**Necesito que:**
[Elige una opción según el caso]

OPCIÓN A - Si Kimi ya terminó Fase 5:
"Kimi terminó la Fase 5, revisa el código usando el checklist de WORKFLOW_KIMI_CLAUDE.md"

OPCIÓN B - Si hay un error o duda:
"Tengo este error/pregunta: [describe el problema]"

OPCIÓN C - Si quieres verificar estado:
"Verifica que todo sigue funcionando correctamente (build, dev server, etc.)"
```

---

## 🎯 Lo que Claude debe hacer automáticamente

Cuando le des el contexto, Claude debería:

1. ✅ Leer los 3 documentos mencionados
2. ✅ Entender que está en Fase 5
3. ✅ Conocer el workflow Kimi → Claude
4. ✅ Saber qué revisar según el checklist

---

## 📝 Información Clave para Claude

### Estado actual:
- **Progreso:** 4/13 fases (30.8%)
- **Fase actual:** 5 (Checkout Page) - Kimi trabajando
- **Última revisión:** Fase 4 aprobada ✅
- **Fix reciente:** next.config.ts configurado ✅

### Archivos de referencia:
- `specs.md` - Especificación técnica completa
- `prompt_kimi.md` - Prompts para todas las fases
- `WORKFLOW_KIMI_CLAUDE.md` - Workflow y checklist de revisión
- `FASE_4_COMPLETADA.md` - Última fase documentada
- `correcciones_fases_2y3.md` - Correcciones menores pendientes

### Comandos útiles:
```bash
cd /mnt/d/PROYECTOS_2025/ecommerce/ecommerce

# Dev server
npm run dev

# Build (sin lint por issue conocido)
npm run build -- --no-lint

# Ver archivos modificados
git status
```

---

## ⚠️ Recordatorios Importantes

1. **Next.js 15:** searchParams y params son Promises
2. **i18n obligatorio:** Todas las strings deben usar t()
3. **Design System:** Solo Tailwind, no custom CSS
4. **Hydration:** Client components con localStorage necesitan `mounted` state
5. **Stock validation:** Siempre validar en servidor también

---

## 🔄 Workflow Normal

```
1. Kimi ejecuta fase N
2. Usuario entrega a Claude: "Kimi terminó fase N, revisa"
3. Claude revisa con checklist
4. Claude detecta errores → genera prompt de corrección
   O Claude aprueba → siguiente fase
5. Repetir
```

---

**Última actualización:** 2025-12-02 23:40 UTC  
**Estado:** Listo para continuar cuando Kimi termine Fase 5
