import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Heart, MapPin, ShoppingBag, X, Plus, Check, ChevronLeft, ChevronRight, Store, Package, Tag, ListFilter } from "lucide-react";

/* =========================================================================
   RETROVERSE — Mercado de objetos vintage, coleccionables y tecnología retro
   Estética: ficha de catálogo de tienda de antigüedades / fichero de
   inventario de los 90s. Cada producto es una "ficha" sellada y archivada.
   ========================================================================= */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&family=Oswald:wght@400;500;600;700&display=swap');`;

// ---------------------------------------------------------------------------
// MODELO DE DATOS (ver modelo-datos.md para la especificación completa).
// sku = clave primaria. categoria y vendedor referencian catálogos propios.
// ---------------------------------------------------------------------------
const CATEGORIAS = [
  { id: "tecnologia", label: "Tecnología", icon: "📺" },
  { id: "audio", label: "Audio", icon: "🎧" },
  { id: "videojuegos", label: "Videojuegos", icon: "🕹️" },
  { id: "fotografia", label: "Fotografía", icon: "📷" },
  { id: "coleccionables", label: "Coleccionables", icon: "🪙" },
  { id: "hogar", label: "Hogar", icon: "📻" },
  { id: "moda", label: "Moda", icon: "👜" },
  { id: "papeleria", label: "Papelería", icon: "✉️" },
];

const PRODUCTOS_SEED = [
  {
    sku: "RV-04821",
    nombre: "Walkman Sony WM-EX1",
    descripcion:
      "Reproductor de cassette portátil japonés. Mecanismo original, motor estable, probado con cinta de prueba. Carcasa azul metálico sin rayones profundos.",
    categoria: "audio",
    decada: 1990,
    precio: 45000,
    moneda: "ARS",
    estado_conservacion: "excelente",
    funciona: true,
    stock: 1,
    vendedor: "Casa Antares",
    procedencia: "Comprado en Japón en 1991, colección familiar",
    autenticidad_verificada: true,
    etiquetas: ["walkman", "sony", "cassette", "japon"],
    envio_disponible: true,
    ubicacion: "Resistencia, Chaco",
    vistas: 312,
    favoritos: 28,
  },
  {
    sku: "RV-01193",
    nombre: "Consola Atari 2600 + 4 cartuchos",
    descripcion:
      "Consola completa con dos joysticks originales, fuente de alimentación y cuatro cartuchos: Pitfall, Combat, Pac-Man y River Raid. Encendido verificado.",
    categoria: "videojuegos",
    decada: 1980,
    precio: 130000,
    moneda: "ARS",
    estado_conservacion: "bueno",
    funciona: true,
    stock: 1,
    vendedor: "Bazar Continuum",
    procedencia: "",
    autenticidad_verificada: true,
    etiquetas: ["atari", "consola", "cartuchos", "retro gaming"],
    envio_disponible: true,
    ubicacion: "Corrientes, Corrientes",
    vistas: 891,
    favoritos: 76,
  },
  {
    sku: "RV-07710",
    nombre: "Cámara Polaroid SX-70",
    descripcion:
      "Cámara plegable de fuelle, cuero original sin grietas. Mecanismo de plegado funcional. Requiere film SX-70 (no incluido).",
    categoria: "fotografia",
    decada: 1970,
    precio: 89500,
    moneda: "ARS",
    estado_conservacion: "excelente",
    funciona: true,
    stock: 2,
    vendedor: "Fotografía del Ayer",
    procedencia: "Adquirida en remate de estudio fotográfico, 2019",
    autenticidad_verificada: true,
    etiquetas: ["polaroid", "camara", "instantanea"],
    envio_disponible: true,
    ubicacion: "Posadas, Misiones",
    vistas: 540,
    favoritos: 61,
  },
  {
    sku: "RV-02256",
    nombre: "Set de figuras Star Wars Kenner 1978",
    descripcion:
      "Lote de 6 figuras originales sin reproducción: Luke, Leia, Han, Chewbacca, Vader y Stormtrooper. Pintura con desgaste de juego propio de la época.",
    categoria: "coleccionables",
    decada: 1970,
    precio: 210000,
    moneda: "ARS",
    estado_conservacion: "aceptable",
    funciona: null,
    stock: 1,
    vendedor: "Galaxia Vintage",
    procedencia: "Colección personal desde la infancia del vendedor",
    autenticidad_verificada: false,
    etiquetas: ["star wars", "kenner", "figuras", "accion"],
    envio_disponible: true,
    ubicacion: "Formosa, Formosa",
    vistas: 1204,
    favoritos: 142,
  },
  {
    sku: "RV-09934",
    nombre: "Macintosh Classic II",
    descripcion:
      "Computadora todo-en-uno, enciende y bootea sistema 7. Pantalla con leve sombra en bordes (normal de CRT de la época), teclado y mouse incluidos.",
    categoria: "tecnologia",
    decada: 1990,
    precio: 320000,
    moneda: "ARS",
    estado_conservacion: "bueno",
    funciona: true,
    stock: 1,
    vendedor: "Casa Antares",
    procedencia: "",
    autenticidad_verificada: true,
    etiquetas: ["macintosh", "apple", "computadora", "vintage tech"],
    envio_disponible: false,
    ubicacion: "Resistencia, Chaco",
    vistas: 670,
    favoritos: 95,
  },
  {
    sku: "RV-03387",
    nombre: "Radio a Válvulas Spica",
    descripcion:
      "Radio de madera maciza, gabinete restaurado. Válvulas originales reemplazadas por técnico especializado. Sintoniza AM con ruido de fondo mínimo.",
    categoria: "hogar",
    decada: 1950,
    precio: 175000,
    moneda: "ARS",
    estado_conservacion: "excelente",
    funciona: true,
    stock: 1,
    vendedor: "Taller del Tiempo",
    procedencia: "Restaurada en taller propio, piezas documentadas",
    autenticidad_verificada: true,
    etiquetas: ["radio", "valvulas", "madera", "decoracion"],
    envio_disponible: false,
    ubicacion: "Resistencia, Chaco",
    vistas: 233,
    favoritos: 19,
  },
  {
    sku: "RV-05512",
    nombre: "Game Boy DMG-01 Gris",
    descripcion:
      "Game Boy original con Tetris incluido. Pantalla sin manchas de fuga de líquido, botones con buen tacto. Pila de respaldo nueva.",
    categoria: "videojuegos",
    decada: 1990,
    precio: 68000,
    moneda: "ARS",
    estado_conservacion: "bueno",
    funciona: true,
    stock: 3,
    vendedor: "Bazar Continuum",
    procedencia: "",
    autenticidad_verificada: true,
    etiquetas: ["gameboy", "nintendo", "portatil", "tetris"],
    envio_disponible: true,
    ubicacion: "Corrientes, Corrientes",
    vistas: 980,
    favoritos: 110,
  },
  {
    sku: "RV-06658",
    nombre: "Cartera de Cuero Art Déco",
    descripcion:
      "Cartera de mano con broche de baquelita, forro de raso original con desgaste leve. Pieza de colección textil, no apta para uso diario.",
    categoria: "moda",
    decada: 1950,
    precio: 54000,
    moneda: "ARS",
    estado_conservacion: "aceptable",
    funciona: null,
    stock: 1,
    vendedor: "Ropero de Época",
    procedencia: "Herencia familiar, documentada con foto de época",
    autenticidad_verificada: false,
    etiquetas: ["cartera", "cuero", "art deco", "accesorio"],
    envio_disponible: true,
    ubicacion: "Posadas, Misiones",
    vistas: 145,
    favoritos: 22,
  },
  {
    sku: "RV-08823",
    nombre: "Máquina de Escribir Olivetti Lettera 32",
    descripcion:
      "Máquina de escribir mecánica color verde menta, diseñada por Ettore Sottsass. Cinta nueva instalada, todas las teclas responden correctamente.",
    categoria: "papeleria",
    decada: 1960,
    precio: 98000,
    moneda: "ARS",
    estado_conservacion: "excelente",
    funciona: true,
    stock: 1,
    vendedor: "Taller del Tiempo",
    procedencia: "",
    autenticidad_verificada: true,
    etiquetas: ["olivetti", "escribir", "diseño italiano"],
    envio_disponible: true,
    ubicacion: "Resistencia, Chaco",
    vistas: 421,
    favoritos: 58,
  },
];

