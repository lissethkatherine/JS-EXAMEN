// ── Gestión de Actividades ──
let actividades = JSON.parse(localStorage.getItem('actividades')) || [

];

function loadExternalActivities() {
    return JSON.parse(localStorage.getItem("campusbuild_activities")) || [];
}
function loadProjects() {
    return JSON.parse(localStorage.getItem("campusbuild_projects")) || [];
}

function loadProjectsFilter() {
    const select = document.getElementById('filtroProyecto');
    const projects = loadProjects();

    if (!select) return;

    select.innerHTML = `<option value="todos">Todos</option>`;

    projects.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id || p.name;
        option.textContent = p.name;
        select.appendChild(option);
    });
}

if (!localStorage.getItem('actividades')) {
    localStorage.setItem('actividades', JSON.stringify(actividades));
}

let currentDate = new Date();
let actividadAEliminar = null;
let selectedDate = null;

// ── Elementos del DOM ──
const modalActividad = document.getElementById('modalActividad');
const modalConfirmar = document.getElementById('modalConfirmar');
const modalTitle = document.getElementById('modalTitle');
const formActividad = document.getElementById('formActividad');
const toast = document.getElementById('toast');

// ── Funciones del Modal ──
function openModal(actividad = null, date = null) {
    modalTitle.textContent = actividad ? 'Editar Actividad' : 'Nueva Actividad';
    formActividad.reset();
    
    if (actividad) {
        document.getElementById('actividadId').value = actividad.id;
        document.getElementById('actNombre').value = actividad.nombre;
        document.getElementById('actProyecto').value = actividad.proyecto;
        document.getElementById('actEstado').value = actividad.estado;
        document.getElementById('actInicio').value = actividad.inicio;
        document.getElementById('actFin').value = actividad.fin;
        document.getElementById('actDescripcion').value = actividad.descripcion || '';
    } else if (date) {
        document.getElementById('actInicio').value = date;
        document.getElementById('actFin').value = date;
    }
    
    modalActividad.classList.add('active');
}

function closeModal() {
    modalActividad.classList.remove('active');
    selectedDate = null;
}

function openConfirmModal(actividad) {
    actividadAEliminar = actividad;
    document.getElementById('confirmMessage').textContent = `¿Eliminar "${actividad.nombre}"?`;
    modalConfirmar.classList.add('active');
}

function closeConfirmModal() {
    modalConfirmar.classList.remove('active');
    actividadAEliminar = null;
}

// ── Toast Notification ──
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ── Guardar en localStorage ──
function saveActividades() {
    localStorage.setItem('actividades', JSON.stringify(actividades));
}

// ── Renderizar Calendario ──
function renderCalendar() {
    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const filtro = document.getElementById('filtroProyecto').value;

    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    document.getElementById('mesAnio').textContent = `${meses[month]} ${year}`;

    const body = document.getElementById('calendarBody');
    body.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const external = loadExternalActivities();

    const externalMapped = external.map(a => ({
        id: a.id,
        nombre: a.name,
        proyecto: a.projectId || "Sin proyecto",
        estado:
            a.status === "Pendiente" ? "pendiente" :
            a.status === "En progreso" ? "en-proceso" :
            "terminada",
        inicio: a.start,
        fin: a.start,
        descripcion: ""
    }));

    const todas = [...actividades, ...externalMapped];

    const actsFiltradas = filtro === 'todos'
        ? todas
        : todas.filter(a => a.proyecto === filtro);

    const prevDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        const cell = document.createElement('div');
        cell.classList.add('day-cell', 'other-month');
        cell.innerHTML = `<div class="day-number">${prevDays - i}</div>`;
        body.appendChild(cell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement('div');
        cell.classList.add('day-cell');

        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
        if (isToday) cell.classList.add('today');

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        cell.innerHTML = `<div class="day-number">${d}</div>`;
        
        cell.addEventListener('click', (e) => {
            if (!e.target.classList.contains('activity-pill')) {
                openModal(null, dateStr);
            }
        });

        actsFiltradas.forEach(act => {
            const inicio = new Date(act.inicio + 'T00:00:00');
            const fin    = new Date(act.fin    + 'T00:00:00');
            const cellDate = new Date(year, month, d);
            
            if (cellDate >= inicio && cellDate <= fin) {
                const pill = document.createElement('div');
                pill.classList.add('activity-pill', act.estado);
                pill.textContent = act.nombre;
                
                pill.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showActivityDetail(act);
                });
                
                cell.appendChild(pill);
            }
        });

        body.appendChild(cell);
    }

    const totalCells = firstDay + daysInMonth;
    const remaining  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
        const cell = document.createElement('div');
        cell.classList.add('day-cell', 'other-month');
        cell.innerHTML = `<div class="day-number">${i}</div>`;
        body.appendChild(cell);
    }
}

