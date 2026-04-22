# 🏗️ CampusBuild

> Plataforma web para la gestión de proyectos de construcción  
> Desarrollado con **HTML, CSS y JavaScript puro (Vanilla JS)**

---

## 🚀 Vista previa

📊 Dashboard general:
- Total de proyectos
- Actividades
- Hitos
- Recursos
- Progreso dinámico

📅 Calendario:
- Visualización de actividades por fecha
- Filtro por proyecto

📌 Módulos principales:
- Proyectos
- Actividades
- Hitos
- Recursos
- Calendario


## 🧠 Funcionalidades principales

### 📁 Proyectos
- Creación de proyectos con fechas de inicio y fin
- Validación: la fecha final no puede ser menor a la inicial

---

### 📋 Actividades
- CRUD completo de actividades
- Relación con proyectos
- Validaciones:
  - No se pueden crear fuera del rango del proyecto
  - No pueden extenderse más allá del proyecto
- Estados:
  - Pendiente
  - En progreso
  - Terminada

---

### 🎯 Hitos
- Creación y edición de hitos
- Asociación con proyectos
- Estados editables:
  - Pendiente
  - En proceso
  - Terminado

---

### 👷 Recursos
- Registro de usuarios (trabajadores)
- Validaciones:
  - Edad mínima: 18 años
  - Salario solo valores positivos
  - ID único (no duplicado)
- Asignación a actividades

---

### 📅 Calendario
- Visualización mensual
- Integración con actividades externas
- Filtro dinámico por proyecto

---

### 📊 Dashboard
- Estadísticas en tiempo real:
  - Total de proyectos
  - Total de actividades
  - Total de hitos
  - Total de recursos
- Barras de progreso dinámicas:
  - Estado de actividades
  - Progreso de hitos

---

## 💾 Persistencia de datos

Toda la información se guarda en el navegador usando:

```js
localStorage
