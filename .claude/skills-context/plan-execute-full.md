---
description: Planificacion estrategica de ejecucion de issues. Usa task-strategist (full mode) + Sequential Thinking + ultrathink para generar planes ejecutables con workflow-task. Ideal para tareas criticas y complejas.
argument-hint: "[#issue-number] [#issue-number-2...] [--skip-exploration] [--mode=fast|full]"
model: opus
ultrathink: true
tools: bash, read, write, edit, grep, glob, askuserquestion, todowrite, mcp__serena__activate_project, mcp__serena__read_file, mcp__serena__list_dir, mcp__serena__find_file, mcp__serena__search_for_pattern, mcp__serena__get_symbols_overview, mcp__serena__find_symbol, mcp__server-sequential-thinking__sequentialthinking, task
---

# /plan-execute - Planificacion Estrategica Multi-Agente

## Objetivo

Ejecutar un analisis estrategico profundo de issues de GitHub usando la skill `task-strategist` en modo full, generando un plan completo listo para ejecutar con `/workflow-task` en modo `dangerously skip permissions`.

**Diferencia con /voz:**
- `/voz`: Transforma input desorganizado en prompt estructurado (2-3 min)
- `/plan-execute`: Analisis estrategico multi-agente profundo (20-30 min)

## Flujo de Ejecucion

```
/plan-execute #110 #117
       |
       +---> Fase -3: Load context (primer, PROGRESS.yaml)
       |
       +---> Fase -2: Fetch issues (gh issue view) + detect domain
       |      +---> CHECKPOINT 1: Confirm scope
       |
       +---> Fase -1.5: Launch 5 Explore agents (PARALLEL)
       |      +---> [PRE: Load agent memories]
       |      +---> Generate EXPLORATION-REPORT.md
       |      +---> [POST: Save learnings to memories]
       |
       +---> Fase -1: Domain specialist (@backend + @frontend for fullstack)
       |      +---> [PRE: Read ai_docs/expertise/domain-experts/{{domain}}.yaml]
       |      +---> Generate DOMAIN-RECOMMENDATIONS.md
       |      +---> [POST: Append new decisions/blockers to memory]
       |
       +---> Fase -0.5: @gentleman + @codebase-analyst (PARALLEL)
       |      +---> [PRE: Read security.yaml + WORKFLOW-EXPERTISE.yaml]
       |      +---> @gentleman: Architectural review
       |      +---> @codebase-analyst: Pattern analysis (Serena MCP)
       |      +---> Generate ARCHITECTURAL-REVIEW.md (combined)
       |      +---> [POST: Save security decisions + patterns to memory]
       |
       +---> Fase 0: Sequential Thinking synthesis
       |      +---> Pre-mortem analysis
       |      +---> TDD test planning
       |      +---> Security checklist (OWASP)
       |      +---> Generate STRATEGIC-PLAN.md
       |      +---> CHECKPOINT 2: Approve plan
       |
       +---> Fase 1: Handoff preparation
              +---> Generate user_prompt.md
              +---> Display: git checkout -b {branch} -> /workflow-task

MEMORIA: Los agentes NUNCA ejecutan y olvidan.
         PRE: Leen ai_docs/expertise/domain-experts/*.yaml
         POST: Escriben decisions/blockers aprendidos
```

## Sistema de Memoria de Agentes (CRITICO)

Cada agente especializado DEBE seguir este patron de memoria persistente:

