# 💼 Sistema de Liquidación de Sueldos

Sistema profesional de liquidación de sueldos para Argentina, similar a Xubio y Onvio. Incluye convenios colectivos actualizados, cálculo automático de aportes y descuentos legales, y una interfaz amigable y fácil de usar.

![Sistema de Liquidación de Sueldos](https://img.shields.io/badge/Estado-Funcional-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)
![React](https://img.shields.io/badge/React-18-blue)

## ✨ Características

- ✅ **Gestión de Empleados**: Registro completo de empleados con convenios y categorías
- ✅ **30 Convenios Colectivos**: Sistema de convenios actualizados (Textiles, Comercio, Metalúrgico, Construcción, Gastronomía, y más)
- ✅ **Liquidación Automática**: Cálculo automático de haberes y descuentos legales
- ✅ **Conceptos Variables**: Agregar horas extras, bonificaciones, premios, etc.
- ✅ **Historial Completo**: Consulta de liquidaciones por período y empleado
- ✅ **Interfaz Amigable**: Diseño moderno e intuitivo

## 🚀 Instalación

### Requisitos Previos

- Node.js 14+ y npm
- Navegador web moderno

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/NicOrtiz29/sistemaDeLiquidacion.git
cd sistemaDeLiquidacion
```

2. **Instalar dependencias del backend:**
```bash
npm install
```

3. **Instalar dependencias del frontend:**
```bash
cd client
npm install
cd ..
```

O instalar todo de una vez:
```bash
npm run install-all
```

## 🎯 Uso

### Iniciar el Servidor Backend

```bash
npm start
# o en modo desarrollo:
npm run dev
```

El servidor se iniciará en `http://localhost:5001`

### Iniciar el Cliente Frontend

En una nueva terminal:
```bash
npm run client
```

La aplicación se abrirá en `http://localhost:3000`

## 📋 Convenios Incluidos

El sistema incluye **30 convenios colectivos** comunes en Argentina:

- 🏭 **Industria:** Textil, Metalúrgico, Químico, Gráfico, Alimentación, Farmacéutico, Automotriz, Calzado, Plástico, Madera, Vidrio, Cerámica, Cemento, Papel, Caucho
- 🔧 **Construcción y Servicios:** Construcción, Electricidad, Maquinista, Transporte
- 💼 **Comercio y Servicios:** Comercio, Gastronomía, Seguridad
- 🏢 **Servicios Profesionales:** Administrativo, Bancario, Seguros, Educación, Salud
- ⛽ **Recursos Naturales:** Petrolero, Minería, Agrícola

Cada convenio incluye múltiples categorías con sueldos básicos configurados.

**📖 Ver lista completa:** Consulta `LISTA-CONVENIOS.md` o la página "Convenios" en el sistema.

*Nota: Los valores de los convenios deben actualizarse según la normativa vigente*

## 💰 Cálculo de Liquidación

El sistema calcula automáticamente:

### Haberes
- Sueldo Básico
- Presentismo (8.33%)
- Horas Extras (variables)
- Bonificaciones (variables)
- Otros haberes

### Descuentos Legales
- Jubilación (11%)
- Ley 19.032 (3%)
- Obra Social (3%)
- Sindicato (2.5%)
- Seguro de Vida (0.6%)

*Nota: Los porcentajes están configurados según normativa vigente y deben revisarse periódicamente*

## 📁 Estructura del Proyecto

```
.
├── server/              # Backend Node.js/Express
│   ├── database/       # Configuración de base de datos
│   ├── routes/         # Rutas de la API
│   ├── services/       # Lógica de negocio
│   └── index.js        # Servidor principal
├── client/             # Frontend React
│   ├── public/         # Archivos públicos
│   └── src/
│       ├── components/ # Componentes reutilizables
│       ├── pages/      # Páginas principales
│       └── services/   # Servicios API
└── package.json        # Dependencias del proyecto
```

## 🔧 Configuración

### Base de Datos

El sistema usa SQLite por defecto. La base de datos se crea automáticamente en:
```
server/data/liquidacion.db
```

### API Endpoints

- `GET /api/empleados` - Listar empleados
- `POST /api/empleados` - Crear empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Desactivar empleado
- `GET /api/convenios` - Listar convenios
- `GET /api/convenios/:id/categorias` - Categorías de un convenio
- `POST /api/liquidacion/calcular` - Calcular liquidación
- `POST /api/liquidacion/guardar` - Guardar liquidación
- `GET /api/liquidacion/periodo/:periodo` - Liquidaciones por período
- `GET /api/liquidacion/empleado/:id` - Liquidaciones de un empleado

## 🎨 Tecnologías Utilizadas

### Backend
- Node.js
- Express
- SQLite3

### Frontend
- React
- React Router
- Axios

## 📝 Notas Importantes

1. **Valores de Convenios**: Los valores de sueldos básicos y porcentajes deben actualizarse según la normativa vigente y acuerdos paritarios.

2. **Base de Datos**: La base de datos SQLite es perfecta para desarrollo. Para producción, considere migrar a PostgreSQL o MySQL.

3. **Seguridad**: En producción, agregue autenticación, autorización y validación de datos.

4. **Backups**: Configure backups regulares de la base de datos.

## 🤝 Contribuciones

Este sistema fue diseñado como un punto de partida. Se recomienda:
- Actualizar convenios según normativas vigentes
- Agregar más validaciones
- Implementar autenticación y roles
- Agregar generación de recibos en PDF
- Integración con AFIP

## 📄 Licencia

MIT

## 👤 Autor

**NicOrtiz29**

- GitHub: [@NicOrtiz29](https://github.com/NicOrtiz29)

---

Desarrollado con ❤️ para facilitar la gestión de liquidación de sueldos en Argentina.
