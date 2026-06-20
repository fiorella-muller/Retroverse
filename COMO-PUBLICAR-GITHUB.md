# Publicar RetroVerse en GitHub Pages

Estos pasos te dejan la app online en una URL del tipo:

```
https://TU-USUARIO.github.io/retroverse/
```

## 1. Creá el repositorio

1. Entrá a **https://github.com** con tu cuenta (o creá una, es gratis).
2. Arriba a la derecha, click en el **+** → **New repository**.
3. Como nombre poné **`retroverse`** (si le ponés otro nombre, después tenés que editar el archivo `vite.config.js`, te explico abajo dónde).
4. Dejalo en **Public**.
5. No marques ninguna casilla de "Add README" ni nada más. Click en **Create repository**.

## 2. Subí los archivos de este zip

En la página vacía que te queda del repositorio nuevo, GitHub te muestra un link que dice algo como **"uploading an existing file"**. Hacé click ahí.

Arrastrá **todo el contenido** del zip que te dejo (no el zip en sí, sino lo que está adentro: las carpetas `src`, `.github`, y los archivos `package.json`, `vite.config.js`, `index.html`, `.gitignore`). No subas la carpeta `dist`, no hace falta, se genera sola.

Abajo de todo, click en **Commit changes**.

## 3. Activá GitHub Pages

1. Dentro de tu repositorio, andá a la pestaña **Settings**.
2. En el menú de la izquierda, click en **Pages**.
3. Donde dice **"Build and deployment" → "Source"**, elegí **GitHub Actions** (no "Deploy from a branch").
4. Eso es todo, no hace falta tocar nada más acá.

## 4. Esperá a que se publique sola

Andá a la pestaña **Actions** de tu repositorio. Vas a ver que se disparó automáticamente un proceso llamado **"Publicar en GitHub Pages"** (lo armé para que se ejecute solo cada vez que subís cambios). Tarda entre 1 y 2 minutos.

Cuando termine y tenga un tilde verde ✓, volvé a **Settings → Pages**: ahí arriba te va a mostrar la URL pública, algo como:

```
https://tu-usuario.github.io/retroverse/
```

Esa es la URL que podés compartir.

## Si le pusiste otro nombre al repositorio (no "retroverse")

Tenés que editar una sola línea antes de subir los archivos. Abrí `vite.config.js` y donde dice:

```js
base: '/retroverse/',
```

Cambialo por el nombre real de tu repositorio, por ejemplo:

```js
base: '/mi-tienda-retro/',
```

Si te olvidás de este paso, la página carga pero sin estilos ni imágenes (un error muy común en GitHub Pages).

## Actualizar la app después

Cada vez que quieras cambiar algo, lo subís de nuevo a GitHub (ya sea arrastrando archivos desde la web, o con `git push` si trabajás desde tu computadora) y la página se actualiza sola en un par de minutos, sin que tengas que hacer nada más.