```yaml
# PATRON DE MEMORIA PRE/POST EJECUCION
# Este patron es OBLIGATORIO para todos los agentes

MEMORY_PATTERN:
  PRE_EXECUTION:
    1_read_memory:
      tool: Read
      path: 'ai_docs/expertise/domain-experts/{{agent_domain}}.yaml'
      extract:
        - decisions: Decisiones previas con confidence > 0.8
        - blockers: Problemas conocidos y soluciones
        - common_files: Archivos frecuentemente modificados
        - context.anti_patterns: Patrones a evitar

    2_inject_context:
      action: |
        Incluir en el prompt del agente:
        - "Decisiones relevantes: {{filtered_decisions}}"
        - "Blockers conocidos: {{relevant_blockers}}"
        - "Anti-patterns a evitar: {{anti_patterns}}"

  POST_EXECUTION:
    1_capture_decision:
      condition: "Si se tomo una decision arquitectonica importante"
      schema:
        id: "{{DOMAIN}}{{ISSUE}}-{{N}}"
        context: "Descripcion del contexto"
        decision: "La decision tomada"
        confidence_score: 0.0-1.0
        validated_count: 0
        failed_count: 0
        last_used: "{{timestamp}}"
        tags: ["tag1", "tag2"]

    2_capture_blocker:
      condition: "Si se encontro un problema y solucion"
      schema:
        id: "BLK{{ISSUE}}-{{N}}"
        description: "Descripcion del problema"
        solution: "Como se resolvio"
        severity: "low|medium|high|critical"
        discovered: "{{timestamp}}"
        resolved: true|false

    3_update_memory:
      tool: Edit
      path: 'ai_docs/expertise/domain-experts/{{agent_domain}}.yaml'
      append:
        - New decisions to decisions array
        - New blockers to blockers array
        - Update common_files if new patterns discovered

# REGLA DE ORO: Los agentes NUNCA ejecutan y olvidan.
# Cada ejecucion es una oportunidad de aprendizaje.
```

## Proceso Detallado

### Fase -3: Context Acquisition (Automatica)

```yaml
acciones:
  1_activar_serena:
    tool: mcp__serena__activate_project
    path: '/Users/cristianbejaranomendez/Documents/GitHub/ideas'

  2_leer_estado:
    tool: Read
    files:
      - 'ai_docs/state/PROGRESS.yaml'
      - 'CLAUDE.md'

  3_cargar_memoria:
    tool: mcp__serena__read_memory
    memory: 'phase_a_task_breakdown'

output: PROJECT_CONTEXT (in-memory)
```

### Fase -2: Issue Analysis

```yaml
acciones:
  1_fetch_issues:
    tool: Bash
    command: |
      gh issue view {{argument}} --json title,body,labels,assignees
      # Para cada issue en los argumentos

  2_detect_domain:
    logic: |
      score = {frontend: 0, backend: 0, infra: 0}

      # Labels (peso 3)
      if 'frontend' in labels: score.frontend += 3
      if 'backend' in labels: score.backend += 3
      if 'fullstack' in labels: score.frontend += 2; score.backend += 2

      # Keywords en body (peso 1)
      frontend_kw = ['component', 'UI', 'page', 'tsx', 'React']
      backend_kw = ['endpoint', 'API', 'migration', 'model', 'repository']

      # Domain = max score or 'fullstack' if mixed

  3_calculate_complexity:
    factors:
      - files_affected * 1
      - requirements_count * 0.5
      - mixed_domain * 1.5
      - constraints * 0.3
    scale: 1-10

output:
  ISSUE_CONTEXT: {...}
  DOMAIN: 'frontend|backend|fullstack|infra'
  COMPLEXITY_SCORE: N
  MODE: 'fast' if score <= 3 else 'full'
```

### CHECKPOINT 1: Confirm Scope

```yaml
AskUserQuestion:
  question: "He analizado los issues. Por favor confirma el scope:"

  summary:
    - "Issues: {{issue_numbers}}"
    - "Titulo principal: {{main_title}}"
    - "Dominio detectado: {{domain}} (confianza: {{confidence}}%)"
    - "Complejidad: {{score}}/10"
    - "Archivos estimados: ~{{n_files}}"
    - "Exploradores a lanzar: {{n_explorers}}"

  options:
    - label: "Confirmar y continuar"
      description: "Proceder con exploracion paralela"
    - label: "Ajustar scope"
      description: "Modificar dominio o complejidad"
    - label: "Cancelar"
      description: "Detener analisis estrategico"
```

### Fase -1.5: Parallel Exploration

**CRITICO:** Lanzar TODOS los explorers en un SOLO mensaje con multiples Task tool calls.