const ESTADOS_LABEL = {
  nuevo_en_caja: "Nuevo en caja",
  excelente: "Excelente",
  bueno: "Buen estado",
  aceptable: "Aceptable",
  para_restaurar: "Para restaurar",
};

const ESTADO_COLOR = {
  nuevo_en_caja: "var(--phosphor)",
  excelente: "var(--phosphor)",
  bueno: "var(--brass)",
  aceptable: "var(--rust)",
  para_restaurar: "var(--rust)",
};

function formatPrecio(precio, moneda) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: moneda, maximumFractionDigits: 0 }).format(precio);
}

function genSku(existing) {
  let n;
  do {
    n = String(Math.floor(Math.random() * 90000) + 10000);
  } while (existing.has(`RV-${n}`));
  return `RV-${n}`;
}

/* -------------------------------------------------------------------------
   SELLO DE AUTENTICIDAD — el elemento firma de la marca: un sello de goma
   estampado, ligeramente rotado, como en una libreta de inventario real.
   ------------------------------------------------------------------------- */
function SelloAutenticidad({ small }) {
  return (
    <div
      className={`stamp ${small ? "stamp-sm" : ""}`}
      aria-label="Autenticidad verificada por RetroVerse"
    >
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path id="stampCircleTop" d="M 60 12 A 48 48 0 0 1 108 60" fill="none" />
        <text fontSize="9.5" letterSpacing="2.5" fill="currentColor" fontFamily="'Special Elite', monospace">
          <textPath href="#stampCircleTop" startOffset="2">
            RETROVERSE · AUTÉNTICO
          </textPath>
        </text>
        <text x="60" y="68" textAnchor="middle" fontSize="22" fill="currentColor" fontFamily="'Oswald', sans-serif" fontWeight="700">
          OK
        </text>
        <path d="M 12 60 A 48 48 0 0 1 60 108" fill="none" id="stampCircleBottom" />
        <text fontSize="9.5" letterSpacing="2" fill="currentColor" fontFamily="'Special Elite', monospace">
          <textPath href="#stampCircleBottom" startOffset="2">
            VERIFICADO
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------
   CONTADOR ESTILO CINTA — mini contador mecánico para mostrar resultados,
   evocando el contador de cinta de un VHS / cassette.
   ------------------------------------------------------------------------- */
function ContadorCinta({ value, digits = 3 }) {
  const str = String(value).padStart(digits, "0").slice(-digits);
  return (
    <span className="tape-counter">
      {str.split("").map((d, i) => (
        <span key={i} className="tape-digit">
          {d}
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------
   FICHA DE PRODUCTO (tarjeta de catálogo)
   ------------------------------------------------------------------------- */
function FichaProducto({ producto, onAbrir, esFavorito, onToggleFavorito }) {
  const cat = CATEGORIAS.find((c) => c.id === producto.categoria);
  return (
    <article className="card-ficha" onClick={() => onAbrir(producto)}>
      <div className="card-ficha-top">
        <span className="sku-tag">{producto.sku}</span>
        <button
          className={`fav-btn ${esFavorito ? "fav-on" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito(producto.sku);
          }}
          aria-label={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <Heart size={16} fill={esFavorito ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="card-ficha-art" style={{ "--seed": producto.sku.length }}>
        <span className="card-ficha-icon">{cat?.icon}</span>
        {producto.autenticidad_verificada && (
          <div className="card-ficha-stamp">
            <SelloAutenticidad small />
          </div>
        )}
      </div>

      <h3 className="card-ficha-nombre">{producto.nombre}</h3>

      <div className="card-ficha-meta">
        <span className="meta-decada">DÉC. {producto.decada}s</span>
        <span className="meta-dot">•</span>
        <span className="meta-estado" style={{ color: ESTADO_COLOR[producto.estado_conservacion] }}>
          {ESTADOS_LABEL[producto.estado_conservacion]}
        </span>
      </div>

      <div className="card-ficha-foot">
        <span className="card-ficha-precio">{formatPrecio(producto.precio, producto.moneda)}</span>
        <span className="card-ficha-stock">{producto.stock > 0 ? `${producto.stock} disp.` : "Agotado"}</span>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------
   FICHA DETALLE (modal)
   ------------------------------------------------------------------------- */
function FichaDetalle({ producto, onCerrar, esFavorito, onToggleFavorito, onAgregarCarrito }) {
  if (!producto) return null;
  const cat = CATEGORIAS.find((c) => c.id === producto.categoria);
  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-ficha" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCerrar} aria-label="Cerrar ficha">
          <X size={20} />
        </button>

        <div className="modal-grid">
          <div className="modal-art">
            <span className="modal-art-icon">{cat?.icon}</span>
            {producto.autenticidad_verificada && (
              <div className="modal-stamp">
                <SelloAutenticidad />
              </div>
            )}
          </div>

          <div className="modal-info">
            <div className="modal-sku-row">
              <span className="sku-tag">{producto.sku}</span>
              <span className="modal-cat">{cat?.label}</span>
            </div>

            <h2 className="modal-nombre">{producto.nombre}</h2>

            <div className="modal-tags">
              {producto.etiquetas.map((t) => (
                <span key={t} className="tag-chip">#{t}</span>
              ))}
            </div>

            <p className="modal-desc">{producto.descripcion}</p>

            <dl className="modal-datos">
              <div className="modal-dato">
                <dt>Década</dt>
                <dd>{producto.decada}s</dd>
              </div>
              <div className="modal-dato">
                <dt>Estado</dt>
                <dd style={{ color: ESTADO_COLOR[producto.estado_conservacion] }}>
                  {ESTADOS_LABEL[producto.estado_conservacion]}
                </dd>
              </div>
              {producto.funciona !== null && (
                <div className="modal-dato">
                  <dt>Funcional</dt>
                  <dd>{producto.funciona ? "Sí, probado" : "No / sin probar"}</dd>
                </div>
              )}
              <div className="modal-dato">
                <dt>Stock</dt>
                <dd>{producto.stock} unidad{producto.stock !== 1 ? "es" : ""}</dd>
              </div>
              <div className="modal-dato">
                <dt>Vendedor</dt>
                <dd>{producto.vendedor}</dd>
              </div>
              <div className="modal-dato">
                <dt><MapPin size={11} style={{ display: "inline", marginRight: 3 }} />Ubicación</dt>
                <dd>{producto.ubicacion}</dd>
              </div>
              <div className="modal-dato">
                <dt>Envío</dt>
                <dd>{producto.envio_disponible ? "Disponible" : "Solo retiro en persona"}</dd>
              </div>
              {producto.procedencia && (
                <div className="modal-dato modal-dato-wide">
                  <dt>Procedencia</dt>
                  <dd>{producto.procedencia}</dd>
                </div>
              )}
            </dl>

            <div className="modal-footer">
              <div>
                <span className="modal-precio">{formatPrecio(producto.precio, producto.moneda)}</span>
                <span className="modal-vistas">{producto.vistas} vistas · {producto.favoritos} guardados</span>
              </div>
              <div className="modal-actions">
                <button
                  className={`btn-outline ${esFavorito ? "fav-on" : ""}`}
                  onClick={() => onToggleFavorito(producto.sku)}
                >
                  <Heart size={16} fill={esFavorito ? "currentColor" : "none"} /> Guardar
                </button>
                <button
                  className="btn-primary"
                  disabled={producto.stock === 0}
                  onClick={() => onAgregarCarrito(producto)}
                >
                  <ShoppingBag size={16} /> {producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   FORMULARIO "VENDER" — publica un nuevo registro (alta de ficha)
   ------------------------------------------------------------------------- */
function FormularioVender({ onCerrar, onPublicar, existingSkus }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "tecnologia",
    decada: 1980,
    precio: "",
    estado_conservacion: "bueno",
    funciona: "si",
    stock: 1,
    vendedor: "",
    ubicacion: "",
    envio_disponible: true,
    etiquetas: "",
  });
  const [enviado, setEnviado] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.nombre || !form.descripcion || !form.precio || !form.vendedor || !form.ubicacion) return;
    const nuevo = {
      sku: genSku(existingSkus),
      nombre: form.nombre,
      descripcion: form.descripcion,
      categoria: form.categoria,
      decada: Number(form.decada),
      precio: Number(form.precio),
      moneda: "ARS",
      estado_conservacion: form.estado_conservacion,
      funciona: form.funciona === "na" ? null : form.funciona === "si",
      stock: Number(form.stock),
      vendedor: form.vendedor,
      procedencia: "",
      autenticidad_verificada: false,
      etiquetas: form.etiquetas
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      envio_disponible: form.envio_disponible,
      ubicacion: form.ubicacion,
      vistas: 0,
      favoritos: 0,
    };
    onPublicar(nuevo);
    setEnviado(true);
    setTimeout(() => {
      onCerrar();
    }, 1400);
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-ficha modal-form" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCerrar} aria-label="Cerrar formulario">
          <X size={20} />
        </button>

        {enviado ? (
          <div className="form-success">
            <Check size={40} />
            <h3>Ficha archivada</h3>
            <p>Tu objeto fue dado de alta en el catálogo de RetroVerse.</p>
          </div>
        ) : (
          <>
            <div className="form-header">
              <Package size={18} />
              <h2>Nueva ficha de inventario</h2>
            </div>
            <p className="form-sub">Completá los datos del objeto. Quedará archivado con un SKU único asignado automáticamente.</p>

            <form onSubmit={submit} className="form-grid">
              <label className="field field-wide">
                <span>Nombre del objeto *</span>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                  placeholder="Ej. Tocadiscos Winco modelo W..."
                  required
                />
              </label>

              <label className="field field-wide">
                <span>Descripción *</span>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => update("descripcion", e.target.value)}
                  placeholder="Estado, historia, detalles relevantes para un coleccionista..."
                  rows={3}
                  required
                />
              </label>

              <label className="field">
                <span>Categoría</span>
                <select value={form.categoria} onChange={(e) => update("categoria", e.target.value)}>
                  {CATEGORIAS.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Década</span>
                <select value={form.decada} onChange={(e) => update("decada", e.target.value)}>
                  {[1950, 1960, 1970, 1980, 1990, 2000].map((d) => (
                    <option key={d} value={d}>{d}s</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Precio (ARS) *</span>
                <input
                  type="number"
                  min="1"
                  value={form.precio}
                  onChange={(e) => update("precio", e.target.value)}
                  placeholder="0"
                  required
                />
              </label>

              <label className="field">
                <span>Stock</span>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => update("stock", e.target.value)}
                />
              </label>

              <label className="field">
                <span>Estado de conservación</span>
                <select value={form.estado_conservacion} onChange={(e) => update("estado_conservacion", e.target.value)}>
                  {Object.entries(ESTADOS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>¿Funciona?</span>
                <select value={form.funciona} onChange={(e) => update("funciona", e.target.value)}>
                  <option value="si">Sí, probado</option>
                  <option value="no">No / sin probar</option>
                  <option value="na">No aplica</option>
                </select>
              </label>

              <label className="field">
                <span>Tu nombre / tienda *</span>
                <input
                  type="text"
                  value={form.vendedor}
                  onChange={(e) => update("vendedor", e.target.value)}
                  placeholder="Ej. Bazar del Recuerdo"
                  required
                />
              </label>

              <label className="field">
                <span>Ubicación *</span>
                <input
                  type="text"
                  value={form.ubicacion}
                  onChange={(e) => update("ubicacion", e.target.value)}
                  placeholder="Ciudad, Provincia"
                  required
                />
              </label>

              <label className="field field-wide">
                <span>Etiquetas (separadas por coma)</span>
                <input
                  type="text"
                  value={form.etiquetas}
                  onChange={(e) => update("etiquetas", e.target.value)}
                  placeholder="walkman, sony, cassette"
                />
              </label>

              <label className="field-check field-wide">
                <input
                  type="checkbox"
                  checked={form.envio_disponible}
                  onChange={(e) => update("envio_disponible", e.target.checked)}
                />
                <span>Ofrezco envío</span>
              </label>

              <button type="submit" className="btn-primary field-wide">
                <Plus size={16} /> Archivar ficha
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   CARRITO
   ------------------------------------------------------------------------- */
function Carrito({ items, onCerrar, onQuitar, onVaciar }) {
  const total = items.reduce((acc, p) => acc + p.precio, 0);
  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-ficha modal-cart" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCerrar} aria-label="Cerrar carrito">
          <X size={20} />
        </button>
        <div className="form-header">
          <ShoppingBag size={18} />
          <h2>Tu carrito</h2>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Todavía no agregaste objetos. El fichero está vacío.</p>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((p, i) => (
                <li key={`${p.sku}-${i}`} className="cart-item">
                  <span className="sku-tag sku-tag-sm">{p.sku}</span>
                  <span className="cart-item-nombre">{p.nombre}</span>
                  <span className="cart-item-precio">{formatPrecio(p.precio, p.moneda)}</span>
                  <button className="cart-item-quitar" onClick={() => onQuitar(i)} aria-label="Quitar">
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-total-row">
              <span>Total</span>
              <span className="cart-total">{formatPrecio(total, "ARS")}</span>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={onVaciar}>Vaciar fichero</button>
              <button className="btn-primary">Finalizar compra</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   APP PRINCIPAL
   ------------------------------------------------------------------------- */
export default function RetroVerseApp() {
  const [productos, setProductos] = useState(PRODUCTOS_SEED);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [orden, setOrden] = useState("recientes");
  const [favoritos, setFavoritos] = useState(new Set());
  const [carrito, setCarrito] = useState([]);
  const [productoAbierto, setProductoAbierto] = useState(null);
  const [mostrarVender, setMostrarVender] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const existingSkus = useMemo(() => new Set(productos.map((p) => p.sku)), [productos]);

  const filtrados = useMemo(() => {
    let list = [...productos];
    if (categoriaActiva !== "todas") {
      list = list.filter((p) => p.categoria === categoriaActiva);
    }
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.etiquetas.some((t) => t.includes(q)) ||
          p.vendedor.toLowerCase().includes(q)
      );
    }
    if (orden === "precio_asc") list.sort((a, b) => a.precio - b.precio);
    else if (orden === "precio_desc") list.sort((a, b) => b.precio - a.precio);
    else if (orden === "decada") list.sort((a, b) => a.decada - b.decada);
    else if (orden === "favoritos") list.sort((a, b) => b.favoritos - a.favoritos);
    return list;
  }, [productos, categoriaActiva, busqueda, orden]);

  function toggleFavorito(sku) {
    setFavoritos((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  }

  function agregarCarrito(producto) {
    setCarrito((prev) => [...prev, producto]);
    setProductoAbierto(null);
    setMostrarCarrito(true);
  }

  function publicarProducto(nuevo) {
    setProductos((prev) => [nuevo, ...prev]);
  }

  return (
    <div className="rv-root">
      <style>{`
        ${FONT_IMPORT}

        .rv-root {
          --paper: #F5F0E3;
          --plastic: #E8E0D0;
          --plastic-dark: #D8CDB4;
          --ink: #2B2620;
          --ink-soft: #5A4F40;
          --rust: #8B3A2F;
          --phosphor: #3F6B4A;
          --phosphor-bright: #4F8A5C;
          --brass: #A8823E;
          --line: #C8BB9E;

          background: var(--plastic);
          background-image:
            repeating-linear-gradient(0deg, rgba(0,0,0,0.018) 0px, rgba(0,0,0,0.018) 1px, transparent 1px, transparent 3px);
          color: var(--ink);
          font-family: 'Courier Prime', monospace;
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        .rv-root * { box-sizing: border-box; }

        /* ---------- HEADER ---------- */
        .rv-header {
          background: var(--ink);
          color: var(--paper);
          padding: 18px 20px 16px;
          position: sticky;
          top: 0;
          z-index: 30;
          border-bottom: 4px solid var(--rust);
        }
        .rv-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1100px;
          margin: 0 auto;
        }
        .rv-logo {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .rv-logo-mark {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 26px;
          letter-spacing: 0.5px;
          color: var(--paper);
        }
        .rv-logo-mark span { color: var(--phosphor-bright); }
        .rv-logo-sub {
          font-family: 'Special Elite', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          color: #B8AE9A;
          text-transform: uppercase;
        }
        .rv-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .rv-icon-btn {
          background: transparent;
          border: 1.5px solid #564C3D;
          color: var(--paper);
          width: 38px;
          height: 38px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: border-color 0.15s, color 0.15s;
        }
        .rv-icon-btn:hover { border-color: var(--phosphor-bright); color: var(--phosphor-bright); }
        .cart-badge {
          position: absolute;
          top: -7px;
          right: -7px;
          background: var(--rust);
          color: var(--paper);
          font-size: 10px;
          font-family: 'Oswald', sans-serif;
          font-weight: 600;
          min-width: 17px;
          height: 17px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
        }
        .rv-sell-btn {
          background: var(--phosphor);
          color: var(--paper);
          border: none;
          padding: 0 16px;
          height: 38px;
          border-radius: 3px;
          font-family: 'Oswald', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .rv-sell-btn:hover { background: var(--phosphor-bright); }

        /* ---------- SEARCH BAR ---------- */
        .rv-searchbar {
          max-width: 1100px;
          margin: 14px auto 0;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .rv-search-input-wrap {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .rv-search-input-wrap svg { position: absolute; left: 12px; color: #8A8068; pointer-events: none; }
        .rv-search-input {
          width: 100%;
          background: #332C22;
          border: 1.5px solid #564C3D;
          color: var(--paper);
          font-family: 'Courier Prime', monospace;
          font-size: 14px;
          padding: 10px 12px 10px 36px;
          border-radius: 3px;
          outline: none;
        }
        .rv-search-input::placeholder { color: #8A8068; }
        .rv-search-input:focus { border-color: var(--phosphor-bright); }

        .rv-sort-select {
          background: #332C22;
          border: 1.5px solid #564C3D;
          color: var(--paper);
          font-family: 'Courier Prime', monospace;
          font-size: 13px;
          padding: 10px 10px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }

        /* ---------- CATEGORY RAIL ---------- */
        .rv-cat-rail {
          max-width: 1100px;
          margin: 14px auto 0;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: thin;
        }
        .rv-cat-chip {
          flex-shrink: 0;
          background: transparent;
          border: 1.5px solid #564C3D;
          color: #C8BFA9;
          font-family: 'Oswald', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          padding: 7px 13px;
          border-radius: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .rv-cat-chip:hover { border-color: var(--phosphor-bright); color: var(--paper); }
        .rv-cat-chip.active {
          background: var(--phosphor);
          border-color: var(--phosphor);
          color: var(--paper);
        }

        /* ---------- MAIN ---------- */
        .rv-main { max-width: 1100px; margin: 0 auto; padding: 22px 20px 60px; }

        .rv-results-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 2px dashed var(--line);
        }
        .rv-results-label {
          font-family: 'Special Elite', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          color: var(--ink-soft);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tape-counter {
          display: inline-flex;
          background: var(--ink);
          border-radius: 2px;
          padding: 2px 4px;
          gap: 1px;
        }
        .tape-digit {
          font-family: 'Oswald', sans-serif;
          font-weight: 600;
          font-size: 12px;
          color: var(--phosphor-bright);
          background: #1C1812;
          padding: 1px 3px;
          min-width: 12px;
          text-align: center;
        }

        /* ---------- GRID & CARD ---------- */
        .rv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .card-ficha {
          background: var(--paper);
          border: 1.5px solid var(--line);
          border-radius: 4px;
          padding: 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
          box-shadow: 2px 2px 0 rgba(43,38,32,0.06);
        }
        .card-ficha:hover {
          transform: translateY(-3px);
          border-color: var(--phosphor);
          box-shadow: 3px 4px 0 rgba(43,38,32,0.12);
        }
        .card-ficha-top { display: flex; align-items: center; justify-content: space-between; }
        .sku-tag {
          font-family: 'Special Elite', monospace;
          font-size: 10.5px;
          letter-spacing: 0.5px;
          color: var(--ink-soft);
          background: var(--plastic);
          padding: 2px 6px;
          border-radius: 2px;
          border: 1px solid var(--line);
        }
        .sku-tag-sm { font-size: 9.5px; padding: 1px 5px; }
        .fav-btn {
          background: transparent;
          border: none;
          color: #A89A7C;
          cursor: pointer;
          padding: 2px;
          display: flex;
          transition: color 0.15s, transform 0.15s;
        }
        .fav-btn:hover { transform: scale(1.15); }
        .fav-btn.fav-on { color: var(--rust); }

        .card-ficha-art {
          background: linear-gradient(135deg, var(--plastic) 0%, var(--plastic-dark) 100%);
          border: 1px dashed var(--line);
          border-radius: 3px;
          height: 108px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .card-ficha-icon { font-size: 42px; filter: saturate(0.75); opacity: 0.88; }
        .card-ficha-stamp {
          position: absolute;
          bottom: -10px;
          right: -8px;
          width: 46px;
          height: 46px;
          color: var(--rust);
          opacity: 0.88;
          transform: rotate(-12deg);
        }

        .card-ficha-nombre {
          font-family: 'Oswald', sans-serif;
          font-weight: 600;
          font-size: 14.5px;
          line-height: 1.25;
          color: var(--ink);
          margin: 0;
          min-height: 36px;
        }

        .card-ficha-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--ink-soft);
          font-family: 'Courier Prime', monospace;
        }
        .meta-decada { letter-spacing: 0.4px; }
        .meta-dot { color: var(--line); }
        .meta-estado { font-weight: 700; }

        .card-ficha-foot {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding-top: 6px;
          border-top: 1px solid var(--line);
        }
        .card-ficha-precio {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: var(--ink);
        }
        .card-ficha-stock {
          font-size: 10.5px;
          color: var(--ink-soft);
        }

        .rv-empty {
          text-align: center;
          padding: 60px 20px;
          color: var(--ink-soft);
          font-family: 'Special Elite', monospace;
        }

        /* ---------- MODAL ---------- */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20,17,12,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal-ficha {
          background: var(--paper);
          border-radius: 6px;
          max-width: 760px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          position: relative;
          padding: 26px;
          border: 1px solid var(--line);
        }
        .modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: var(--plastic);
          border: 1px solid var(--line);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--ink);
          z-index: 5;
        }
        .modal-close:hover { background: var(--rust); color: var(--paper); border-color: var(--rust); }

        .modal-grid { display: grid; grid-template-columns: 260px 1fr; gap: 24px; }
        @media (max-width: 640px) { .modal-grid { grid-template-columns: 1fr; } }

        .modal-art {
          background: linear-gradient(135deg, var(--plastic) 0%, var(--plastic-dark) 100%);
          border: 1px dashed var(--line);
          border-radius: 4px;
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .modal-art-icon { font-size: 90px; opacity: 0.88; }
        .modal-stamp {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 80px;
          height: 80px;
          color: var(--rust);
          opacity: 0.9;
          transform: rotate(-10deg);
        }

        .modal-sku-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .modal-cat {
          font-family: 'Oswald', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: var(--phosphor);
        }
        .modal-nombre {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 23px;
          margin: 0 0 10px;
          color: var(--ink);
        }
        .modal-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .tag-chip {
          font-size: 11px;
          background: var(--plastic);
          border: 1px solid var(--line);
          padding: 2px 8px;
          border-radius: 10px;
          color: var(--ink-soft);
        }
        .modal-desc {
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--ink-soft);
          margin: 0 0 16px;
        }

        .modal-datos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 18px;
          margin: 0 0 18px;
          padding: 14px;
          background: var(--plastic);
          border-radius: 4px;
          border: 1px solid var(--line);
        }
        .modal-dato dt {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--ink-soft);
          font-family: 'Special Elite', monospace;
          margin-bottom: 2px;
        }
        .modal-dato dd { margin: 0; font-size: 13px; font-weight: 600; color: var(--ink); }
        .modal-dato-wide { grid-column: 1 / -1; }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          padding-top: 14px;
          border-top: 2px dashed var(--line);
        }
        .modal-precio {
          display: block;
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: var(--ink);
        }
        .modal-vistas { font-size: 11px; color: var(--ink-soft); }
        .modal-actions { display: flex; gap: 10px; }

        .btn-primary, .btn-outline {
          font-family: 'Oswald', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.3px;
          padding: 10px 16px;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          justify-content: center;
          border: 1.5px solid transparent;
          transition: all 0.15s;
        }
        .btn-primary { background: var(--rust); color: var(--paper); }
        .btn-primary:hover { background: #722e25; }
        .btn-primary:disabled { background: #B8AE9A; cursor: not-allowed; }
        .btn-outline { background: transparent; border-color: var(--ink); color: var(--ink); }
        .btn-outline:hover { border-color: var(--rust); color: var(--rust); }
        .btn-outline.fav-on { border-color: var(--rust); color: var(--rust); background: rgba(139,58,47,0.08); }

        /* ---------- STAMP SVG ---------- */
        .stamp { width: 100%; height: 100%; }
        .stamp-sm { width: 100%; height: 100%; }

        /* ---------- FORM ---------- */
        .modal-form { max-width: 600px; }
        .form-header { display: flex; align-items: center; gap: 9px; color: var(--phosphor); margin-bottom: 4px; }
        .form-header h2 { font-family: 'Oswald', sans-serif; font-size: 19px; margin: 0; color: var(--ink); }
        .form-sub { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 18px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 14px; }
        .field { display: flex; flex-direction: column; gap: 5px; font-size: 12px; color: var(--ink-soft); }
        .field-wide { grid-column: 1 / -1; }
        .field input, .field select, .field textarea {
          font-family: 'Courier Prime', monospace;
          background: var(--plastic);
          border: 1.5px solid var(--line);
          border-radius: 3px;
          padding: 8px 10px;
          font-size: 13px;
          color: var(--ink);
          outline: none;
          resize: vertical;
        }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--phosphor); }
        .field span { font-family: 'Oswald', sans-serif; font-weight: 500; }

        .field-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink); font-family: 'Oswald', sans-serif; }
        .field-check input { width: 16px; height: 16px; accent-color: var(--phosphor); }

        .form-success { text-align: center; padding: 30px 10px; color: var(--phosphor); }
        .form-success h3 { font-family: 'Oswald', sans-serif; margin: 10px 0 4px; color: var(--ink); }
        .form-success p { color: var(--ink-soft); font-size: 13px; margin: 0; }

        /* ---------- CART ---------- */
        .modal-cart { max-width: 480px; }
        .cart-empty { color: var(--ink-soft); font-size: 13px; padding: 20px 0; }
        .cart-list { list-style: none; margin: 14px 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--plastic);
          border: 1px solid var(--line);
          border-radius: 3px;
          padding: 7px 9px;
        }
        .cart-item-nombre { flex: 1; font-size: 12.5px; }
        .cart-item-precio { font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 12.5px; }
        .cart-item-quitar { background: none; border: none; color: var(--ink-soft); cursor: pointer; display: flex; }
        .cart-item-quitar:hover { color: var(--rust); }
        .cart-total-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-top: 2px dashed var(--line); font-family: 'Oswald', sans-serif; font-weight: 600;
        }
        .cart-total { font-size: 19px; }

        /* ---------- FOOTER ---------- */
        .rv-footer {
          border-top: 4px solid var(--ink);
          background: var(--plastic-dark);
          padding: 22px 20px;
          margin-top: 40px;
          text-align: center;
        }
        .rv-footer-text {
          font-family: 'Special Elite', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          color: var(--ink-soft);
        }
      `}</style>

      {/* ---------- HEADER ---------- */}
      <header className="rv-header">
        <div className="rv-header-top">
          <div className="rv-logo">
            <span className="rv-logo-mark">RETRO<span>VERSE</span></span>
          </div>
          <div className="rv-header-actions">
            <button className="rv-icon-btn" onClick={() => setMostrarCarrito(true)} aria-label="Ver carrito">
              <ShoppingBag size={17} />
              {carrito.length > 0 && <span className="cart-badge">{carrito.length}</span>}
            </button>
            <button className="rv-sell-btn" onClick={() => setMostrarVender(true)}>
              <Store size={15} /> Vender
            </button>
          </div>
        </div>
        <div className="rv-logo-sub" style={{ maxWidth: 1100, margin: "2px auto 0" }}>
          Catálogo de objetos vintage · tecnología y coleccionables
        </div>

        <div className="rv-searchbar">
          <div className="rv-search-input-wrap">
            <Search size={15} />
            <input
              className="rv-search-input"
              placeholder="Buscar por nombre, SKU, etiqueta o tienda..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <select className="rv-sort-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="recientes">Más recientes</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="decada">Década</option>
            <option value="favoritos">Más guardados</option>
          </select>
        </div>

        <div className="rv-cat-rail">
          <button
            className={`rv-cat-chip ${categoriaActiva === "todas" ? "active" : ""}`}
            onClick={() => setCategoriaActiva("todas")}
          >
            <ListFilter size={13} /> Todas
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              className={`rv-cat-chip ${categoriaActiva === c.id ? "active" : ""}`}
              onClick={() => setCategoriaActiva(c.id)}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* ---------- MAIN ---------- */}
      <main className="rv-main">
        <div className="rv-results-row">
          <span className="rv-results-label">
            Fichas encontradas <ContadorCinta value={filtrados.length} />
          </span>
          {categoriaActiva !== "todas" && (
            <button className="rv-cat-chip" onClick={() => setCategoriaActiva("todas")} style={{ borderColor: "var(--rust)", color: "var(--rust)" }}>
              <X size={12} /> Quitar filtro
            </button>
          )}
        </div>

        {filtrados.length === 0 ? (
          <div className="rv-empty">
            No hay fichas que coincidan con tu búsqueda.<br />Probá con otro término o categoría.
          </div>
        ) : (
          <div className="rv-grid">
            {filtrados.map((p) => (
              <FichaProducto
                key={p.sku}
                producto={p}
                onAbrir={setProductoAbierto}
                esFavorito={favoritos.has(p.sku)}
                onToggleFavorito={toggleFavorito}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="rv-footer">
        <div className="rv-footer-text">RETROVERSE · ARCHIVO DE OBJETOS DEL TIEMPO · EST. 2026</div>
      </footer>

      {/* ---------- MODALES ---------- */}
      {productoAbierto && (
        <FichaDetalle
          producto={productoAbierto}
          onCerrar={() => setProductoAbierto(null)}
          esFavorito={favoritos.has(productoAbierto.sku)}
          onToggleFavorito={toggleFavorito}
          onAgregarCarrito={agregarCarrito}
        />
      )}

      {mostrarVender && (
        <FormularioVender
          onCerrar={() => setMostrarVender(false)}
          onPublicar={publicarProducto}
          existingSkus={existingSkus}
        />
      )}

      {mostrarCarrito && (
        <Carrito
          items={carrito}
          onCerrar={() => setMostrarCarrito(false)}
          onQuitar={(i) => setCarrito((prev) => prev.filter((_, idx) => idx !== i))}
          onVaciar={() => setCarrito([])}
        />
      )}
    </div>
  );
}
