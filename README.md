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
- Barra a la izquierda: progreso. Contador abajo a la izquierda.

## Estética

Minimalista con variantes por lámina: fondo crema, tinta ciruela, kickers malva espaciados, acento verde (guiño a la impostora). Tintes rosa (`slide--blush`) en las láminas emotivas y verde suave (`slide--sage`) en comunidad y cierre. Divisores en ciruela oscuro con ondas y destellos sutiles. Cards con iconos de línea, timeline, doble columna, comilla gigante, líneas en escalera y un ripple animado que representa el efecto mariposa en la lámina 19. QR a frani.be en la lámina final.

Fuentes: Poppins y Quicksand.

## Imágenes

Por ahora todas las láminas van sin fotos, para probar el diseño. Cuando quieras reincorporarlas, los assets ya están en `assets/img/` (nina, comunidad, budapest, jsconf-chile, 2023-antes-del-escenario) y se puede reactivar el loader de `script.js` con slots `.asset`.

`assets/qr-frani.svg` es el QR generado a https://frani.be/ (se recrea con `qrcode` de Python si cambia la URL).

## Editar

Todo el copy vive en `index.html`. Clases útiles: `slide--dark`, `slide--blush`, `slide--sage`, `inner--center`, `inner--split`, `statement`, `step`/`step--far` (escalera), `cards--N`, `em` para acento verde, `data-decor` (ondas+destellos), `data-sparkles="n"`.