```yaml
explorers:
  explorer_1_structure:
    subagent_type: "Explore"
    description: "Explore codebase structure"
    prompt: |
      TASK: Explore structure and files for: {{issue_title}}

      CONTEXT:
      - Domain: {{domain}}
      - Predicted files: {{predicted_files}}

      INVESTIGATE:
      1. Verify predicted files exist
      2. Map directory structure for affected areas
      3. Identify file dependencies (imports/exports)
      4. Find related files not predicted
      5. Check for existing similar implementations

      OUTPUT: File Structure Analysis

  explorer_2_patterns:
    subagent_type: "Explore"
    description: "Explore patterns and conventions"
    prompt: |
      TASK: Identify patterns and conventions for: {{issue_title}}

      CONTEXT:
      - Domain: {{domain}}
      - Tech stack: FastAPI, SQLAlchemy, React, TypeScript

      INVESTIGATE:
      1. Find similar features in codebase
      2. Document naming conventions
      3. Identify design patterns (repository, factory, etc.)
      4. Check API patterns (hooks, endpoints)
      5. Note state management patterns

      OUTPUT: Patterns Analysis

  explorer_3_tests:
    subagent_type: "Explore"
    description: "Explore tests and quality"
    prompt: |
      TASK: Analyze test coverage for: {{issue_title}}

      INVESTIGATE:
      1. Find existing tests for similar features
      2. Identify test patterns used
      3. Check test utilities available
      4. Note mocking strategies
      5. Identify coverage gaps

      OUTPUT: Tests & Quality Analysis

  explorer_4_security:
    subagent_type: "Explore"
    description: "Explore security considerations"
    prompt: |
      TASK: Security scan for: {{issue_title}}

      INVESTIGATE (OWASP Top 10):
      1. Input validation patterns
      2. Authentication/authorization flows
      3. Data handling (sensitive data, PII)
      4. API security (CORS, rate limiting)
      5. Existing security utilities

      OUTPUT: Security Analysis

  explorer_5_similar:
    subagent_type: "Explore"
    description: "Find similar implementations"
    prompt: |
      TASK: Find similar implementations for: {{issue_title}}

      INVESTIGATE:
      1. Search for similar CRUD operations
      2. Find comparable UI components
      3. Identify reusable logic
      4. Note patterns to follow
      5. Find anti-patterns to avoid

      OUTPUT: Similar Implementations

consolidation:
  tool: Write
  path: 'ai_docs/strategic/current/EXPLORATION-REPORT.md'
  content: |
    # Exploration Report: {{issue_title}}

    > Generated: {{timestamp}}
    > Explorers: 5
    > Domain: {{domain}}

    ## Executive Summary
    [2-3 sentences summarizing key findings]

    ## 1. Structure & Files (Explorer 1)
    {{explorer_1_output}}

    ## 2. Patterns & Conventions (Explorer 2)
    {{explorer_2_output}}

    ## 3. Tests & Quality (Explorer 3)
    {{explorer_3_output}}

    ## 4. Security Considerations (Explorer 4)
    {{explorer_4_output}}

    ## 5. Similar Implementations (Explorer 5)
    {{explorer_5_output}}

    ## Cross-Explorer Insights
    ### Consensus Points
    ### Conflicting Observations
    ### Gaps Identified
```

### Fase -1: Domain Specialist (con Memoria Persistente)

**CRITICO:** Cada agente DEBE leer su memoria ANTES y escribir aprendizajes DESPUES.

