//guardar datos en la memoria del navegador
const ACTIVITIES_KEY = "campusbuild_activities";
const PROJECTS_KEY   = "campusbuild_projects";

// Cargar actividades guardadas en el navegador
function loadActivities() {
    return JSON.parse(localStorage.getItem(ACTIVITIES_KEY)) || [];
}

// Guardar actividades en el navegador
function saveActivities(activities) {
    // Convierte las actividades a texto y las guarda
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

// Cargar proyectos guardados
function loadProjects() {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
}

// llenar los desplegables de proyectos)
function populateProjectSelects() {
    const projects = loadProjects();
    const filterEl  = document.getElementById("filterProject");
    const formEl    = document.getElementById("formProject");

    // Guarda el proyecto que estaba seleccionado antes
    const currentFilter = filterEl ? filterEl.value : "";

    // Llenar el filtro de proyectos
    if (filterEl) {
        filterEl.innerHTML = '<option value="">Todos</option>';

        // Crear una opción por cada proyecto
        projects.forEach(function(p) {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            filterEl.appendChild(opt);
        });

        // Volver a seleccionar el que estaba elegido
        filterEl.value = currentFilter;
    }

    // Llenar el select del formulario (modal)
    if (formEl) {
        const currentVal = formEl.value;
        formEl.innerHTML = '<option value="">Sin proyecto</option>';

        projects.forEach(function(p) {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            formEl.appendChild(opt);
        });

        formEl.value = currentVal;
    }
}


// Buscar el nombre del proyecto usando su ID
function getProjectName(id) {
    if (!id) return null;
    const projects = loadProjects();

    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === id) return projects[i].name;
    }

    return id;
}


// Elegir el color del badge según el estado
function badgeClass(status) {
    if (status === "Terminada")  return "badge badge-terminada";
    if (status === "En progreso") return "badge badge-progreso";
    return "badge badge-pendiente";
}


