# 💚 FinanzasApp – Sistema Web de Finanzas Personales

Aplicación web completa para gestión de finanzas personales. HTML + CSS + JavaScript puro, con Google Sheets como base de datos mediante Google Apps Script. Lista para GitHub Pages.

---

## 🗂️ Estructura del proyecto

```
finanzas/
├── index.html                   ← Página de login
├── assets/
│   └── img                      ← images 
├── css/
│   └── styles.css               ← Design system completo
├── js/
│   ├── app.js                   ← Núcleo: API, auth, utilidades
│   └── layout.js                ← Sidebar y topbar compartidos
├── pages/
│   ├── dashboard.html           ← Dashboard con gráficos interactivos
│   ├── ingresos.html            ← Módulo de ingresos
│   ├── gastos.html              ← Módulo de gastos
│   ├── ahorros.html             ← Módulo de ahorros
│   ├── categorias-ingresos.html ← Gestión de categorías de ingresos
│   └── categorias-gastos.html  ← Gestión de categorías y subcategorías de gastos
└── Code.gs                      ← Google Apps Script (backend)
```

---

## ⚙️ Configuración – Paso a paso

### PASO 1 – Crear el Google Apps Script

1. Ve a [script.google.com](https://script.google.com) e inicia sesión.
2. Crea un **nuevo proyecto** (botón `+`).
3. **Borra** el código por defecto y **pega** todo el contenido del archivo `Code.gs`.
4. Guarda el proyecto con un nombre (ej: `ValoraGo Backend`).
5. En el menú, ve a **Ejecutar → Ejecutar función** y elige `initSheets`. Acepta los permisos.
   - Esto creará automáticamente todas las hojas y categorías por defecto en tu Google Sheet activa.

> ⚠️ El script debe estar vinculado a una **Google Spreadsheet**. Ve a **Extensiones → Apps Script** desde una hoja de cálculo de Google, o usa el menú Recursos → Proyecto de Google.

### PASO 2 – Desplegar como Web App

1. En el editor de Apps Script, ve a **Implementar → Nueva implementación**.
2. Selecciona tipo: **Aplicación web**.
3. Configura:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier persona (Anyone)
4. Haz clic en **Implementar**.
5. **Copia la URL** que aparece (algo como `https://script.google.com/macros/s/AKf.../exec`).

### PASO 3 – Conectar con la app

1. Abre el archivo `js/app.js`.
2. Busca esta línea (aproximadamente línea 7):
   ```js
   API_URL: 'https://script.google.com/macros/s/TU_SCRIPT_ID_AQUI/exec',
   ```
3. Reemplaza `TU_SCRIPT_ID_AQUI` con la URL completa que copiaste.

### PASO 4 – Publicar en GitHub Pages

1. Sube todos los archivos (excepto `Code.gs`) a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, selecciona `main` (o `master`) y la carpeta `/ (root)`.
4. Guarda. En unos minutos tu app estará en `https://tuusuario.github.io/turepositorio/`.

---

## 🎯 Funcionalidades incluidas

| Módulo             | Funcionalidades |
|--------------------|----------------|
| **Autenticación**  | Login, registro, sesión persistente, cerrar sesión |
| **Ingresos**       | CRUD completo, categorías, filtros, KPIs |
| **Gastos**         | CRUD completo, categorías + subcategorías, filtros, KPIs |
| **Ahorros**        | CRUD completo, objetivos, % ahorro vs ingresos |
| **Dashboard**      | 5 gráficos interactivos, KPIs, análisis histórico, filtros |
| **Categorías**     | Crear, eliminar categorías personalizadas (ingresos y gastos) |

## 🎨 Diseño

- Tema claro / oscuro con persistencia
- Totalmente responsivo (móvil, tablet, desktop)
- Sidebar con navegación
- Modales, toasts, tablas paginables

---

## 🔒 Notas de seguridad

> Esta implementación usa contraseñas almacenadas en texto plano en Google Sheets, lo cual es adecuado para uso personal/educativo. Para producción real, considera usar Firebase Auth u otro proveedor de autenticación.

---

## 🚀 Tecnologías

- HTML5 + CSS3 (Variables CSS, Grid, Flexbox)
- JavaScript ES6+ (sin frameworks)
- Google Apps Script (backend serverless)
- Google Sheets (base de datos)
- Chart.js 4 (gráficos)
- GitHub Pages (hosting)