```yaml
# PASO 1: PRE-EXECUTION - Leer memoria del dominio
pre_execution:
  tool: Read
  path: 'ai_docs/expertise/domain-experts/{{domain}}.yaml'
  extract:
    - decisions (filter: confidence_score >= 0.8)
    - blockers (filter: resolved == true)
    - context.anti_patterns
    - common_files

# PASO 2: Routing con contexto de memoria
routing:
  IF DOMAIN == 'backend':
    agent: '@backend'
    focus: [FastAPI, SQLAlchemy, RLS, Clean Architecture]
    memory_file: 'ai_docs/expertise/domain-experts/backend.yaml'
    inject_to_prompt: |
      ## Memoria del Agente Backend
      ### Decisiones Previas Relevantes (confidence >= 0.8)
      {{filtered_decisions}}

      ### Blockers Conocidos
      {{resolved_blockers}}

      ### Anti-Patterns a Evitar
      {{anti_patterns}}

  IF DOMAIN == 'frontend':
    agent: '@frontend'
    focus: [React, TypeScript, Tailwind, React Query]
    memory_file: 'ai_docs/expertise/domain-experts/frontend.yaml'
    inject_to_prompt: |
      ## Memoria del Agente Frontend
      {{similar_inject}}

  IF DOMAIN == 'fullstack':
    agents: ['@backend', '@frontend']  # Paralelo
    focus: [API contracts, shared types, integration points]
    memory_files:
      - 'ai_docs/expertise/domain-experts/backend.yaml'
      - 'ai_docs/expertise/domain-experts/frontend.yaml'
    inject_to_prompt: |
      ## Memoria Combinada Backend + Frontend
      {{combined_decisions}}

  IF DOMAIN == 'infra':
    agent: '@infra'
    focus: [Docker, CI/CD, deployment, observability]
    memory_file: 'ai_docs/expertise/domain-experts/infra.yaml'

# PASO 3: POST-EXECUTION - Capturar aprendizajes
post_execution:
  IF new_decision_made:
    action: |
      Append to ai_docs/expertise/domain-experts/{{domain}}.yaml:
      decisions:
        - id: "{{DOMAIN}}{{ISSUE}}-{{N}}"
          context: "{{decision_context}}"
          decision: "{{decision_made}}"
          confidence_score: 0.85
          validated_count: 0
          failed_count: 0
          last_used: "{{timestamp}}"
          tags: {{relevant_tags}}

  IF blocker_found_and_resolved:
    action: |
      Append to blockers array with solution

output:
  tool: Write
  path: 'ai_docs/strategic/current/DOMAIN-RECOMMENDATIONS.md'
```

### Fase -0.5: Architectural Review (@gentleman + @codebase-analyst)

**CRITICO:** Esta fase ejecuta DOS agentes en PARALELO con memoria persistente:
1. `@gentleman` - Review arquitectonico confrontacional
2. `@codebase-analyst` - Analisis profundo de patrones del codebase

