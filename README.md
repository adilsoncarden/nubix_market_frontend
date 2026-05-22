# 🏪 Nubix Market - Sistema de Gestión Integral

**Frontend moderno para la plataforma de compras de Nubix Market**, un sistema integral que digitaliza la gestión de inventario, ventas y créditos.

---

## 📋 Tabla de Contenidos

- [Acerca de](#acerca-de)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso](#uso)
- [Autores](#autores)

---

## 📌 Acerca de

### Misión
Brindar a las familias de la zona productos de primera necesidad con frescura, variedad y cercanía, ofreciendo una atención personalizada que facilite el abastecimiento diario del hogar de manera confiable y accesible.

### Visión
Para 2030, ser el market preferencial y referente tecnológico en Lima Norte, consolidándose como el líder del vecindario. Reconocidos por innovación, excelencia operativa y rapidez en el servicio a través de canales digitales.

### Problema que Resuelve
Nubix Market digitaliza los procesos manuales tradicionales:
- **Inventario visual** → Sistema centralizado de control de stock
- **Consulta física lenta** → Canal digital rápido para verificar disponibilidad
- **Gestión de créditos manual** → Registro digital seguro de "fiados"

---

## ✨ Características

- 🔐 **Autenticación de usuarios** - Login y registro seguro
- 📦 **Gestión de inventario** - Consulta y disponibilidad de productos
- 🛒 **Carrito de compras** - Interfaz intuitiva para compras
- 💳 **Gestión de créditos** - Registro y seguimiento de "fiados"
- 📱 **Diseño responsivo** - Optimizado para móvil y desktop
- 🎨 **UI/UX moderna** - Interfaz clara y accesible

---

## 🛠️ Tecnologías

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Frontend** | React + Vite | Latest |
| **Lenguaje** | JavaScript (ES6+) | - |
| **Estilos** | CSS3 / Tailwind CSS | - |
| **Gestión de Estado** | Redux / Context API | - |
| **Backend** | Spring Boot | 3.x+ |
| **Base de Datos** | MySQL | 8.0+ |
| **Control de Versiones** | Git / GitHub | - |

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v16 o superior)
- **npm** (v8 o superior) o **yarn**
- **Git**

---

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/nubix/nubix_market_frontend.git
cd nubix_market_frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus valores
```

4. **Ejecutar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes compartidos (Header, Footer, etc.)
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── MainContent.jsx
├── pages/              # Páginas principales
│   ├── Login.jsx
│   └── Register.jsx
├── features/           # Lógica de negocio por features
├── hooks/              # Hooks personalizados
├── services/           # Servicios API
├── store/              # Gestión de estado global
├── utils/              # Funciones utilitarias
├── config/             # Configuraciones
├── layouts/            # Layouts reutilizables
├── assets/             # Imágenes y recursos estáticos
├── App.jsx             # Componente raíz
├── main.jsx            # Punto de entrada
├── App.css
└── index.css
```

---

## 📖 Uso

### Desarrollo
```bash
npm run dev      # Inicia servidor con hot reload
npm run build    # Genera build de producción
npm run preview  # Vista previa de build
npm run lint     # Ejecuta linter
```

### Compilación
```bash
npm run build    # Crea carpeta dist/ optimizada
```

---

## 👥 Autores

- **Cardeña Cusi Adilson Aldair**
- **Tinoco Guerrero Wilmer Leopoldo**
- **Abad Puglianini Danna Sherily**
- **Cáceres Aranda Diego Antonio**
- **Ramírez Taboada Christopher**
- **Rodriguez Valencia Pedro**

---

## 📄 Licencia

Este proyecto está bajo licencia [MIT](LICENSE) (o especifica la licencia que uses).

---

## 🤝 Contribuir

Para contribuir al proyecto:

1. Fork el repositorio  
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)  
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)  
4. Push a la rama (`git push origin feature/AmazingFeature`)  
5. Abre un Pull Request  

---

## 📞 Soporte

Para reportar problemas o sugerencias, abre un issue en el repositorio.