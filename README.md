# Volver a subirse al escenario

Webstory para la charla de Francisca Medina (frani.be) en 9punto5 2026.

51 láminas a pantalla completa, una por cada página del deck `.devin/slides/Volver a subirse al escenario.pptx.pdf`. Los textos son exactamente los del deck. Funciona como sitio navegable y como apoyo proyectable (las flechas del teclado avanzan y retroceden).

## Cómo verla

Sin dependencias, es HTML/CSS/JS plano:

```bash
open index.html
```

o con servidor local:

```bash
python3 -m http.server 8080
```

y abrir http://localhost:8080

## Navegación

- Scroll o gesto: avanza lámina por lámina (snap).
- Flechas ↑ ↓ ← →, espacio, PageUp/PageDown: anterior/siguiente.
- Barra verde a la izquierda: progreso. Contador abajo a la izquierda.

## Estética

Minimalista: fondo crema, tinta ciruela, kickers malva, acento verde (guiño a la impostora de *Abraza a tu impostora*). Divisores de acto (01, 02, 03, 05) en ciruela oscuro con numeral fantasma. Fuentes: Poppins y Quicksand.

## Assets pendientes

Los espacios punteados son placeholders: suelta el archivo con el nombre exacto y aparece al recargar.

| Archivo | Lámina | Estado |
|---|---|---|
| `assets/img/nina.jpg` | 03, niña extraña | listo |
| `assets/img/2023-antes-del-escenario.jpg` | 07, divisor Valdivia | listo |
| `assets/img/abrazos.jpg` | 16, los abrazos al bajar | pendiente |
| `assets/img/2023-escenario.jpg` | 22, timeline 2023 | pendiente |
| `assets/img/budapest.jpg` | 22, timeline 2024 | listo |
| `assets/img/impostora.jpg` | 22, timeline 2025 | pendiente |
| `assets/img/2026-9punto5.jpg` | 22, timeline 2026 | pendiente (opcional) |
| `assets/img/comunidad.jpeg` | 30, comunidades | listo |
| `assets/img/jsconf-chile.jpg` | 47, card Escenarios | listo |
| `assets/img/frani.jpg` | 47, retrato | pendiente |

Opcional: un video de la charla 2023 (`assets/video/2023-charla.mp4`) podría ir en la lámina 11 o 16.

## Editar

Todo el copy vive en `index.html`. Los temas son `class="slide"` (claro) y `slide--dark` (divisores y cierres).