function showActivityDetail(actividad) {
    const estados = {
        'pendiente': 'Pendiente',
        'en-proceso': 'En Proceso',
        'terminada': 'Terminada'
    };
    
    const confirmacion = confirm(
        `📋 ${actividad.nombre}\n\n` +
        `🏗️ Proyecto: ${actividad.proyecto}\n` +
        `📅 Inicio: ${actividad.inicio}\n` +
        `📅 Fin: ${actividad.fin}\n` +
        `📝 Estado: ${estados[actividad.estado]}\n` +
        `${actividad.descripcion ? '💬 Descripción: ' + actividad.descripcion : ''}\n\n` +
        `¿Deseas editar o eliminar esta actividad?\n\n` +
        `✅ ACEPTAR para editar\n` +
        `❌ CANCELAR para eliminar`
    );
    
    if (confirmacion) {
        openModal(actividad);
    } else {
        openConfirmModal(actividad);
    }
}

function deleteActividad(id) {
    actividades = actividades.filter(a => a.id !== id);
    saveActividades();
    renderCalendar();
    showToast('Actividad eliminada correctamente', 'success');
}

document.getElementById('btnNuevoHito')?.addEventListener('click', () => openModal());

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('btnCancel').addEventListener('click', closeModal);

modalActividad.addEventListener('click', (e) => {
    if (e.target === modalActividad) closeModal();
});

modalConfirmar.addEventListener('click', (e) => {
    if (e.target === modalConfirmar) closeConfirmModal();
});

document.getElementById('btnNoEliminar').addEventListener('click', closeConfirmModal);

document.getElementById('btnSiEliminar').addEventListener('click', () => {
    if (actividadAEliminar) {
        deleteActividad(actividadAEliminar.id);
        closeConfirmModal();
    }
});

formActividad.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('actividadId').value;
    const nombre = document.getElementById('actNombre').value.trim();
    const proyecto = document.getElementById('actProyecto').value;
    const estado = document.getElementById('actEstado').value;
    const inicio = document.getElementById('actInicio').value;
    const fin = document.getElementById('actFin').value;
    const descripcion = document.getElementById('actDescripcion').value.trim();
    
    if (!nombre || !proyecto || !inicio || !fin) {
        showToast('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (new Date(inicio) > new Date(fin)) {
        showToast('La fecha de inicio no puede ser mayor a la fecha de fin', 'error');
        return;
    }
    
    if (id) {
        const index = actividades.findIndex(a => a.id == id);
        if (index !== -1) {
            actividades[index] = {
                ...actividades[index],
                nombre,
                proyecto,
                estado,
                inicio,
                fin,
                descripcion
            };
            showToast('Actividad actualizada correctamente', 'success');
        }
    } else {
        const newId = actividades.length > 0 ? Math.max(...actividades.map(a => a.id)) + 1 : 1;
        actividades.push({
            id: newId,
            nombre,
            proyecto,
            estado,
            inicio,
            fin,
            descripcion
        });
        showToast('Actividad creada correctamente', 'success');
    }
    
    saveActividades();
    renderCalendar();
    closeModal();
});

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('filtroProyecto').addEventListener('change', renderCalendar);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeConfirmModal();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadProjectsFilter();
    renderCalendar();
});

renderCalendar();