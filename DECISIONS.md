# Decisiones Arquitectónicas

## Decision: Clean Architecture en el backend

### Context

El backend necesita mantener separadas las reglas del dominio, los casos de uso,
la infraestructura y la exposición HTTP.

### Decision

Se organizó el backend en `domain`, `application`, `infrastructure` y
`presentation`, con rutas Next.js en `backend/app/api`.

### Rationale

Esta separación permite que el dominio no dependa de Next.js, PostgreSQL, JWT,
bcrypt ni Gemini.

### Consequences

Los route handlers se mantienen delgados y delegan en casos de uso. Agregar un
endpoint requiere respetar las capas existentes.

## Decision: PostgreSQL como fuente de persistencia y reglas críticas

### Context

La mensajería requiere consistencia, autorización por canal y operaciones
transaccionales.

### Decision

PostgreSQL almacena usuarios, canales, miembros, mensajes, estados de lectura y
refresh tokens. Las funciones SQL existentes manejan envío, historial, búsqueda,
contexto de copiloto y eliminación lógica.

### Rationale

Centralizar reglas críticas en PostgreSQL reduce duplicación en TypeScript y
mantiene la seguridad cerca de los datos.

### Consequences

El backend debe invocar funciones y vistas existentes en lugar de duplicar lógica
de permisos o búsqueda.

## Decision: RLS para aislamiento de datos

### Context

Ningún usuario debe leer, buscar o enviar contenido en canales donde no es
miembro.

### Decision

Se usa Row Level Security en canales y mensajes. El backend fija
`app.current_user_id` por transacción a partir del actor autenticado.

### Rationale

RLS permite que PostgreSQL sea la última línea de defensa para aislamiento por
usuario y canal.

### Consequences

Cada operación protegida debe ejecutarse con el actor obtenido desde JWT, nunca
desde el cliente.

## Decision: Rol `rw_app` para runtime

### Context

La API no debe ejecutarse con privilegios administrativos.

### Decision

La conexión runtime usa `rw_app`. La configuración valida que `DATABASE_URL`
utilice ese usuario.

### Rationale

Un usuario sin superuser ni BYPASSRLS evita saltarse las políticas de seguridad.

### Consequences

Dentro de Docker, `DATABASE_URL` apunta a
`postgresql://rw_app:...@postgres:5432/...`.

## Decision: JWT y refresh token rotation

### Context

La aplicación necesita sesiones web seguras con tokens de corta duración.

### Decision

El backend emite access tokens JWT y refresh tokens rotados. Los refresh tokens se
guardan como hash SHA-256 en PostgreSQL.

### Rationale

Los access tokens cortos reducen exposición, y la rotación permite revocar
sesiones.

### Consequences

El frontend almacena la sesión recibida por JSON y solicita refresh cuando una
respuesta devuelve 401.

## Decision: Gemini detrás de `AiProvider`

### Context

El asistente debe responder con contexto permitido sin exponer secretos al
frontend.

### Decision

Gemini vive en backend detrás del contrato `AiProvider`, y el frontend solo usa
`POST /api/copilot`.

### Rationale

Esto mantiene la API key en el servidor y permite cambiar proveedor sin acoplar
los casos de uso a la UI.

### Consequences

`AI_API_KEY` debe configurarse como variable de entorno del backend. No existe
`NEXT_PUBLIC_AI_API_KEY`.

## Decision: Frontend separado del backend

### Context

El proyecto debe ejecutar backend y frontend como aplicaciones independientes.

### Decision

El frontend vive en `frontend/` con su propio `package.json`, App Router,
Tailwind, i18n, componentes, features, tipos y cliente API.

### Rationale

Separar proyectos evita mezclar responsabilidades y permite ejecutar frontend en
3001 y backend en 3000.

### Consequences

El frontend consume el backend mediante `NEXT_PUBLIC_API_URL`.

## Decision: Docker Compose para la demo

### Context

La evaluación espera levantar PostgreSQL, backend y frontend desde la raíz.

### Decision

`docker-compose.yml` define servicios `postgres`, `backend` y `frontend`.

### Rationale

Un solo comando simplifica la demo y reduce diferencias entre máquinas.

### Consequences

`docker compose up --build` expone PostgreSQL en 5433, backend en 3000 y frontend
en 3001.

## Decision: Variables de entorno para secretos

### Context

JWT, PostgreSQL y Gemini requieren credenciales sensibles.

### Decision

Los secretos se configuran por `.env` y los `.env.example` contienen solo nombres
de variables y placeholders vacíos.

### Rationale

Evita filtrar credenciales reales en Git.

### Consequences

Una máquina limpia debe crear `.env` antes de levantar todo el stack.

## Decision: i18n simple ES/EN

### Context

La interfaz debe estar disponible en español e inglés sin una solución pesada.

### Decision

El frontend usa diccionarios JSON en `frontend/i18n` y un selector visible
`ES | EN`.

### Rationale

Es suficiente para la demo, mantiene textos centralizados y evita dependencias
innecesarias.

### Consequences

Los componentes reciben un diccionario y no duplican páginas por idioma.
