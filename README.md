# Volver al escenario de 9punto5

Webstory para la charla de Francisca Medina (frani.be) en 9punto5 2026.

50 láminas a pantalla completa basadas en el deck `.devin/slides/Volver a subirse al escenario.pptx.pdf`. Funciona como sitio navegable y como apoyo proyectable (las flechas del teclado avanzan y retroceden).

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
- Barra a la izquierda: progreso. Contador abajo a la izquierda.
- Logo `frani.be` fijo arriba a la derecha: cambia de color según el fondo y enlaza al sitio.

## Estética

Minimalista con variantes por lámina: crema, tintas rosa (`slide--blush`) y verde (`slide--sage`), divisores y cierres en ciruela oscuro. Acento verde (guiño a *Abraza a tu impostora*) en palabras clave. Cards con iconos de línea, timeline, doble columna, comilla gigante, líneas en escalera, árbol que se mece en las láminas 3 y 48, sparkles mínimos y ondas suaves en las oscuras. Fuentes: Poppins y Quicksand.

## Piezas interactivas

- **Lámina 19, efecto mariposa:** ripple SVG animado, un punto verde emite anillos que viajan por un camino punteado hacia anillos enormes.
- **Lámina 30, comunidades:** malla descentralizada animada, 14 nodos conectados entre sí sin centro.
- **Lámina 50 (final), Gracias 9punto5:** `applause.js`, partículas que forman el logo de 9punto5 con la energía del aplauso. Adaptado del sketch de *Infinite Patterns in the Digital Canvas* (JSNation) a p5.js + p5.sound. Micrófono real, botón de aplausos simulados, o tocar la lámina. El logo se muestrea por píxeles desde `assets/9punto5-logo.svg`. QR a https://frani.be/ en la esquina inferior derecha (`assets/qr-frani.svg`, regenerable con `qrcode` de Python).

## Imágenes

Por ahora todas las láminas van sin fotos, para probar el diseño. Cuando quieras reincorporarlas, los archivos siguen en `assets/img/` (nina, comunidad, budapest, jsconf-chile, 2023-antes-del-escenario).

## Editar

Todo el copy vive en `index.html`. Clases útiles: `slide--dark`, `slide--blush`, `slide--sage`, `inner--center`, `inner--split`, `inner--top`, `statement`, `step`/`step--far` (escalera), `cards--N`, `em` para acento verde, `data-decor` (ondas + destellos en oscuras), `data-sparkles="n"`.
