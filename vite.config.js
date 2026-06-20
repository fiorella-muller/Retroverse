import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANTE: "base" tiene que coincidir EXACTO con el nombre de tu
// repositorio en GitHub (entre barras). Si tu repo se llama "retroverse",
// dejalo como está. Si le pusiste otro nombre, cambialo acá.
export default defineConfig({
  base: '/retroverse/',
  plugins: [react()],
})
