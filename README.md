# Observatorios del Uruguay · UNE

Directorio para encontrar datos, estadísticas e informes sobre Uruguay y conocer quién los publica.

## Contenido

- Búsqueda por tema, institución o palabra clave.
- Exploración por temas e instituciones, con filtros y acceso directo a las fuentes.
- Mapa animado con lupa y zoom.
- Visualizador de programas de apoyo a la investigación de CSIC incorporado el 11/11/2026.

## Archivos y actualización

- site/template.html: plantilla completa que usa la publicación automática.
- site/directory.js: fuente de la lógica del directorio, incluida en la plantilla.
- data/Observatorios_Uruguay_taxonomia.xlsx: inventario completo de 148 recursos, actualizado el 11/11/2026 e incluida la clasificación de CSIC.
- data/recursos_adicionales.json: incorporaciones posteriores, conservadas al regenerar los datos. Si un recurso ya está en la planilla por ID o URL, prevalece la planilla.
- data/atlas.json: inventario generado.
- scripts/xlsx_to_json.py: combina planilla e incorporaciones adicionales.
- scripts/build_site.py: genera index.html para GitHub Pages.
- scripts/build.cjs: alternativa de generación local con Node.
- scripts/check.cjs y scripts/test-directory.cjs: validación de estructura y regresión del buscador.

La acción existente reconstruye el sitio al cambiar la planilla, los scripts o la plantilla y mensualmente. Después de editar solo recursos_adicionales.json, ejecutar manualmente la acción de actualización.

## Verificación local

    node scripts/check.cjs
    node scripts/test-directory.cjs

## Publicación

GitHub Pages sirve index.html desde main, carpeta raíz. El mapa conserva su animación, lupa y zoom; los cambios de contenido y navegación se realizan fuera de esa interacción.
