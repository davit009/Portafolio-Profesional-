# Portafolio Profesional — David García Vera

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni paso de build) para el Entregable 3: Portafolio Profesional Digital (FITEC).

## Estructura

- `index.html` — portada, propuesta de valor, casos de estudio, trayectoria y contacto.
- `proyectos/` — una página por caso de estudio:
  - `gestion-actualizaciones-action1.html` — Caso 01, Techemet.
  - `auditoria-rutas-ia.html` — Caso 02, Germinate.
  - `rustdesk-control-remoto.html` — Caso 03.
- `styles.css` — estilos compartidos (responsive, modo claro/oscuro).
- `script.js` — menú móvil, índice con sección activa, visor de imágenes y tooltips de gráficas.
- `assets/` — capturas (anonimizadas cuando corresponde) y referencias visuales.

Cada caso de estudio sigue la misma estructura de la rúbrica: título y rol, contexto y problema, herramientas y tecnologías, evidencia visual/técnica y resultados e impacto.

## Despliegue

Se publica directamente en Vercel (framework preset: *Other*, sin comando de build). `vercel.json` activa URLs limpias.
