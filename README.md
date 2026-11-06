# Volver a subirse al escenario

Webstory para la charla de Francisca Medina (frani.be) en 9punto5.

Una narrativa a pantalla completa con scroll por secciones. Funciona como sitio navegable y como apoyo visual proyectable (las flechas del teclado avanzan y retroceden).

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

- Scroll o gesto: avanza sección por sección (snap).
- Flechas ↑ ↓ ← →, espacio, PageUp/PageDown: anterior/siguiente.
- Puntos a la derecha: saltar a una sección.

## Estructura

Las secciones siguen el arco de la charla:

1. Portada: Volver a subirse al escenario
2. Valdivia 2023, antes de subir
3. La niña que tenía miedo de hablar
4. El primer motivo (proyecto de título, cuentacuentos)
5. Encontrar mi tribu (comunidades)
6. Arriba del escenario (Franny, flow)
7. Lo que recibí al bajar (centro emocional: el papá y su hija)
8. Lo que me animé a hacer (Budapest, JSConf Chile)
9. Me exigía más que el público
10. Qué significa tener voz
11. Cierre: invitación + contacto

## Assets pendientes

Los espacios punteados son placeholders. Solo suelta el archivo con el nombre exacto en la carpeta indicada y aparece solo al recargar:

| Archivo | Sección | Qué iría bien |
|---|---|---|
| `assets/img/2023-antes-del-escenario.jpg` | Antes de subir | Backstage, Valdivia, o tu cara antes de la charla 2023 |
| `assets/img/nina.jpg` | La niña | Foto tuya de niña, o una ilustración |
| `assets/img/comunidad.jpg` | Tribu | Tu comunidad: Women Techmakers, meetup, etc. |
| `assets/video/2023-charla.mp4` | Escenario | Video de tu charla 2023 (o foto tuya en el escenario, renombra a `.jpg` y cambia `data-type`) |
| `assets/img/budapest.jpg` | Después | JSConf Budapest |
| `assets/img/jsconf-chile.jpg` | Después | JSConf Chile |
| `assets/img/mas-charlas.jpg` | Después | Otra charla, taller o comunidad |

## Estética

Basada en el deck `Abraza a tu impostora`: gradientes rosa/malva/ciruela, ondas orgánicas en capas, sparkles, ilustración de la niña mirando una estrella. Fuentes: Poppins (títulos) y Quicksand (cuerpo) desde Google Fonts.

## Editar textos

Todo el copy vive en `index.html`, texto plano por sección. Los temas de color se controlan con `class="slide slide--night|pink|cream"` y `data-waves`.
