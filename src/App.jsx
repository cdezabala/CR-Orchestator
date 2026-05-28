import React, { useState } from 'react';
import { 
  Briefcase, Users, BarChart3, Megaphone, Globe, MapPin, Compass, 
  Target, Sparkles, ArrowRight, Search, X, ChevronRight,
  FileText, Mail, MessageSquare, TrendingUp, AlertCircle, Award,
  Building2, Calendar, Zap, BookOpen, Copy, ExternalLink, Check
} from 'lucide-react';

// ============================================================
// DESIGN TOKENS
// ============================================================
const colors = {
  bg: '#F4EEE2',
  bgAlt: '#EBE3D2',
  ink: '#1A1F26',
  inkSoft: '#2D353F',
  inkMute: '#6B7280',
  paper: '#FBF8F1',
  paperDark: '#E5DBC5',
  accent: '#B8460E',
  accentSoft: '#D97441',
  sage: '#5C6E3A',
  ocean: '#1E3A5F',
  warn: '#A8550C',
  line: '#D4C9B3',
};

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
  
  .font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; letter-spacing: -0.02em; }
  .font-sans { font-family: 'Geist', system-ui, sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
`;

// ============================================================
// PROMPT BUILDERS — autocontenidos para Opción B
// ============================================================
const PROMPT_TEMPLATES = {
  'cr-account-brief': (inputs) => `Actúa como Claude operando como skill "Account Brief" del equipo de Corporate Relations. Generas dossiers ejecutivos que se leen en <90 segundos.

## Inputs
- Cuenta: ${inputs['Cuenta'] || '[pendiente]'}
- Propósito del brief: ${inputs['Propósito'] || '[pendiente]'}
- Audiencia interna: ${inputs['Audiencia interna'] || '[pendiente]'}

## Tu procedimiento
1. Si yo (el usuario) te he compartido información sobre la cuenta antes en esta conversación o en un archivo adjunto, úsala primero.
2. Si no, dime exactamente qué información necesitas que te aporte (CRM, emails recientes, contexto previo) ANTES de generar el brief. No inventes datos.
3. Genera el brief en el formato estricto de abajo. Nunca inventar; si falta un dato, escribir "Sin información — investigar".

## Formato de output (estricto, máx. 1 página)

# Account Brief — [Cuenta]
**Generado:** [hoy] · **Para:** [audiencia] · **Propósito:** [propósito]

## 1. Snapshot (3 líneas)
[Qué es, por qué nos importa, estado actual de la relación]

## 2. Stakeholders clave
| Nombre | Rol | Relación | Último contacto |

## 3. Historial reciente (90 días)
- Máximo 5 eventos relevantes

## 4. Pipeline / Revenue
- Deals abiertos, ARR, última propuesta enviada

## 5. Contexto estratégico
- Iniciativas públicas, cambios en liderazgo, vínculos con otras cuentas nuestras

## 6. Riesgos y señales de alerta
## 7. Oportunidades inmediatas (máx 3, accionables)
## 8. Talking points para esta interacción (3-5)

## Reglas
- Citar fuente en datos sensibles: [fuente: CRM 2026-Q1]
- Si hay contradicciones, marcar "⚠ Inconsistencias detectadas"
- Cuentas KAM (Saudi Telecom, Altamayuzz, PIF, Zain): preguntar por archivo de cuenta antes de empezar

Empieza pidiéndome la información que necesitas, o procede si ya la tienes.`,

  'cr-meeting-prep': (inputs) => `Actúa como Claude operando como skill "Meeting Prep" del equipo de Corporate Relations. Conviertes una reunión vaga en una reunión con plan.

## Inputs
- Cuenta + asistentes externos: ${inputs['Cuenta'] || '[pendiente]'}
- Tipo de reunión: ${inputs['Tipo de reunión'] || '[pendiente]'}
- Resultado deseado (una frase): ${inputs['Resultado deseado'] || '[pendiente]'}
- Duración: ${inputs['Duración'] || '[pendiente]'}

## Tu procedimiento
1. Si falta información crítica (asistentes nuestros, contexto previo de la cuenta), pídela ANTES de generar.
2. Si la cuenta es KAM (Saudi Telecom, Altamayuzz, PIF, Zain) o de Middle East, aplica sensibilidad cultural en agenda y timing.
3. Genera prep en el formato de abajo, listo para leer 5 minutos antes de entrar.

## Formato de output

# Meeting Prep — [Cuenta] · [Fecha y hora] · [Duración]

## Asistentes
**Ellos:** [Nombre, rol — 1 línea de contexto]
**Nosotros:** [Nombre, rol]

## Resultado deseado
[Una frase. Si X pasa, fue éxito.]

## Agenda sugerida ([duración total])
- Bloques con tiempos asignados
- Últimos 5 min: next steps explícitos

## Talking points por bloque

## Preguntas de descubrimiento priorizadas (máx 5)

## Posibles objeciones y respuestas
| Objeción | Respuesta |

## Materiales a llevar

## Criterios de éxito verificables post-reunión (checklist)

## Riesgos de la reunión

## Reglas
- El resultado deseado no puede ser "tener una buena conversación". Debe ser observable.
- Adaptar tono al tipo: discovery=preguntas; pitch=narrativa; negociación=anclajes preparados.

Empieza pidiéndome lo que necesites o procede si ya tienes lo esencial.`,

  'cr-meeting-debrief': (inputs) => `Actúa como Claude operando como skill "Meeting Debrief" del equipo de Corporate Relations. Capturas outputs post-reunión que alimentan CRM y archivos de cuenta.

## Inputs
- Cuenta y participantes: ${inputs['Cuenta'] || '[pendiente]'}
- Notas crudas / transcript / audio transcrito: ${inputs['Notas crudas o transcript'] || '[pendiente — pégalas a continuación]'}
- Resultado deseado original: ${inputs['Resultado deseado original'] || '[pendiente]'}

## Tu procedimiento
1. Si las notas son muy cortas, hazme 3-5 preguntas específicas antes de generar el debrief.
2. Genera el debrief en el formato de abajo.
3. Al final, ofréceme tres outputs secundarios automáticos.

## Formato de output

# Meeting Debrief — [Cuenta] · [Fecha]

## TL;DR (3 líneas)
[Qué pasó. Qué cambia. Qué hay que hacer.]

## ¿Conseguimos el resultado deseado?
[Sí / Parcial / No] — [breve justificación]

## Decisiones tomadas

## Información nueva
### Sobre la cuenta
### Sobre stakeholders
### Sobre el deal / proyecto
### Sobre competencia

## Next steps
| Acción | Owner | Fecha | Bloqueante de |
(Next steps sin owner no son next steps. Marcar TBD-asignar si hay duda.)

## Señales de riesgo detectadas

## Quotes textuales relevantes (solo si son literales)

## Updates necesarios
- [ ] CRM: stage [X]
- [ ] CRM: close date [Y]
- [ ] references/accounts/<cuenta>.md: añadir [Z]
- [ ] Compartir con: [personas]

## Pregunta abierta para el equipo (si aplica)

## Reglas
- Distinguir hechos de inferencias explícitamente.
- No editorializar. Reporta lo que pasó, no lo que sentiste.

## Salida secundaria (ofréceme al final)
1. Versión condensada de 5 líneas para CRM.
2. Versión email para forward a Head / Regional Lead.
3. Diff propuesto para archivo de cuenta.

Termina preguntándome si confirmo aplicar los updates al CRM y archivo de cuenta — no aplicar nada sin esa confirmación.

Empieza ahora.`,

  'cr-email-outreach': (inputs) => `Actúa como Claude operando como skill "Email Outreach" del equipo de Corporate Relations. Redactas emails comerciales con la voz del equipo.

## Inputs
- Destinatario: ${inputs['Destinatario'] || '[pendiente]'}
- Tipo de email: ${inputs['Tipo de email'] || '[pendiente]'}
- Objetivo del email: ${inputs['Objetivo'] || '[pendiente]'}
- Historia previa: ${inputs['Historia previa'] || '[pendiente]'}

## Principios duros
- Asunto < 7 palabras, específico, sin clickbait.
- Cuerpo < 120 palabras salvo propuesta formal.
- Una sola CTA por email.
- Primera línea NO es "espero que estés bien". Es contexto o valor.

## Adaptación regional (aplica según destinatario)
- **Middle East (Saudi, UAE, Kuwait):** "Dear Mr./Ms. [Apellido]"; títulos importan (Eng., Dr.); tono formal-deferente; evitar urgencia agresiva; no enviar viernes; cierre "Best regards".
- **Spain / LATAM:** "Estimado/a" en primer contacto, "Hola" si hay relación; tono cálido pero profesional. LATAM puede aceptar referencia personal corta.
- **UK / Northern Europe:** directo, sin floritura, CTA clara.

## Output requerido
1. Asunto
2. Cuerpo del email
3. Nota corta de 2 líneas: "Por qué este enfoque" (para que el usuario aprenda, no solo copie)

## Reglas
- Cero jerga interna salvo que el destinatario la use primero.
- Si el destinatario es de cuenta KAM (Saudi Telecom, Altamayuzz, PIF, Zain), verifica conmigo el archivo de cuenta antes de redactar — las referencias erróneas son costosas.
- Reread test: si suena a "vendedor de coches", está mal.

Procede. Si necesitas más contexto (estilo previo de la conversación, posición exacta del destinatario), pregúntame antes de redactar.`,

  'cr-deal-qualification': (inputs) => `Actúa como Claude operando como skill "Deal Qualification" del equipo de Corporate Relations. Aplicas MEDDPICC adaptado para decidir si avanzar, pausar o descartar un deal.

## Inputs
- Cuenta: ${inputs['Cuenta'] || '[pendiente]'}
- Deal name / contexto: ${inputs['Deal'] || '[pendiente]'}
- Información disponible: ${inputs['Información disponible'] || '[pendiente — descríbeme qué sabes del deal]'}

## Framework MEDDPICC
Evalúa cada dimensión con score 0-3:
- 0 = no sabemos
- 1 = información débil, supuestos
- 2 = confirmada por una fuente del cliente
- 3 = documentado, multi-fuente, en CRM

| Dim | Pregunta clave |
|---|---|
| **M** Metrics | ¿Qué métricas del cliente movemos? ¿Cuánto? |
| **E** Economic Buyer | ¿Quién firma? ¿Hemos hablado con esa persona? |
| **D** Decision Criteria | ¿Cómo deciden? ¿Qué pesa? |
| **D** Decision Process | ¿Qué pasos siguen? Comité, compras, legal, timeline. |
| **P** Paper Process | ¿Cómo es su proceso contractual/legal? |
| **I** Identified Pain | ¿Dolor real cuantificado? ¿Qué pasa si no hacen nada? |
| **C** Champion | ¿Alguien dentro vendiendo por nosotros cuando no estamos? |
| **C** Competition | ¿Quién más está? ¿Status quo cuenta? |

## Adaptaciones por región
- **Middle East / KAM grandes (Saudi Telecom, PIF):** añadir "Royal/Political Cover" como 9ª dimensión.
- **Europe:** Paper Process suele ser más complejo (legal, GDPR).
- **LATAM:** Decision Process informal pero Paper Process puede ser sorpresivamente largo.

## Formato de output

# Deal Qualification — [Cuenta] · [Deal]

## Score global: [XX/24]

| Dim | Score | Evidencia | Gap |

## Diagnóstico
[Una frase honesta sobre el estado real.]

## Gaps críticos (dimensiones en 0 o 1)

## Recomendación
**[AVANZAR / INVERTIR EN CUALIFICAR / PAUSAR / DESCARTAR]**
- Si AVANZAR: por qué + siguiente paso concreto.
- Si CUALIFICAR: qué acción cierra el gap mayor, con owner y fecha.
- Si PAUSAR: condición para reactivar.
- Si DESCARTAR: por qué + ¿vale nurturing?

## Próxima revisión
[Fecha — máx 30 días]

## Reglas
- Score <12 = no cualificado, no entra en forecast.
- Cualquier dimensión en 0 = bloqueante, especialmente Economic Buyer y Champion.
- No inflar scores. Supuesto = 1.

Si te falta información para puntuar alguna dimensión, dímelo y pídeme lo que necesitas. No inventes scores.`,

  // Ola 2 — placeholders simples para skills live restantes
  'cr-proposal-builder': (inputs) => `Actúa como skill "Proposal Builder" de Corporate Relations. Inputs: ${JSON.stringify(inputs)}. Necesito que primero verifiques que tengo: (a) un Account Brief reciente, (b) un Deal Qualification con score ≥12. Si no, recomiéndame generar esos primero. Luego trabaja la propuesta en fases: outline → exec summary → secciones, con check-in entre cada una. Estructura estándar: 1) Executive Summary (1 página), 2) Entendimiento, 3) Solución, 4) Plan de implementación, 5) Equipo, 6) Casos de éxito (máx 2, elegidos por proximidad no prestigio), 7) Inversión (3 opciones good/better/best), 8) Términos, 9) Anexos. Reglas: lenguaje del cliente no nuestro; incluir sección honesta "Qué necesitamos de ustedes"; sin promesas vagas, cuantificar o quitar.`,

  'cr-pipeline-report': (inputs) => `Actúa como skill "Pipeline Report" de Corporate Relations. Inputs: ${JSON.stringify(inputs)}. Pídeme los datos del CRM que necesitas (deals con stage, valor, owner, fecha, actividad última). Genera reporte: 1) Headline 3 líneas, 2) Métricas clave (pipeline cualificado, weighted forecast, win rate, avg deal, avg cycle, coverage ratio ≥3x), 3) Top 5 deals que mueven el trimestre, 4) Banderas rojas, 5) Movimientos vs último reporte (avanzaron, retrocedieron — más importante, nuevos, perdidos con causa). Reglas: solo deals con score MEDDPICC ≥12 en forecast; deals >30 días sin actividad marcar como "stuck"; coverage <3x bandera roja explícita; forecast con commit/best/worst, no número único.`,

  'cr-market-intel': (inputs) => `Actúa como skill "Market Intel" de Corporate Relations. Inputs: ${JSON.stringify(inputs)}. Confirma conmigo: tipo de research (persona/empresa/industria/mercado), target específico, y la DECISIÓN que voy a tomar con esto (sin esto el research divaga). Reglas duras: citar fuente en cada claim no trivial; distinguir hecho de inferencia explícitamente; si no hay info, decirlo, no rellenar con plausibilidad; triangulación con 2+ fuentes para datos clave; priorizar fuentes <12 meses. Output: estructura específica al tipo de research + bibliografía con fuentes y fechas al final.`,

  'cr-competitive-intel': (inputs) => `Actúa como skill "Competitive Intel" de Corporate Relations. Inputs: ${JSON.stringify(inputs)}. Genera battle card accionable, no análisis genérico. Estructura: Snapshot, Dónde son fuertes (admitir honestamente), Dónde son débiles, Ganchos para posicionarnos (sin atacar directamente), Mitos/objeciones que el cliente puede tener + cómo respondemos, Casos donde es mejor no competir, Inteligencia operativa (pricing observado, sales motion, ciclo). Reglas: honestidad calibrada; no atacar al competidor frente al cliente, educar al cliente; no usar información obtenida por medios cuestionables.`,

  'cr-crm-hygiene': (inputs) => `Actúa como skill "CRM Hygiene" de Corporate Relations. Inputs: ${JSON.stringify(inputs)}. Pídeme el export del CRM o describe los registros. Audita: cuentas (sin owner, info incompleta, duplicados), contactos (sin email/teléfono, sin rol, duplicados, sin actividad >180d), deals (sin owner/valor/close date, close date en pasado, sin actividad >30d, stage incoherente con actividades, score MEDDPICC ausente o <12 en forecast), actividades (reuniones sin debrief >7d). Output: resumen por criticidad, lista con owner sugerido y acción, patrones detectados, recomendaciones sistémicas. Regla: no proponer borrar automáticamente, solo flagging.`,

  // Skills específicas live
  'executive-briefing': (inputs) => `Actúa como skill "Executive Briefing" para el Head of Corporate Relations. Inputs: ${JSON.stringify(inputs)}. Briefing 1 página A4 o nada. Formato BLUF: 1) Bottom Line 3 frases, 2) Decisiones que pido (explícitas con owner y fecha), 3) Estado del negocio (1 tabla con KPIs), 4) 3 cosas funcionando, 5) 3 cosas no funcionando (honestidad calibrada), 6) Riesgos top 3, 7) Oportunidades top 3, 8) Apéndice opcional. Reglas duras: cero narrativa, bullets y tablas; sin jerga interna; no esconder malas noticias — si Q va por debajo, primera línea lo dice; una sola "Bottom Line".`,

  'funnel-diagnostic': (inputs) => `Actúa como skill "Funnel Diagnostic" para Operations & Growth. Inputs: ${JSON.stringify(inputs)}. Pídeme datos del funnel (volumen entrada/salida por stage, tiempo en stage, conversiones, periodo baseline). Genera: Headline con dónde está el problema y cuánto cuesta; tabla funnel visualizado con conversión y Δ vs baseline marcando la zona problema; Causas probables (con evidencia, distinguir probable de probada); Patrones por segmento (¿qué BD/región no tiene el problema?); Experimentos sugeridos para validar (no para arreglar todavía) con hipótesis/métrica/duración/owner; Lo que NO está roto. Regla: no proponer arreglos antes de diagnóstico confirmado.`,

  'gcc-cultural-protocol': (inputs) => `Actúa como skill "GCC Cultural Protocol" para Middle East Regional Lead. Inputs: ${JSON.stringify(inputs)}. Confirma país específico (Saudi/UAE/Kuwait/Bahrain/Qatar/Oman), tipo de interacción, seniority y género del stakeholder, fecha. Devuelve guidance específica (no estereotipos) sobre: saludos y formas de tratar (títulos: Eng., Dr., HRH); calendario crítico (fines de semana por país, Ramadan, Eid, Hajj, National Days, oración); reglas de reunión (timing, café/té, jerarquía, decisiones); email y comunicación escrita; vestimenta; gifts y hospitality (compliance!); temas de conversación sí/no; mujeres profesionales (nuestras y del cliente); negociación. Output: checklist específico para la interacción + heads-up de calendario si la fecha cae en periodo crítico + sugerencias de adaptación + banderas rojas si el plan parece problemático. No reemplaza al Regional Lead — complementa.`,

  'qbr-builder': (inputs) => `Actúa como skill "QBR Builder" para Key Account Managers. Inputs: ${JSON.stringify(inputs)}. QBR para cuenta KAM (Saudi Telecom, Altamayuzz, PIF, Zain o equivalente). Necesitas conmigo: Account Brief reciente, datos de uso/entregables del trimestre, incidencias y resolución, lista de stakeholders del QBR. Trabaja en fases: 1) Outline + 3 líneas por sección (aprobable), 2) Executive Summary completo, 3) Secciones detalladas una a una con check-in, 4) Revisión integral, 5) Generación final. Estructura: Exec Summary, Logros y valor entregado (cuantificado), Métricas (del cliente no nuestras), Programa actual y roadmap, Incidencias honestas, Iniciativas conjuntas siguiente Q, Decisiones que pedimos al cliente, Next steps. Reglas: documento PARA el cliente, lenguaje del cliente; honestidad calibrada con incidencias; toda métrica responde "por qué importa"; expansion subtle no pitch; sin commitments del cliente la relación está desequilibrada.`,

  'cold-outreach-cadence': (inputs) => `Actúa como skill "Cold Outreach Cadence" para Business Developers. Inputs: ${JSON.stringify(inputs)}. Confirma: cuenta en ICP, stakeholder por nombre (no rol genérico), info mínima de market intel sobre persona y empresa. Diseña cadencia 6-8 touches en 3-4 semanas. Estructura por touch: día, canal (email/LinkedIn/llamada), tipo, objetivo, copy específico. Reglas: cada touch ángulo nuevo (no re-send); personalización mínima nombre+empresa+algo específico de la persona o no envíes; touch 7 break-up ("asumo que no es el momento, me retiro"); si responde "no" parar inmediatamente. Adaptaciones: Middle East 4-5 touches más espaciados (4 sem) + WhatsApp Business > LinkedIn; Europe estándar; LATAM WhatsApp profesional + voz/audio aceptable tras primer contacto. Output: plan completo con triggers para acelerar/pausar y métricas a revisar.`,
};

// ============================================================
// DATA: SKILLS
// ============================================================
const TRANSVERSAL_SKILLS = {
  'cr-account-brief': {
    name: 'Account Brief',
    icon: FileText,
    short: 'Dossier ejecutivo de cuenta antes de cualquier reunión, propuesta o decisión.',
    inputs: ['Cuenta', 'Propósito', 'Audiencia interna'],
  },
  'cr-meeting-prep': {
    name: 'Meeting Prep',
    icon: Calendar,
    short: 'Agenda, talking points, preguntas de descubrimiento y criterios de éxito.',
    inputs: ['Cuenta', 'Tipo de reunión', 'Resultado deseado', 'Duración'],
  },
  'cr-meeting-debrief': {
    name: 'Meeting Debrief',
    icon: MessageSquare,
    short: 'Capturar outputs, decisiones, next steps con owner y updates al CRM.',
    inputs: ['Cuenta', 'Notas crudas o transcript', 'Resultado deseado original'],
  },
  'cr-email-outreach': {
    name: 'Email Outreach',
    icon: Mail,
    short: 'Emails comerciales con voz del equipo, adaptados por región y tipo.',
    inputs: ['Destinatario', 'Tipo de email', 'Objetivo', 'Historia previa'],
  },
  'cr-proposal-builder': {
    name: 'Proposal Builder',
    icon: Award,
    short: 'Propuestas comerciales con estructura, tono y rigor del equipo.',
    inputs: ['Cuenta', 'Tipo de propuesta', 'Tamaño deal', 'Criterios decisión'],
  },
  'cr-deal-qualification': {
    name: 'Deal Qualification',
    icon: Target,
    short: 'MEDDPICC adaptado: score, gaps y recomendación accionable.',
    inputs: ['Cuenta', 'Deal', 'Información disponible'],
  },
  'cr-pipeline-report': {
    name: 'Pipeline Report',
    icon: BarChart3,
    short: 'Reportes de pipeline normalizados con métricas, top deals y banderas rojas.',
    inputs: ['Periodo', 'Scope', 'Audiencia'],
  },
  'cr-market-intel': {
    name: 'Market Intelligence',
    icon: Search,
    short: 'Research estructurado: persona, empresa, industria, mercado.',
    inputs: ['Tipo de research', 'Target', 'Decisión a tomar', 'Tiempo disponible'],
  },
  'cr-competitive-intel': {
    name: 'Competitive Intel',
    icon: Compass,
    short: 'Battle cards accionables vs competidores en deals específicos.',
    inputs: ['Competidor', 'Contexto', 'Información previa'],
  },
  'cr-crm-hygiene': {
    name: 'CRM Hygiene',
    icon: AlertCircle,
    short: 'Auditar y corregir datos del CRM con plan accionable.',
    inputs: ['Scope', 'Periodo'],
  },
};

// Mapping de skill id de UI a skill id de prompt (idénticos)
const SKILL_PROMPT_ID = {
  'Executive Briefing': 'executive-briefing',
  'Funnel Diagnostic': 'funnel-diagnostic',
  'GCC Cultural Protocol': 'gcc-cultural-protocol',
  'QBR Builder': 'qbr-builder',
  'Cold Outreach Cadence': 'cold-outreach-cadence',
};

const ROLES = [
  {
    id: 'leadership',
    name: 'Head of Corporate Relations',
    short: 'Leadership',
    icon: Briefcase,
    color: colors.ink,
    description: 'Estrategia de unidad + orquestación del equipo. Diseña el sistema, no lo ejecuta.',
    transversalUsed: ['cr-pipeline-report', 'cr-account-brief', 'cr-deal-qualification', 'cr-meeting-prep', 'cr-meeting-debrief'],
    specific: [
      { name: 'Executive Briefing', icon: Sparkles, short: 'Briefings 1-pager para board, CEO o cuentas C-level KAM.', status: 'live', inputs: ['Audiencia', 'Tiempo de lectura', 'Decisiones que pido', 'Periodo'] },
      { name: 'Board Update', icon: FileText, short: 'Reporte trimestral formal con narrative + financials.', status: 'planned' },
      { name: 'Strategic Review', icon: Compass, short: 'Revisión de posición, recursos y prioridades de la unidad.', status: 'planned' },
      { name: 'Team 1:1 Prep', icon: Users, short: 'Preparar 1:1s con Regional Leads usando datos CRM.', status: 'planned' },
      { name: 'Escalation Handler', icon: AlertCircle, short: 'Tomar control de deal escalado sin pisar al Regional Lead.', status: 'planned' },
      { name: 'Quarterly Narrative', icon: BookOpen, short: 'Narrativa de cierre de trimestre para el equipo.', status: 'planned' },
    ],
  },
  {
    id: 'ops',
    name: 'Operations & Growth',
    short: 'Ops & Growth',
    icon: BarChart3,
    color: colors.ocean,
    description: 'La máquina detrás del comercial — datos, procesos, experimentos, RevOps.',
    transversalUsed: ['cr-pipeline-report', 'cr-crm-hygiene', 'cr-deal-qualification', 'cr-market-intel'],
    specific: [
      { name: 'Funnel Diagnostic', icon: TrendingUp, short: 'Encontrar dónde se rompe el funnel y por qué.', status: 'live', inputs: ['Periodo', 'Baseline', 'Scope', 'Hipótesis'] },
      { name: 'Growth Experiment', icon: Zap, short: 'Diseñar tests con hipótesis, métrica y criterio de éxito.', status: 'planned' },
      { name: 'RevOps Playbook', icon: BookOpen, short: 'Lead routing, stage criteria, SLAs, definición de cualificación.', status: 'planned' },
      { name: 'Forecast Model', icon: BarChart3, short: 'Construir y mantener forecast commit/best/worst.', status: 'planned' },
      { name: 'Comp Design', icon: Award, short: 'Diseñar/revisar comp plans para BDs y KAMs.', status: 'planned' },
      { name: 'Onboarding Track', icon: Users, short: 'Plan 30/60/90 para nuevos BDs/KAMs.', status: 'planned' },
      { name: 'Quota Allocation', icon: Target, short: 'Distribuir cuota entre regiones/BDs por TAM y capacidad.', status: 'planned' },
    ],
  },
  {
    id: 'marketing',
    name: 'Directora de Marketing',
    short: 'Marketing',
    icon: Megaphone,
    color: colors.accent,
    description: 'Soporte transversal: marca, contenido, demand gen, eventos a las 3 regiones.',
    transversalUsed: ['cr-market-intel', 'cr-competitive-intel', 'cr-account-brief'],
    specific: [
      { name: 'Campaign Brief', icon: Megaphone, short: 'Brief estructurado: audiencia, mensaje, canales, KPIs, presupuesto.', status: 'planned' },
      { name: 'Content Calendar', icon: Calendar, short: 'Calendario editorial alineado con prioridades comerciales por región.', status: 'planned' },
      { name: 'Event Playbook', icon: Sparkles, short: 'Plan completo de evento + ROI: pre / durante / post.', status: 'planned' },
      { name: 'Localization Pack', icon: Globe, short: 'Adaptar mensaje a ES/EN/AR con sensibilidad cultural.', status: 'planned' },
      { name: 'Case Study Builder', icon: FileText, short: 'Caso de éxito con permiso del cliente: métricas + quotes.', status: 'planned' },
      { name: 'ABM Playbook', icon: Target, short: 'Account-based marketing para cuentas KAM.', status: 'planned' },
      { name: 'PR Statement', icon: Megaphone, short: 'Borrador de comunicado o post LinkedIn corporativo.', status: 'planned' },
    ],
  },
  {
    id: 'meast',
    name: 'Regional Lead — Middle East',
    short: 'Middle East',
    icon: MapPin,
    color: colors.warn,
    description: 'Riyadh, Dammam, Kuwait, UAE. Sede de las 4 cuentas KAM estratégicas.',
    transversalUsed: Object.keys(TRANSVERSAL_SKILLS),
    specific: [
      { name: 'GCC Cultural Protocol', icon: Globe, short: 'Protocolo cultural y de negocios para Saudi, UAE, Kuwait.', status: 'live', inputs: ['País', 'Tipo de interacción', 'Stakeholder', 'Fecha'] },
      { name: 'Arabic Localization', icon: FileText, short: 'Coordinar versiones árabes de propuestas, contratos, marketing.', status: 'planned' },
      { name: 'Ramadan Calendar', icon: Calendar, short: 'Ajuste operativo del calendario comercial Ramadan + Eid + Hajj.', status: 'planned' },
      { name: 'Vision 2030 Alignment', icon: Compass, short: 'Alinear propuestas con pillars Vision 2030 y 2031.', status: 'planned' },
      { name: 'GCC Procurement', icon: Building2, short: 'Navegar procurement de entidades cuasi-gubernamentales (PIF, ministerios).', status: 'planned' },
      { name: 'Royal Protocol', icon: Award, short: 'Protocolo para interacciones con royal family / advisors.', status: 'planned' },
    ],
  },
  {
    id: 'europe',
    name: 'Regional Lead — Europe',
    short: 'Europe',
    icon: MapPin,
    color: colors.sage,
    description: 'Spain (HQ regional), Azerbaijan, Italy y resto de Europe.',
    transversalUsed: Object.keys(TRANSVERSAL_SKILLS),
    specific: [
      { name: 'EU Compliance Check', icon: AlertCircle, short: 'Verificar GDPR, AI Act y regulación sectorial en propuestas.', status: 'planned' },
      { name: 'Multi-lang Coordination', icon: Globe, short: 'Coordinar versiones ES/EN/IT — quién traduce qué.', status: 'planned' },
      { name: 'EU Procurement Process', icon: Building2, short: 'Navegar tenders públicos y RFPs formales europeos.', status: 'planned' },
      { name: 'Azerbaijan Protocol', icon: Compass, short: 'Protocolo específico: más cercano a Middle East que a EU.', status: 'planned' },
      { name: 'Spain Network', icon: Users, short: 'Mapa de relaciones, influencers y eventos relevantes en España.', status: 'planned' },
      { name: 'Italy Network', icon: Users, short: 'Mapa de relaciones, influencers y eventos relevantes en Italia.', status: 'planned' },
    ],
  },
  {
    id: 'latam',
    name: 'Regional Lead — LATAM',
    short: 'LATAM',
    icon: MapPin,
    color: colors.accentSoft,
    description: 'México, Colombia, Chile, Brasil — variabilidad alta entre países.',
    transversalUsed: Object.keys(TRANSVERSAL_SKILLS),
    specific: [
      { name: 'LATAM Market Entry', icon: Compass, short: 'Framework para evaluar nuevo país: TAM, partners, legal, fiscal.', status: 'planned' },
      { name: 'Spanish-PT Localization', icon: Globe, short: 'Adaptar a variantes regionales (MX vs AR vs Brasil-PT).', status: 'planned' },
      { name: 'LATAM Procurement', icon: Building2, short: 'Grupos económicos vs corporativos vs gobierno.', status: 'planned' },
      { name: 'FX & Inflation Pricing', icon: TrendingUp, short: 'Pricing y términos con sensibilidad a FX e inflación local.', status: 'planned' },
      { name: 'LATAM Events Circuit', icon: Calendar, short: 'Eventos y conferencias relevantes por país y vertical.', status: 'planned' },
    ],
  },
  {
    id: 'bd',
    name: 'Business Developers',
    short: 'BD',
    icon: Zap,
    color: colors.ocean,
    description: 'Pool cross-region. Abrir cuentas nuevas cualificadas dentro del ICP.',
    transversalUsed: ['cr-account-brief', 'cr-meeting-prep', 'cr-meeting-debrief', 'cr-email-outreach', 'cr-deal-qualification', 'cr-market-intel'],
    specific: [
      { name: 'Cold Outreach Cadence', icon: Mail, short: 'Secuencias multi-touch, multi-canal en 3-4 semanas.', status: 'live', inputs: ['Cuenta', 'Stakeholder', 'ICP fit', 'Hipótesis de pain'] },
      { name: 'Discovery Call Script', icon: MessageSquare, short: 'Estructura de discovery: preguntas por hipótesis, criterios SQL.', status: 'planned' },
      { name: 'Objection Handling', icon: AlertCircle, short: 'Respuestas calibradas a las 15 objeciones más comunes por región.', status: 'planned' },
      { name: 'Intro Request', icon: Users, short: 'Pedir intros con marco de valor mutuo.', status: 'planned' },
      { name: 'Event Follow-up', icon: Calendar, short: 'Follow-up sistemático post-evento con segmentación.', status: 'planned' },
    ],
  },
  {
    id: 'kam',
    name: 'Key Account Managers',
    short: 'KAM',
    icon: Award,
    color: colors.sage,
    description: 'Saudi Telecom · Altamayuzz · PIF · Zain. Relación, expansión, renovación.',
    transversalUsed: ['cr-account-brief', 'cr-meeting-prep', 'cr-meeting-debrief', 'cr-email-outreach', 'cr-proposal-builder', 'cr-competitive-intel'],
    specific: [
      { name: 'QBR Builder', icon: BarChart3, short: 'Quarterly Business Reviews para cuentas KAM.', status: 'live', inputs: ['Cuenta KAM', 'Trimestre', 'Stakeholders del QBR', 'Hitos del trimestre'] },
      { name: 'Expansion Playbook', icon: TrendingUp, short: 'Detectar y ejecutar expansión sin parecer vendedor.', status: 'planned' },
      { name: 'Renewal Risk Score', icon: AlertCircle, short: 'Riesgo de churn por cuenta + plan de mitigación.', status: 'planned' },
      { name: 'Stakeholder Map', icon: Users, short: 'Mapa vivo: champions, blockers, influencers, decision makers.', status: 'planned' },
      { name: 'Escalation Runbook', icon: Zap, short: 'Cuándo y cómo escalar — interno y al sponsor del cliente.', status: 'planned' },
      { name: 'Executive Sponsor Program', icon: Briefcase, short: 'Gestión de relación C-level a C-level.', status: 'planned' },
    ],
  },
];

// ============================================================
// COMPONENT: SKILL CARD
// ============================================================
const SkillCard = ({ skill, skillId, onLaunch, kind, accent }) => {
  const Icon = skill.icon;
  const isLive = skill.status !== 'planned' || kind === 'transversal';
  
  return (
    <button
      onClick={() => isLive && onLaunch(skill, kind, skillId)}
      disabled={!isLive}
      className="group relative text-left transition-all"
      style={{
        backgroundColor: colors.paper,
        border: `1px solid ${colors.line}`,
        padding: '20px 22px',
        cursor: isLive ? 'pointer' : 'default',
        opacity: isLive ? 1 : 0.55,
      }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="flex-shrink-0 mt-0.5"
          style={{
            width: 36,
            height: 36,
            backgroundColor: kind === 'transversal' ? colors.bgAlt : accent,
            color: kind === 'transversal' ? colors.ink : colors.paper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 200ms',
          }}
        >
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 
              className="font-display"
              style={{ 
                fontSize: '17px', 
                fontWeight: 500, 
                color: colors.ink,
                lineHeight: 1.2,
              }}
            >
              {skill.name}
            </h3>
            {!isLive && (
              <span 
                className="font-mono uppercase"
                style={{ 
                  fontSize: '9px', 
                  color: colors.inkMute, 
                  letterSpacing: '0.1em',
                  padding: '2px 6px',
                  border: `1px solid ${colors.line}`,
                }}
              >
                planned
              </span>
            )}
            {isLive && (
              <span 
                className="font-mono uppercase"
                style={{ 
                  fontSize: '9px', 
                  color: colors.sage, 
                  letterSpacing: '0.1em',
                  padding: '2px 6px',
                  backgroundColor: 'rgba(92, 110, 58, 0.12)',
                  fontWeight: 600,
                }}
              >
                live
              </span>
            )}
          </div>
          <p 
            className="font-sans"
            style={{ 
              fontSize: '13px', 
              color: colors.inkSoft,
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            {skill.short}
          </p>
          {isLive && (
            <div 
              className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: accent }}
            >
              <span 
                className="font-mono uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.12em', fontWeight: 600 }}
              >
                Run skill
              </span>
              <ArrowRight size={12} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

// ============================================================
// COMPONENT: SKILL LAUNCH MODAL
// ============================================================
const SkillModal = ({ skill, skillId, kind, role, onClose }) => {
  const [inputs, setInputs] = useState({});
  const [copied, setCopied] = useState(false);
  
  if (!skill) return null;
  
  const inputFields = kind === 'transversal' 
    ? skill.inputs 
    : (skill.inputs || ['Cuenta / contexto', 'Objetivo específico', 'Detalles adicionales']);
  
  // Determinar el id de prompt
  const promptKey = kind === 'transversal' 
    ? skillId 
    : SKILL_PROMPT_ID[skill.name];
  
  const promptBuilder = PROMPT_TEMPLATES[promptKey];
  const hasRealPrompt = !!promptBuilder;
  
  const fullPrompt = hasRealPrompt 
    ? promptBuilder(inputs)
    : `Skill: ${skill.name}\nInputs: ${JSON.stringify(inputs, null, 2)}\n\n[Esta skill aún no tiene prompt autocontenido implementado.]`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDeepLink = () => {
    const encoded = encodeURIComponent(fullPrompt);
    window.open(`https://claude.ai/new?q=${encoded}`, '_blank');
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-stretch justify-end"
      style={{ backgroundColor: 'rgba(26, 31, 38, 0.4)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="overflow-y-auto"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: colors.bg,
          borderLeft: `1px solid ${colors.line}`,
          animation: 'slideIn 240ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: `1px solid ${colors.line}` }}>
          <div className="flex items-start justify-between mb-3">
            <div 
              className="font-mono uppercase"
              style={{ fontSize: '10px', color: colors.inkMute, letterSpacing: '0.14em' }}
            >
              {kind === 'transversal' ? 'Transversal skill' : `${role.short} skill`}
              {hasRealPrompt ? ' · live' : ' · placeholder'}
            </div>
            <button
              onClick={onClose}
              style={{ color: colors.inkMute, cursor: 'pointer' }}
              className="hover:opacity-60 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
          <h2 
            className="font-display"
            style={{ 
              fontSize: '32px', 
              color: colors.ink, 
              fontWeight: 500,
              lineHeight: 1.1,
              marginBottom: '8px',
            }}
          >
            {skill.name}
          </h2>
          <p 
            className="font-sans"
            style={{ 
              fontSize: '14px', 
              color: colors.inkSoft,
              lineHeight: 1.55,
            }}
          >
            {skill.short}
          </p>
        </div>
        
        {/* Inputs */}
        <div style={{ padding: '28px 32px' }}>
          <div 
            className="font-mono uppercase mb-4"
            style={{ fontSize: '10px', color: colors.inkMute, letterSpacing: '0.14em' }}
          >
            Inputs requeridos
          </div>
          <div className="space-y-4">
            {inputFields.map((field, i) => (
              <div key={i}>
                <label 
                  className="font-sans block mb-1.5"
                  style={{ 
                    fontSize: '12px', 
                    color: colors.inkSoft,
                    fontWeight: 500,
                  }}
                >
                  {field}
                </label>
                {field.toLowerCase().includes('notas') || field.toLowerCase().includes('transcript') || field.toLowerCase().includes('información disponible') ? (
                  <textarea
                    value={inputs[field] || ''}
                    onChange={(e) => setInputs({ ...inputs, [field]: e.target.value })}
                    placeholder={`Pega ${field.toLowerCase()}...`}
                    rows={4}
                    className="font-sans w-full"
                    style={{
                      backgroundColor: colors.paper,
                      border: `1px solid ${colors.line}`,
                      padding: '10px 14px',
                      fontSize: '14px',
                      color: colors.ink,
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={inputs[field] || ''}
                    onChange={(e) => setInputs({ ...inputs, [field]: e.target.value })}
                    placeholder={`Especifica ${field.toLowerCase()}...`}
                    className="font-sans w-full"
                    style={{
                      backgroundColor: colors.paper,
                      border: `1px solid ${colors.line}`,
                      padding: '10px 14px',
                      fontSize: '14px',
                      color: colors.ink,
                      outline: 'none',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Execution */}
        <div style={{ padding: '0 32px 28px' }}>
          <div 
            className="font-mono uppercase mb-4"
            style={{ fontSize: '10px', color: colors.inkMute, letterSpacing: '0.14em' }}
          >
            Ejecutar
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleDeepLink}
              className="w-full flex items-center justify-between group transition-all hover:translate-x-0.5"
              style={{
                backgroundColor: colors.ink,
                color: colors.paper,
                padding: '14px 18px',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={16} strokeWidth={1.75} />
                <div className="text-left">
                  <div className="font-sans" style={{ fontSize: '14px', fontWeight: 500 }}>
                    Abrir en Claude
                  </div>
                  <div className="font-sans" style={{ fontSize: '11px', opacity: 0.65 }}>
                    Se abre en pestaña nueva con el prompt cargado
                  </div>
                </div>
              </div>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-between transition-colors"
              style={{
                backgroundColor: copied ? 'rgba(92, 110, 58, 0.12)' : colors.paper,
                border: `1px solid ${copied ? colors.sage : colors.line}`,
                color: colors.ink,
                padding: '14px 18px',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center gap-3">
                {copied ? <Check size={16} strokeWidth={2} style={{color: colors.sage}} /> : <Copy size={16} strokeWidth={1.75} />}
                <div className="text-left">
                  <div className="font-sans" style={{ fontSize: '14px', fontWeight: 500 }}>
                    {copied ? 'Prompt copiado' : 'Copiar prompt'}
                  </div>
                  <div className="font-sans" style={{ fontSize: '11px', color: colors.inkMute }}>
                    Para pegar en cualquier sitio (Claude, Cursor, ChatGPT…)
                  </div>
                </div>
              </div>
            </button>
          </div>
          
          {/* Preview */}
          <details style={{ marginTop: '20px' }}>
            <summary 
              className="font-mono uppercase cursor-pointer"
              style={{ 
                fontSize: '10px', 
                color: colors.inkMute, 
                letterSpacing: '0.14em',
                padding: '8px 0',
              }}
            >
              Preview del prompt completo →
            </summary>
            <div 
              className="font-mono mt-2 p-4"
              style={{ 
                backgroundColor: colors.bgAlt, 
                fontSize: '11px', 
                color: colors.inkSoft, 
                lineHeight: 1.6,
                border: `1px solid ${colors.line}`,
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{fullPrompt}</pre>
            </div>
          </details>
        </div>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function CROrchestrator() {
  const [activeRoleId, setActiveRoleId] = useState('leadership');
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeSkillId, setActiveSkillId] = useState(null);
  const [activeSkillKind, setActiveSkillKind] = useState(null);
  
  const activeRole = ROLES.find(r => r.id === activeRoleId);
  const transversalForRole = activeRole.transversalUsed.map(id => ({
    ...TRANSVERSAL_SKILLS[id],
    id,
  }));
  
  const handleLaunch = (skill, kind, skillId) => {
    setActiveSkill(skill);
    setActiveSkillId(skillId);
    setActiveSkillKind(kind);
  };
  
  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh' }} className="font-sans">
      <style>{fontStyles}</style>
      
      <div className="flex" style={{ minHeight: '100vh' }}>
        {/* ============ SIDEBAR ============ */}
        <aside 
          style={{ 
            width: '280px',
            backgroundColor: colors.bg,
            borderRight: `1px solid ${colors.line}`,
            padding: '32px 0',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ padding: '0 28px 36px' }}>
            <div 
              className="font-mono uppercase mb-2"
              style={{ fontSize: '10px', color: colors.inkMute, letterSpacing: '0.18em' }}
            >
              CR Orchestrator
            </div>
            <div 
              className="font-display"
              style={{ 
                fontSize: '22px', 
                fontWeight: 500,
                color: colors.ink,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              Corporate <em style={{ fontStyle: 'italic' }}>Relations</em>
            </div>
            <div 
              className="font-display"
              style={{ 
                fontSize: '14px', 
                color: colors.inkMute,
                lineHeight: 1.3,
                marginTop: '4px',
              }}
            >
              AI-native skills platform
            </div>
          </div>
          
          <nav style={{ padding: '0 12px' }}>
            <div 
              className="font-mono uppercase"
              style={{ 
                fontSize: '10px', 
                color: colors.inkMute, 
                letterSpacing: '0.14em',
                padding: '0 16px 12px',
              }}
            >
              Roles
            </div>
            {ROLES.map(role => {
              const Icon = role.icon;
              const isActive = role.id === activeRoleId;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRoleId(role.id)}
                  className="w-full flex items-center gap-3 transition-all"
                  style={{
                    padding: '10px 16px',
                    backgroundColor: isActive ? colors.paper : 'transparent',
                    borderLeft: `2px solid ${isActive ? role.color : 'transparent'}`,
                    color: isActive ? colors.ink : colors.inkSoft,
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '2px',
                  }}
                >
                  <Icon 
                    size={16} 
                    strokeWidth={isActive ? 2 : 1.5} 
                    style={{ color: isActive ? role.color : colors.inkMute, flexShrink: 0 }} 
                  />
                  <span 
                    style={{ 
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {role.short}
                  </span>
                  {isActive && (
                    <ChevronRight size={12} style={{ marginLeft: 'auto', color: role.color }} strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </nav>
          
          <div style={{ padding: '36px 28px 0' }}>
            <div 
              className="font-mono"
              style={{ 
                fontSize: '10px', 
                color: colors.inkMute,
                lineHeight: 1.6,
              }}
            >
              <div style={{ marginBottom: '4px' }}>v0.2 · Opción B</div>
              <div>Fase 0 — Foundation</div>
            </div>
          </div>
        </aside>
        
        {/* ============ MAIN CONTENT ============ */}
        <main style={{ flex: 1, padding: '48px 56px 80px', maxWidth: '1100px' }}>
          <div style={{ marginBottom: '48px' }}>
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{ 
                  width: '6px', 
                  height: '6px', 
                  backgroundColor: activeRole.color,
                }}
              />
              <div 
                className="font-mono uppercase"
                style={{ 
                  fontSize: '10px', 
                  color: colors.inkMute, 
                  letterSpacing: '0.16em',
                }}
              >
                {activeRole.short} · Orchestration view
              </div>
            </div>
            <h1 
              className="font-display"
              style={{ 
                fontSize: '54px',
                fontWeight: 400,
                color: colors.ink,
                lineHeight: 1.0,
                letterSpacing: '-0.025em',
                marginBottom: '16px',
              }}
            >
              {activeRole.name}
            </h1>
            <p 
              className="font-display"
              style={{ 
                fontSize: '18px',
                color: colors.inkSoft,
                lineHeight: 1.45,
                fontStyle: 'italic',
                maxWidth: '640px',
                fontWeight: 300,
              }}
            >
              {activeRole.description}
            </p>
          </div>
          
          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-px mb-12"
            style={{ backgroundColor: colors.line, border: `1px solid ${colors.line}` }}
          >
            <div style={{ backgroundColor: colors.paper, padding: '16px 20px' }}>
              <div 
                className="font-mono uppercase mb-1"
                style={{ fontSize: '10px', color: colors.inkMute, letterSpacing: '0.14em' }}
              >
                Transversales
              </div>
              <div 
                className="font-display"
                style={{ fontSize: '28px', color: colors.ink, fontWeight: 500 }}
              >
                {transversalForRole.length}
                <span 
                  className="font-mono"
                  style={{ fontSize: '13px', color: colors.inkMute, marginLeft: '6px', fontWeight: 400 }}
                >
                  / {Object.keys(TRANSVERSAL_SKILLS).length}
                </span>
              </div>
            </div>
            <div style={{ backgroundColor: colors.paper, padding: '16px 20px' }}>
              <div 
                className="font-mono uppercase mb-1"
                style={{ fontSize: '10px', color: colors.inkMute, letterSpacing: '0.14em' }}
              >
                Específicas
              </div>
              <div 
                className="font-display"
                style={{ fontSize: '28px', color: colors.ink, fontWeight: 500 }}
              >
                {activeRole.specific.length}
              </div>
            </div>
            <div style={{ backgroundColor: colors.paper, padding: '16px 20px' }}>
              <div 
                className="font-mono uppercase mb-1"
                style={{ fontSize: '10px', color: colors.inkMute, letterSpacing: '0.14em' }}
              >
                Live now
              </div>
              <div 
                className="font-display"
                style={{ fontSize: '28px', color: activeRole.color, fontWeight: 500 }}
              >
                {activeRole.specific.filter(s => s.status === 'live').length}
                <span 
                  className="font-mono"
                  style={{ fontSize: '13px', color: colors.inkMute, marginLeft: '6px', fontWeight: 400 }}
                >
                  / {activeRole.specific.length}
                </span>
              </div>
            </div>
          </div>
          
          {/* Transversal */}
          <section style={{ marginBottom: '64px' }}>
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <div 
                  className="font-mono uppercase mb-2"
                  style={{ fontSize: '11px', color: colors.inkMute, letterSpacing: '0.16em' }}
                >
                  Section 01
                </div>
                <h2 
                  className="font-display"
                  style={{ 
                    fontSize: '28px',
                    color: colors.ink,
                    fontWeight: 500,
                    lineHeight: 1.1,
                  }}
                >
                  Skills transversales <span style={{ fontStyle: 'italic', color: colors.inkMute, fontWeight: 300 }}>relevantes para {activeRole.short}</span>
                </h2>
              </div>
            </div>
            
            <p 
              className="font-sans mb-6"
              style={{ 
                fontSize: '14px', 
                color: colors.inkSoft, 
                lineHeight: 1.55,
                maxWidth: '560px',
              }}
            >
              Skills compartidas que este rol invoca con frecuencia. Estandarizan el "cómo hacemos las cosas aquí".
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {transversalForRole.map(skill => (
                <SkillCard 
                  key={skill.id} 
                  skill={skill} 
                  skillId={skill.id}
                  kind="transversal" 
                  accent={activeRole.color}
                  onLaunch={(s, k, id) => handleLaunch(s, k, id)}
                />
              ))}
            </div>
          </section>
          
          {/* Specific */}
          <section>
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <div 
                  className="font-mono uppercase mb-2"
                  style={{ fontSize: '11px', color: colors.inkMute, letterSpacing: '0.16em' }}
                >
                  Section 02
                </div>
                <h2 
                  className="font-display"
                  style={{ 
                    fontSize: '28px',
                    color: colors.ink,
                    fontWeight: 500,
                    lineHeight: 1.1,
                  }}
                >
                  Skills <span style={{ fontStyle: 'italic' }}>propias</span> de {activeRole.short}
                </h2>
              </div>
            </div>
            
            <p 
              className="font-sans mb-6"
              style={{ 
                fontSize: '14px', 
                color: colors.inkSoft, 
                lineHeight: 1.55,
                maxWidth: '560px',
              }}
            >
              Encapsulan el criterio experto de este rol. Aquí vive la diferenciación operativa.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {activeRole.specific.map((skill, i) => (
                <SkillCard 
                  key={i} 
                  skill={skill}
                  skillId={skill.name}
                  kind="specific" 
                  accent={activeRole.color}
                  onLaunch={(s, k, id) => handleLaunch(s, k, id)}
                />
              ))}
            </div>
          </section>
          
          {/* Footer note */}
          <div 
            style={{ 
              marginTop: '80px',
              padding: '24px 28px',
              backgroundColor: colors.bgAlt,
              borderLeft: `2px solid ${activeRole.color}`,
            }}
          >
            <div 
              className="font-mono uppercase mb-2"
              style={{ fontSize: '10px', color: colors.inkMute, letterSpacing: '0.14em' }}
            >
              Opción B · Cómo funciona
            </div>
            <p 
              className="font-sans"
              style={{ fontSize: '13px', color: colors.inkSoft, lineHeight: 1.6, maxWidth: '620px' }}
            >
              Cada skill <span style={{fontFamily: 'JetBrains Mono', fontSize: '10px', padding: '1px 5px', backgroundColor: 'rgba(92, 110, 58, 0.12)', color: colors.sage, letterSpacing: '0.08em', fontWeight: 600}}>LIVE</span> envía a Claude.ai un prompt autocontenido con las instrucciones de la skill + tus inputs. Cero infraestructura — usa la cuenta de Claude que cada persona ya tenga. Las skills <span style={{fontFamily: 'JetBrains Mono', fontSize: '10px', padding: '1px 5px', border: `1px solid ${colors.line}`, letterSpacing: '0.08em'}}>PLANNED</span> están en el roadmap pero aún sin prompt; aparecen disabled hasta que se implementen.
            </p>
          </div>
        </main>
      </div>
      
      {activeSkill && (
        <SkillModal 
          skill={activeSkill} 
          skillId={activeSkillId}
          kind={activeSkillKind}
          role={activeRole}
          onClose={() => setActiveSkill(null)} 
        />
      )}
    </div>
  );
}