```yaml
# PASO 1: PRE-EXECUTION - Leer memorias de ambos agentes
pre_execution:
  parallel:
    - tool: Read
      path: 'ai_docs/expertise/domain-experts/security.yaml'  # @gentleman usa security
      extract: [decisions, blockers, context.anti_patterns]

    - tool: Read
      path: 'ai_docs/expertise/WORKFLOW-EXPERTISE.yaml'  # @codebase-analyst usa global
      extract: [patterns, decisions, common_issues]

# PASO 2: Lanzar agentes en PARALELO (single message, multiple Task calls)
agents:
  # AGENTE 1: @gentleman - Review Arquitectonico
  gentleman:
    subagent_type: "gentleman"
    description: "Architectural review by @gentleman"
    prompt: |
      Sos un Senior Architect con 15+ anos de experiencia en sistemas enterprise.
      Tu rol es hacer una REVISION CRITICA del plan propuesto.

      NO VALIDES sin verificar. NO SEAS AMABLE por defecto.
      Tu trabajo es encontrar problemas ANTES de que lleguen a produccion.

      ## Memoria del Agente (Decisiones Previas)
      {{security_decisions}}

      ## Blockers Conocidos en Security
      {{security_blockers}}

      ## Contexto
      {{project_context}}

      ## Tarea
      Issue: {{issue_title}}
      Objetivo: {{issue_objective}}
      Dominio: {{domain}}
      Complejidad: {{complexity_score}}/10

      ## Hallazgos de Exploracion
      {{exploration_report_summary}}

      ## Recomendaciones del Especialista
      {{domain_recommendations_summary}}

      ## Tu Revision

      ### 1. SOLID Principles Check
      - S: Single Responsibility?
      - O: Open/Closed?
      - L: Liskov Substitution?
      - I: Interface Segregation?
      - D: Dependency Inversion?

      ### 2. Security Analysis (OWASP Top 10)
      - [ ] Injection
      - [ ] Broken Auth
      - [ ] Sensitive Data Exposure
      - [ ] Broken Access Control
      - [ ] Security Misconfiguration

      ### 3. Scalability Concerns
      - Que pasa con 10x usuarios?
      - Que pasa con 100x datos?

      ### 4. Technical Debt Impact
      - Se esta agregando deuda?
      - El codigo sera mantenible en 6 meses?

      ### 5. Preguntas Confrontacionales
      Las preguntas que el developer NO quiere escuchar.

      ### 6. Alternative Approaches
      Al menos UNA alternativa al approach sugerido.

      ### 7. Verdict
      - APPROVED: El plan es solido
      - APPROVED_WITH_CONCERNS: Proceder pero atender [lista]
      - NEEDS_REVISION: No proceder hasta resolver [lista]
      - REJECTED: El approach es fundamentalmente incorrecto

      ## Aprendizajes para Guardar
      Si encontras patrones nuevos o decisiones importantes, documentalos
      para agregarlos a la memoria del agente.

  # AGENTE 2: @codebase-analyst - Analisis de Patrones
  codebase_analyst:
    subagent_type: "codebase-analyst"
    description: "Deep codebase pattern analysis"
    prompt: |
      Analiza profundamente el codebase usando Serena MCP para descubrir:
      1. Patrones existentes que aplican a esta tarea
      2. Estilo de codigo del equipo
      3. Estandares establecidos
      4. Simbolos y estructuras relevantes

      ## Memoria Global del Proyecto
      {{workflow_expertise}}

      ## Tarea
      Issue: {{issue_title}}
      Dominio: {{domain}}
      Files Predichos: {{predicted_files}}

      ## Tools a Usar
      - mcp__serena__find_symbol: Buscar simbolos relevantes
      - mcp__serena__search_for_pattern: Encontrar patrones de codigo
      - mcp__serena__get_symbols_overview: Vista general de archivos
      - mcp__serena__write_memory: Guardar hallazgos importantes

      ## Output Esperado
      ### Patrones Descubiertos
      - Pattern 1: [descripcion]
      - Pattern 2: [descripcion]

      ### Estandares del Equipo
      - Naming conventions observadas
      - Structure patterns
      - Error handling patterns

      ### Simbolos Relevantes
      | Symbol | Location | Relevance |
      |--------|----------|-----------|

      ### Recomendaciones para Implementacion
      Basado en el analisis, recomienda como implementar
      siguiendo los patrones existentes.

# PASO 3: Consolidar outputs de ambos agentes
consolidation:
  tool: Write
  path: 'ai_docs/strategic/current/ARCHITECTURAL-REVIEW.md'
  content: |
    # Architectural Review: {{issue_title}}

    > Reviewed by: @gentleman + @codebase-analyst
    > Date: {{timestamp}}

    ---

    ## Part 1: @gentleman Review
    {{gentleman_output}}

    ---

    ## Part 2: @codebase-analyst Analysis
    {{codebase_analyst_output}}

    ---

    ## Combined Verdict
    @gentleman: {{gentleman_verdict}}
    @codebase-analyst: {{patterns_compliance}}

    ## Action Items Before Proceeding
    1. [From @gentleman]
    2. [From @codebase-analyst]

# PASO 4: POST-EXECUTION - Guardar aprendizajes de AMBOS agentes
post_execution:
  gentleman:
    IF new_security_decision:
      tool: Edit
      path: 'ai_docs/expertise/domain-experts/security.yaml'
      append_to: decisions

  codebase_analyst:
    tool: mcp__serena__write_memory
    memory_key: "patterns_{{issue_number}}"
    content: "{{discovered_patterns}}"
```

### Fase 0: Strategic Synthesis