//mostrar actividades en la página
function render() {
    populateProjectSelects();

    const activities = loadActivities();
    const list       = document.getElementById("activityList");
    const filterVal  = document.getElementById("filterProject").value;

    // Filtrar por proyecto si el usuario eligió uno
    const filtered = filterVal
        ? activities.filter(function(a) { return a.projectId === filterVal; })
        : activities;

    // Si no hay actividades, mostrar mensaje
    if (!filtered.length) {
        list.innerHTML = '<div class="empty">No hay actividades. Crea una nueva :)</div>';
        return;
    }

    let html = "";

    // Crear el HTML de cada actividad
    filtered.forEach(function(a) {
        const projectName = getProjectName(a.projectId);

        html += `
            <div class="activity-item">
                <div class="activity-left">
                    <div class="activity-name-row">
                        <span class="activity-name">${a.name}</span>
                        <span class="${badgeClass(a.status)}">${a.status}</span>
                    </div>
                    <div class="activity-meta">
                        ${projectName ? `<span><i class="fas fa-folder"></i> Proyecto: <b>${projectName}</b></span>` : ""}
                        ${a.responsable ? `<span><i class="fas fa-user"></i> Responsable: <b>${a.responsable}</b></span>` : ""}
                        ${a.start ? `<span><i class="fas fa-calendar"></i> Inicio: <b>${a.start}</b></span>` : ""}
                        ${a.duration ? `<span><i class="fas fa-clock"></i> Duración: <b>${a.duration} día${a.duration == 1 ? "" : "s"}</b></span>` : ""}
                    </div>
                </div>
                <div class="activity-actions">
                    <button onclick="openEdit('${a.id}')">✏️</button>
                    <button onclick="openDelete('${a.id}')">🗑️</button>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
}


// abrir modal para crear nueva actividad
function openModal() {
    populateProjectSelects();

    // Limpiar todos los campos
    document.getElementById("editingId").value          = "";
    document.getElementById("modalTitle").textContent   = "Nueva Actividad";
    document.getElementById("formName").value           = "";
    document.getElementById("formProject").value        = "";
    document.getElementById("formResponsable").value    = "";
    document.getElementById("formStart").value          = "";
    document.getElementById("formDuration").value       = "";
    document.getElementById("formStatus").value         = "Pendiente";

    // Mostrar el modal
    document.getElementById("modalOverlay").classList.remove("hidden");
}


// abrir modal para editar actividad existente
function openEdit(id) {
    populateProjectSelects();
    const activities = loadActivities();

    for (let i = 0; i < activities.length; i++) {
        if (activities[i].id === id) {
            const a = activities[i];

            // Llenar el formulario con los datos
            document.getElementById("editingId").value          = a.id;
            document.getElementById("modalTitle").textContent   = "Editar Actividad";
            document.getElementById("formName").value           = a.name;
            document.getElementById("formProject").value        = a.projectId || "";
            document.getElementById("formResponsable").value    = a.responsable || "";
            document.getElementById("formStart").value          = a.start || "";
            document.getElementById("formDuration").value       = a.duration || "";
            document.getElementById("formStatus").value         = a.status || "Pendiente";

            document.getElementById("modalOverlay").classList.remove("hidden");
        }
    }
}


// Cerrar modal
function closeModal() {
    document.getElementById("modalOverlay").classList.add("hidden");
}


//guarda la nueva actividad o los cambios en una actividad existente
function saveActivity() {
    const name = document.getElementById("formName").value.trim();

    const projectId = document.getElementById("formProject").value;
    const start = document.getElementById("formStart").value;

        if (!start) {
        alert("Debes seleccionar una fecha de inicio");
        return;
    }

    if (projectId && start) {
        const projects = loadProjects();
        const project = projects.find(p => String(p.id) === String(projectId));

        if (project && project.start && project.end) {
            const activityDate = new Date(start);
            const projectStart = new Date(project.start);
            const projectEnd = new Date(project.end);

            const duration = parseInt(document.getElementById("formDuration").value) || 0;

            const endDate = new Date(start);
            endDate.setDate(endDate.getDate() + duration);

            if (activityDate < projectStart || activityDate > projectEnd) {
                alert("La actividad debe estar dentro del rango de fechas del proyecto");
                return;
            }

            if (endDate > projectEnd) {
                alert("La actividad se extiende más allá del proyecto");
                return;
            }
        }
    }

    // Si no hay nombre, no dejamos guardar
    if (!name) {
        document.getElementById("formName").focus();
        return;
    }

    const editingId  = document.getElementById("editingId").value;
    const activities = loadActivities();

    const data = {
        name:        name,
        projectId:   document.getElementById("formProject").value,
        responsable: document.getElementById("formResponsable").value.trim(),
        start:       document.getElementById("formStart").value,
        duration:    document.getElementById("formDuration").value,
        status:      document.getElementById("formStatus").value
    };

    // si es editar, actualizar
    if (editingId) {
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].id === editingId) {
                Object.assign(activities[i], data);
            }
        }
    } else {
        // Si es nueva actividad, crear ID y guardar
        data.id = Date.now().toString();
        activities.push(data);
    }

    saveActivities(activities);
    closeModal();
    render();
}


//eliminar actividad
function openDelete(id) {
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteOverlay").classList.remove("hidden");
}

function closeDelete() {
    document.getElementById("deleteOverlay").classList.add("hidden");
}

function confirmDelete() {
    const id     = document.getElementById("deleteId").value;

    // Guardar todo menos la actividad eliminada
    const nuevas = loadActivities().filter(function(a) { return a.id !== id; });

    saveActivities(nuevas);
    closeDelete();
    render();
}


//Activa botón del menú lateral
function setActive(element, event) {
    event.preventDefault();

    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.remove('active');
    });

    element.classList.add('active');
}

// Expone estadísticas para el dashboard
function getDashboardStats() {
    const activities = loadActivities();
    const projects   = loadProjects();

    const pendientes  = activities.filter(a => a.status === "Pendiente").length;
    const enProgreso  = activities.filter(a => a.status === "En progreso").length;
    const terminadas  = activities.filter(a => a.status === "Terminada").length;

    return {
        totalProjects:    projects.length,
        totalActivities:  activities.length,
        pendientes,
        enProgreso,
        terminadas
    };
}
document.addEventListener("DOMContentLoaded", render);
document.getElementById("filterProject")?.addEventListener("change", render);