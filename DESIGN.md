# Perfil y laboratorio visual

El perfil usa archivos alojados en este repositorio: un GIF para el movimiento y un PNG para quienes prefieren reducir las animaciones. El texto importante también está en el README y en el texto alternativo de la imagen.

## Abrir el laboratorio

Descarga el repositorio y abre `docs/index.html` en un navegador moderno. Es un HTML autocontenido, sin fuentes, imágenes externas, audio ni peticiones de red para renderizar la animación.

La vista pública muestra la animación sin paneles, presets, contadores ni instrucciones técnicas. Para editar, abre `docs/index.html?editor=1` (por ejemplo, `http://127.0.0.1:8767/docs/index.html?editor=1` en la vista local). Este modo conserva las siguientes herramientas; sus atajos no se activan en la vista pública:

- Ocho estilos: órbitas, plexus, ondas, contornos, flujo impresionista, vitral, ASCII y atractor 3D.
- Siete paletas y seis combinaciones predefinidas.
- Texto clásico, terminal, firma mínima o solo arte.
- Velocidad, escala, turbulencia, densidad y grosor.
- Banner, pantalla, 16:9, 9:16 y cuadrado.
- Pausa, reinicio, combinaciones al azar, exportación PNG y grabación manual WebM.
- Tecla **H** para ocultar o recuperar los controles.
- Movimiento reducido según la preferencia del sistema.

GitHub muestra el GIF en el README. El laboratorio interactivo necesita abrirse en un navegador o alojarse como sitio; el README enlaza al código, sin asumir que GitHub Pages está publicado. Los enlaces que copia el laboratorio conservan estilo, paleta, texto, parámetros, semilla, efectos y proporción. Abrir un archivo local genera un enlace local; usa el sitio publicado para compartirlo con otras personas.

## Publicar en GitHub

El repositorio del perfil es `7Ferxxo/7Ferxxo`. El README y `assets/` van en su raíz; el sitio interactivo vive en `docs/`.

1. Revisar y subir estos cambios a `main` para actualizar el perfil.
2. En el repositorio, abrir **Settings → Pages**.
3. Elegir **Deploy from a branch**, rama **main**, carpeta **/docs** y guardar.
4. Esperar a que termine la publicación y abrir la URL que indique GitHub.

La dirección prevista, sin un dominio personalizado, es `https://7ferxxo.github.io/7Ferxxo/`. La carpeta incluye `.nojekyll`: se sirve el HTML tal como está, sin necesitar compilación ni dependencias en Pages. Solo `docs/` se publica como sitio.

Cuando el sitio responda correctamente, el enlace al HTML del README puede sustituirse por la URL pública. Preparar estos archivos no activa Pages ni cambia el perfil remoto.

Referencia: [configurar el origen de publicación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Regenerar los archivos del perfil

Requisitos: Node.js, Playwright con Chromium instalado, Python 3 y Pillow. Las dependencias solo se necesitan para exportar, no para abrir el laboratorio.

```sh
npm install --no-save playwright marked
npx playwright install chromium
python -m pip install Pillow
node scripts/render-assets.cjs
python scripts/encode-gif.py
```

El render usa 120 fotogramas de 960 × 330 a 20 FPS (50 ms por fotograma). La fase recorre un ciclo matemático completo en seis segundos; no se repite el último fotograma. La animación del laboratorio es más lenta por defecto y se puede ajustar.

Los PNG temporales se guardan en `.preview/frames/`, fuera de Git. Los archivos finales son `assets/profile.gif` y `assets/profile-static.png`. El exportador también genera una vista local del README en `.preview/readme.html`.

La combinación del perfil se define en `scripts/profile-preset.json`: Matriz ASCII, paleta esmeralda y texto clásico. Es también la combinación inicial de la página. Se desactiva el grano solo para esta exportación, para que el GIF sea más ligero; la página conserva el control de textura y todos sus estilos. El exportador recorre un ciclo completo independientemente del control de velocidad de la página. La grabación WebM del navegador se inicia y se detiene manualmente, y no garantiza un bucle exacto.

## Criterio de contenido

El perfil distingue el nombre visible **7Ferxxu** del usuario **7Ferxxo**. El tono es personal: aprender por gusto, probar ideas y compartir experimentos. La presentación evita frases de venta, listas de servicios, contadores, explicaciones técnicas y enlaces al código fuente. El banner mantiene el trazo bajo el nombre y la matriz verde, sin anotaciones técnicas.
