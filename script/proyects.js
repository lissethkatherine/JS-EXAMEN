//para guardar los proyectos en localStorage
const STORAGE_KEY = "campusbuild_projects";

function loadProjects() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    
}

function render() {
    const projects = loadProjects();
    const grid     = document.getElementById("projectGrid");

    if (!projects.length) {
        grid.innerHTML = '<div class="empty">No hay proyectos. Crea uno nuevo :)</div>';
        return;
    }

    let html = "";
    projects.forEach(function(p) {
        html += `
            <div class="card">
                <div class="card-header">
                    <span class="card-name">${p.name}</span>
                    <div class="card-actions">
                        <button class="icon-btn" onclick="openEdit('${p.id}')" title="Editar">
                            ✏️
                        </button>
                        <button class="icon-btn" onclick="openDelete('${p.id}')" title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </div>
                ${p.description ? `<p class="card-desc">${p.description}</p>` : ""}
                <div class="card-dates">
                    ${p.start ? "Inicio: <b>" + p.start + "</b>" : ""}
                    ${p.end   ? "&nbsp;&nbsp;Fin: <b>" + p.end + "</b>" : ""}
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

//Modal crear/editar
function openModal() {
    document.getElementById("editingId").value          = "";
    document.getElementById("modalTitle").textContent   = "Nuevo Proyecto";
    document.getElementById("formName").value           = "";
    document.getElementById("formDesc").value           = "";
    document.getElementById("formStart").value          = "";
    document.getElementById("formEnd").value            = "";
    document.getElementById("modalOverlay").classList.remove("hidden");
}

function openEdit(id) {
    const projects = loadProjects();
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === id) {
            document.getElementById("editingId").value        = projects[i].id;
            document.getElementById("modalTitle").textContent = "Editar Proyecto";
            document.getElementById("formName").value         = projects[i].name;
            document.getElementById("formDesc").value         = projects[i].description;
            document.getElementById("formStart").value        = projects[i].start;
            document.getElementById("formEnd").value          = projects[i].end;
            document.getElementById("modalOverlay").classList.remove("hidden");
        }
    }
}

function closeModal() {
    document.getElementById("modalOverlay").classList.add("hidden");
}

function saveProject() {
    const name = document.getElementById("formName").value.trim();
    
    if (!name) {
        document.getElementById("formName").focus();
        return;
    }

    const start = document.getElementById("formStart").value;
    const end   = document.getElementById("formEnd").value;

    // Validar fechas
    if (start && end && new Date(end) < new Date(start)) {
        alert("La fecha de fin no puede ser menor que la fecha de inicio");
        return;
    }

    const editingId = document.getElementById("editingId").value;
    const projects  = loadProjects();

    if (editingId) {
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === editingId) {
                projects[i].name        = name;
                projects[i].description = document.getElementById("formDesc").value.trim();
                projects[i].start       = document.getElementById("formStart").value;
                projects[i].end         = document.getElementById("formEnd").value;
            }
        }
    } else {
        projects.push({
            id:          Date.now().toString(),
            name:        name,
            description: document.getElementById("formDesc").value.trim(),
            start:       document.getElementById("formStart").value,
            end:         document.getElementById("formEnd").value
        });
    }

    saveProjects(projects);
    closeModal();
    render();
}

// ── Modal eliminar ────────────────────────────────────────────
function openDelete(id) {
    document.getElementById("deleteId").value = id;
    document.getElementById("deleteOverlay").classList.remove("hidden");
}

function closeDelete() {
    document.getElementById("deleteOverlay").classList.add("hidden");
}

function confirmDelete() {
    const id     = document.getElementById("deleteId").value;
    const nuevos = loadProjects().filter(p => p.id !== id);
    saveProjects(nuevos);
    closeDelete();
    render();
}

window.onload = render;

// ── Sidebar: setActive 
function setActive(element, event) {
    event.preventDefault();
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

// ── Sidebar: toggleSubmenu
function toggleSubmenu(submenuId, event) {
    event.preventDefault();
    const submenu    = document.getElementById(submenuId);
    const parentItem = submenu.previousElementSibling;
    submenu.classList.toggle('open');
    parentItem.classList.toggle('expanded');
}

// ── Sidebar: búsqueda en tiempo real
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            const text = item.querySelector('.nav-text');
            if (text) {
                item.style.display = text.textContent.toLowerCase().includes(term) ? '' : 'none';
            }
        });
    });
});