```yaml
process:
  1_sequential_thinking:
    tool: mcp__server-sequential-thinking__sequentialthinking
    thoughts: 5-8
    focus:
      - thought_1: "Pre-mortem: Si esta implementacion falla, que salio mal?"
      - thought_2: "Risk probability assessment"
      - thought_3: "Impact severity analysis"
      - thought_4: "Mitigation strategies"
      - thought_5: "TDD test plan generation"
      - thought_6: "Security checklist based on OWASP"
      - thought_7: "Implementation order (topological sort)"
      - thought_8: "Rollback strategy"

  2_generate_plan:
    tool: Write
    path: 'ai_docs/strategic/current/STRATEGIC-PLAN.md'
    template: |
      # Strategic Plan: {{issue_title}}

      > Generated: {{timestamp}}
      > Complexity: {{complexity_score}}/10
      > Domain: {{domain}}
      > Mode: {{mode}}

      ## Executive Summary
      [2-3 oraciones sobre el objetivo y approach]

      ## Pre-Mortem Analysis
      ### Potential Failure Modes
      {{from_sequential_thinking}}

      ### Risk Matrix
      | Risk | Probability | Impact | Mitigation |
      |------|-------------|--------|------------|

      ## TDD Test Plan
      ### Unit Tests
      | Test Name | Input | Expected | Priority |
      |-----------|-------|----------|----------|

      ### Integration Tests
      | Test Name | Components | Expected Behavior |
      |-----------|------------|-------------------|

      ## Security Checklist (OWASP)
      - [ ] Injection prevention
      - [ ] Authentication validated
      - [ ] Authorization (RLS)
      - [ ] Input validation
      - [ ] Rate limiting

      ## Technical Debt Assessment
      - Existing debt affected: [list]
      - New debt introduced: [list]
      - Verdict: ACCEPTABLE | NEEDS_ATTENTION | UNACCEPTABLE

      ## Implementation Strategy
      | Order | Category | Description | Files | Action |
      |-------|----------|-------------|-------|--------|
      | 1 | TESTS | Write failing tests | [...] | CREATE |
      | 2 | TYPES | Define types/schemas | [...] | CREATE |
      | 3 | IMPL | Core implementation | [...] | CREATE/MODIFY |
      | 4 | INTEGRATION | Wire up components | [...] | MODIFY |
      | 5 | VERIFICATION | Run tests | - | BASH |

      ## Rollback Strategy
      ```bash
      # Pre-checkpoint
      git tag pre-{{issue_number}}

      # Rollback if needed
      git reset --hard pre-{{issue_number}}
      ```

      ## @gentleman Conditions
      {{conditions_from_review}}

      ## Acceptance Criteria
      - [ ] {{criteria_from_issue}}
      - [ ] Tests pass (make test)
      - [ ] Lint clean (make lint)
      - [ ] Types clean (make typecheck)
```

### CHECKPOINT 2: Approve Plan

```yaml
AskUserQuestion:
  question: "El plan estrategico esta listo. Por favor revisa y decide:"

  summary:
    - "Risk Level: {{risk_level}}"
    - "Complexity: {{complexity}}/10"
    - "Tests Defined: {{n_tests}}"
    - "Files to Change: {{n_files}}"
    - "@gentleman Verdict: {{verdict}}"

  options:
    - label: "Aprobar y generar handoff"
      description: "Generar user_prompt.md para workflow-task"
    - label: "Solicitar cambios"
      description: "Modificar el plan antes de continuar"
    - label: "Rechazar"
      description: "No proceder con este approach"
```

### Fase 1: Handoff Preparation

