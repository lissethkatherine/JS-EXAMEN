const modalOverlay = document.getElementById('modalOverlay');
const btnNuevoHito = document.getElementById('btnNuevoHito');
const closeModal   = document.getElementById('closeModal');
const formHito     = document.getElementById('formHito');

// Cargar hitos desde localStorage
let hitos = JSON.parse(localStorage.getItem('hitos') || '[]');

let editIndex = null;

function saveHitos() {
    localStorage.setItem('hitos', JSON.stringify(hitos));
}

function renderHitos() {
    const lista = document.getElementById('listaHitos');
    lista.innerHTML = '';

    if (hitos.length === 0) {
        lista.innerHTML = `
            <div class="no-hitos">
                <i class="fas fa-flag-checkered"></i>
                No hay hitos creados aún. ¡Crea el primero!
            </div>`;
        return;
    }

    hitos.forEach((hito, index) => {
        const card = document.createElement('div');
        card.classList.add('hito-card');
        card.innerHTML = `
            <div class="hito-info">
                <div class="hito-avatar">🎯</div>
                <div>
                    <p class="hito-nombre">${hito.nombre}</p>
                    <p class="hito-meta">
                        ${hito.descripcion || 'Sin descripción'} · ${hito.proyecto} · 
                        <b>${hito.estado || 'pendiente'}</b>
                    </p>
                </div>
            </div>
            <div class="hito-actions">
                <button onclick="editarHito(${index})">✏️</button>
                <button onclick="eliminarHito(${index})">🗑️</button>
            </div>`;
        lista.appendChild(card);
    });
}

function editarHito(index) {
    const hito = hitos[index];

    document.getElementById('nombre').value = hito.nombre;
    document.getElementById('descripcion').value = hito.descripcion || "";
    document.getElementById('proyecto').value = hito.proyecto;
    document.getElementById('estado').value = hito.estado || "pendiente";

    editIndex = index;

    openModal();
}

function eliminarHito(index) {
    hitos.splice(index, 1);
    saveHitos();
    renderHitos();
}

function openModal()  { modalOverlay.classList.add('active'); }
function closeModalFunc() {
    modalOverlay.classList.remove('active');
    formHito.reset();
    editIndex = null;
}

btnNuevoHito.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModalFunc(); });

formHito.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre      = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const proyecto    = document.getElementById('proyecto').value;

    if (nombre && proyecto) {
        const estado = document.getElementById('estado').value;

        if (editIndex !== null) {
            hitos[editIndex] = { nombre, descripcion, proyecto, estado };
        } else {
            hitos.push({ nombre, descripcion, proyecto, estado });
        }

        saveHitos();
        renderHitos();
        closeModalFunc();
    }
});

function toggleSubmenu(submenuId, event) {
    event.preventDefault();
    const submenu = document.getElementById(submenuId);
    const parent = submenu.previousElementSibling;
    
    submenu.classList.toggle('open');
    parent.classList.toggle('expanded');
}

function loadProjectsSelect() {
    const projects = loadProjects();
    const select = document.getElementById("proyecto");

    select.innerHTML = '<option value="">Seleccionar proyecto</option>';

    projects.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id || p.name;
        option.textContent = p.name;
        select.appendChild(option);
    });
}

function loadProjects() {
    return JSON.parse(localStorage.getItem("campusbuild_projects")) || [];
}

function openModal() {
    loadProjectsSelect();
    modalOverlay.classList.add('active');
}


renderHitos();

document.addEventListener("DOMContentLoaded", loadProjectsSelect);
function renderReporte() {
    const hitos      = JSON.parse(localStorage.getItem('hitos') || '[]');
    const activities = JSON.parse(localStorage.getItem('campusbuild_activities') || '[]');

    for (let i = 0; i < hitos.length; i++) {
        let pendientes = 0, enProceso = 0, terminadas = 0;

        for (let j = 0; j < activities.length; j++) {
            if (String(activities[j].projectId) === String(hitos[i].proyecto)) {
                if (activities[j].status === 'Pendiente')   pendientes++;
                if (activities[j].status === 'En progreso') enProceso++;
                if (activities[j].status === 'Terminada')   terminadas++;
            }
        }

        const total = pendientes + enProceso + terminadas;
        let estado  = 'Pendiente';
        if (enProceso > 0) estado = 'En Proceso';
        if (total > 0 && terminadas === total) estado = 'Completado';

        document.getElementById('hito-nombre-'     + i).textContent = hitos[i].nombre;
        document.getElementById('hito-estado-'     + i).textContent = estado;
        document.getElementById('hito-pendientes-' + i).textContent = pendientes;
        document.getElementById('hito-enproceso-'  + i).textContent = enProceso;
        document.getElementById('hito-terminadas-' + i).textContent = terminadas;
    }
}

renderReporte();