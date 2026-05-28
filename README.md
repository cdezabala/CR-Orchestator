# CR Orchestrator

Plataforma interna del equipo Corporate Relations para orquestar skills AI-asistidos.

## Cómo funciona

Cada skill abre Claude.ai en pestaña nueva con un prompt autocontenido que incluye:
- Instrucciones operativas de la skill
- Inputs del usuario
- Formato de output esperado
- Reglas de calidad

No hay backend, no hay base de datos. La inteligencia vive en Claude.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build de producción

```bash
npm run build
npm run preview
```

## Deploy

Push a GitHub. Vercel está conectado al repo y re-despliega automáticamente en cada commit a `main`.

## Añadir una nueva skill

Todo se modifica en `src/App.jsx`:

1. **Skill transversal:** añade entrada en el objeto `TRANSVERSAL_SKILLS` con `name`, `icon`, `short`, `inputs`. Luego añade el id al array `transversalUsed` de cada rol que la usa.
2. **Skill específica de rol:** añade entrada al array `specific` del rol correspondiente con `status: 'live'` y `inputs`.
3. **Prompt template:** añade entrada en `PROMPT_TEMPLATES` con la clave correspondiente. Si es específica, mapea su nombre al id en `SKILL_PROMPT_ID`.
4. Commit + push → Vercel redespliega automáticamente.

## Iterar prompts

Los prompts de las skills están en `PROMPT_TEMPLATES` al inicio de `App.jsx`. Editar directamente. Cada cambio se prueba abriendo la skill desde la UI y revisando el preview del prompt antes de "Abrir en Claude".

## Owner

[Nombre del owner] · CR Operations & Growth.