```yaml
on_approval:
  1_extract_variables:
    source: 'ai_docs/strategic/current/STRATEGIC-PLAN.md'
    extract:
      - branch_name
      - complexity_score
      - mode
      - domain
      - files_to_modify
      - acceptance_criteria

  2_generate_user_prompt:
    tool: Write
    path: 'user_prompt.md'
    content: |
      # Proximas Tareas - Issue {{issue_numbers}}

      > **Fecha:** {{timestamp}}
      > **Branch:** {{branch_name}}
      > **Workflow ID:** {{workflow_id}}

      ---

      ## Source

      ```yaml
      SOURCE_TYPE: "strategic"
      SOURCE_PATH: "ai_docs/strategic/current/STRATEGIC-PLAN.md"
      COMPLEXITY: {{complexity_score}}/10
      DOMAIN: "{{domain}}"
      MODE: "{{mode}}"
      ADDITIONAL_CONTEXT:
        - "ai_docs/strategic/current/EXPLORATION-REPORT.md"
        - "ai_docs/strategic/current/DOMAIN-RECOMMENDATIONS.md"
        - "ai_docs/strategic/current/ARCHITECTURAL-REVIEW.md"
      ```

      ---

      ## Purpose

      {{executive_summary}}

      ---

      ## Variables

      ```yaml
      ISSUE_NUMBERS: {{issue_numbers}}

      # Git
      BRANCH_NAME: '{{branch_name}}'

      # Workflow config
      COMPLEXITY_SCORE: {{complexity_score}}
      MODE: '{{mode}}'
      DOMAIN_EXPERT: '{{domain}}'

      # Paths
      SKILL_PATH: '.claude/skills/workflow-task/'
      STATE_DIR: 'ai_docs/state/'
      STRATEGIC_PLAN: 'ai_docs/strategic/current/STRATEGIC-PLAN.md'

      # Pre-existing work
      SKIP_PLANNING: true
      MIGRATION_CREATED: false
      ```

      ## Code Structure
      ```yaml
      files_to_modify:
      {{files_yaml}}

      affected_layers:
        {{layers}}

      dependencies:
        internal: {{internal_deps}}
        external: {{external_deps}}
      ```

      ## Instructions
      1. Crear rama: `git checkout -b {{branch_name}}`
      2. Invocar skill: `/workflow-task`
      3. La skill ejecuta fases 0-5 (planning ya hecho - skip Fase 1)
      4. Crear PR cuando Fase 5 complete

      ## Workflow
      ```yaml
      pre_loaded_context:
        strategic_plan: 'ai_docs/strategic/current/STRATEGIC-PLAN.md'
        exploration_report: 'ai_docs/strategic/current/EXPLORATION-REPORT.md'
        domain_recommendations: 'ai_docs/strategic/current/DOMAIN-RECOMMENDATIONS.md'
        architectural_review: 'ai_docs/strategic/current/ARCHITECTURAL-REVIEW.md'

      pre_conditions:
        IF ai_docs/state/PROGRESS.yaml exists:
          THEN: 'Continuity check - resume o archive'
          ELSE: 'Fresh start - crear estado'

        LOAD_CONTEXT:
          FROM: 'ai_docs/strategic/current/STRATEGIC-PLAN.md'
          INTO: 'GOAL.md'

      execution:
        IF DOMAIN_EXPERT == 'backend':
          INJECT_CONTEXT:
            - 'RLS policies required for multi-tenant tables'
            - 'Use alembic for migrations'
            - 'CRITICAL: Use Session Pooler (port 5432)'

        IF DOMAIN_EXPERT == 'frontend':
          INJECT_CONTEXT:
            - 'React functional components only'
            - 'TypeScript strict mode'
            - 'Tailwind CSS for styling'
            - 'React Query for server state'

        IF DOMAIN_EXPERT == 'fullstack':
          INJECT_CONTEXT:
            - 'API contracts must match frontend types'
            - 'Use shared types from packages/types'

      validation:
        MUST_PASS:
          - 'mcp__ide__getDiagnostics() == 0 errors'
          - 'make test passes'
          - 'make lint clean'
      ```

      ## Examples
      {{similar_implementations_from_exploration}}

      ## Report
      ```yaml
      expected_outputs:
        state_files:
          - 'ai_docs/state/GOAL.md'
          - 'ai_docs/state/PROGRESS.yaml'
          - 'ai_docs/state/DECISIONS.md'

        git:
          - 'Branch: {{branch_name}}'
          - 'PR hacia main'
      ```

      ## Acceptance Criteria
      {{acceptance_criteria}}

      ## @gentleman Conditions (CRITICAL)
      {{gentleman_conditions}}

  3_display_summary:
    output: |
      ---
      **Source:** strategic_plan
      **Issues:** {{issue_numbers}}
      **Branch:** `{{branch_name}}`
      **Complexity:** {{complexity_score}}/10 (mode: {{mode}})
      **Domain Expert:** {{domain}}
      **Files:** {{n_files}} archivos identificados

      **Pre-loaded Context:**
      - Strategic Plan (task-strategist output)
      - Exploration Report
      - Domain Recommendations
      - Architectural Review

      **@gentleman Verdict:** {{verdict}}

      **Next Steps:**
      ```bash
      git checkout -b {{branch_name}}
      ```
      Then run: `/workflow-task`

      Or for dangerously skip permissions mode:
      ```bash
      claude --dangerously-skip-permissions
      ```
      ---
```

