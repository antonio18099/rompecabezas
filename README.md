# Rompecabezas deslizante

Juego web de rompecabezas deslizante 4×4, hecho con HTML, CSS y JavaScript sin dependencias.

## Probarlo en tu computador
1. Extrae el ZIP.
2. Abre `index.html` con Chrome, Edge o Firefox.
3. Pulsa **Mezclar fichas** y juega.

## Personalizar la imagen
- Dentro del juego, abre **Personalizar imagen**, pega un enlace directo y pulsa **Aplicar**.
- O reemplaza `puzzle-image.svg` por tu imagen. Si cambias el nombre, actualiza `IMAGE_URL` en `script.js`.
- Para que se vea en el enlace público, la imagen debe estar incluida en la carpeta publicada o tener una URL pública.

## Publicarlo gratis en Vercel
Opción sencilla:
1. Crea una cuenta en https://vercel.com/
2. Sube estos archivos a un repositorio nuevo en https://github.com/
3. En Vercel, pulsa **Add New → Project** y conecta ese repositorio.
4. Pulsa **Deploy**. No hace falta configurar build command ni framework; es un sitio estático.
5. Comparte la URL `https://...vercel.app` que Vercel genere.

Alternativa: en https://app.netlify.com/drop puedes arrastrar la carpeta extraída si esa opción está disponible en tu cuenta.

## Archivos
- `index.html`: estructura del juego.
- `styles.css`: diseño adaptable a móvil y PC.
- `script.js`: movimiento, mezcla resoluble, cronómetro, movimientos y victoria.
- `puzzle-image.svg`: imagen de ejemplo incluida.