## Argumentos

| Argumento | Requerido | Descripcion |
|-----------|-----------|-------------|
| `#N` | Si | Issue number principal |
| `#M #O...` | No | Issues adicionales relacionados |
| `--skip-exploration` | No | Saltar Fase -1.5 si ya existe EXPLORATION-REPORT.md |
| `--mode=fast` | No | Forzar modo fast (saltar review) |
| `--mode=full` | No | Forzar modo full (default para complejidad > 4) |

## Ejemplos de Uso

```bash
# Issue unico
/plan-execute #110

# Multiples issues relacionados
/plan-execute #110 #117

# Skip exploration (ya existe report)
/plan-execute #110 --skip-exploration

# Forzar modo
/plan-execute #110 --mode=full
```

## Output Files

| Archivo | Fase | Contenido |
|---------|------|-----------|
| `ai_docs/strategic/current/EXPLORATION-REPORT.md` | -1.5 | Findings de 5 explorers |
| `ai_docs/strategic/current/DOMAIN-RECOMMENDATIONS.md` | -1 | Recomendaciones del especialista |
| `ai_docs/strategic/current/ARCHITECTURAL-REVIEW.md` | -0.5 | Review de @gentleman |
| `ai_docs/strategic/current/STRATEGIC-PLAN.md` | 0 | Plan estrategico completo |
| `user_prompt.md` | 1 | Prompt listo para workflow-task |

## Metricas de Exito

| Metrica | Target |
|---------|--------|
| Bugs descubiertos pre-implementacion | +50% |
| Tiempo de implementacion | -20% |
| Rework post-implementacion | -40% |
| Test coverage en nuevas features | >80% |
| Plan approval rate (primer intento) | >90% |

## Cuando Usar Este Comando

**USAR /plan-execute cuando:**
- Tareas complejas (complejidad > 5)
- Features criticas de negocio
- Cambios que afectan multiples capas (fullstack)
- Migraciones de base de datos
- Features de seguridad
- Integraciones con servicios externos

**NO usar cuando:**
- Fixes triviales (typos, minor bugs)
- Complejidad < 3
- Cambios aislados a un solo archivo
- Ya existe un plan estrategico reciente

## Referencias

- **task-strategist skill:** `.claude/skills/task-strategist/`
- **workflow-task skill:** `.claude/skills/workflow-task/`
- **Domain detection rules:** `.claude/skills/task-strategist/domain-detection/`
- **Templates:** `.claude/skills/task-strategist/templates/`

---

**Version:** 1.1.0
**Creado:** 2026-01-05
**Actualizado:** 2026-01-05
**Basado en:** task-strategist v1.1.0 + workflow-task v2.0

### Changelog

#### v1.1.0 (2026-01-05)
- Added @codebase-analyst to Fase -0.5 (parallel with @gentleman)
- Implemented agent memory system (PRE/POST execution)
- Agents read from ai_docs/expertise/domain-experts/*.yaml
- Agents write decisions/blockers back to memory
- Rule: "Agents NEVER execute and forget"

#### v1.0.0 (2026-01-05)
- Initial release
- 7 phases (-3 to 1)
- 5 parallel explorers
- Domain specialist routing
- @gentleman architectural review
- Sequential Thinking synthesis
- Automatic handoff to workflow-task

## Input a Procesar

{{argument}}
