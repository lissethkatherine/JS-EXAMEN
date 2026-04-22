const STORAGE_KEY = "campusbuild_resources";
const ACTIVITIES_KEY = "campusbuild_activities";

function getResources() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveResources(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getActivities() {
    return JSON.parse(localStorage.getItem(ACTIVITIES_KEY)) || [];
}
function renderTable() {
    const data = getResources();
    const tbody = document.getElementById("resourceTableBody");

    tbody.innerHTML = "";

    data.forEach((r, index) => {
        const actividadMostrar = Array.isArray(r.actividades) 
            ? r.actividades.join(", ") 
            : r.actividad || "";

        tbody.innerHTML += `
        <tr>
            <td data-label="ID">${r.identificacion}</td>
            <td data-label="Nombre">${r.nombre}</td>
            <td data-label="Rol">${r.fechaNacimiento}</td>
            <td data-label="RH">${r.tipoSangre}</td>
            <td data-label="ARL">${r.arl}</td>
            <td data-label="Genero">${r.genero}</td>
            <td data-label="Salario">$${r.salario}</td>
            <td data-label="Rol">${r.rol}</td>
            <td data-label="Actividad">${actividadMostrar}</td>
            <td data-label="Acciones">
                <button onclick="deleteResource(${index})">🗑</button>
            </td>
        </tr>`;
    });
}

function saveResource() {
    const identificacion = document.getElementById("identificacion").value;
    const nombre = document.getElementById("nombre").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const tipoSangre = document.getElementById("tipoSangre").value;
    const arl = document.getElementById("arl").value;
    const genero = document.getElementById("genero").value;
    const salario = document.getElementById("salario").value;
    const rol = document.getElementById("rol").value;
    const actividad = document.getElementById("actividadSelect").value;

    if (!fechaNacimiento) {
        alert("Debes ingresar la fecha de nacimiento");
        return;
    }

    const today = new Date();
    const birth = new Date(fechaNacimiento);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    if (age < 18) {
        alert("El usuario debe ser mayor de 18 años");
        return;
    }

    if (salario <= 0) {
        alert("El salario debe ser un valor positivo");
        return;
    }

    if (!identificacion || !nombre || !rol) {
        alert("Campos obligatorios incompletos");
        return;
    }

    const data = getResources();

    const existe = data.some(r => r.identificacion === identificacion);

    if (existe) {
        alert("Ya existe un recurso con esa identificación");
        return;
    }

    const newResource = {
        id: Date.now(),
        identificacion,
        nombre,
        fechaNacimiento,
        tipoSangre,
        arl,
        genero,
        salario,
        rol,
        actividades: actividad ? [actividad] : []
    };

    data.push(newResource);
    saveResources(data);

    closeForm();
    renderTable();
}

function deleteResource(index) {
    const data = getResources();
    data.splice(index, 1);
    saveResources(data);
    renderTable();
}

function loadActivitiesSelect() {
    const activities = getActivities();
    const select = document.getElementById("actividadSelect");

    select.innerHTML = `<option value="">Asignar actividad</option>`;

    activities.forEach(a => {
        select.innerHTML += `<option value="${a.id}">${a.name || a.nombre}</option>`;
    });
}

function openForm() {
    document.getElementById("resourceForm").classList.remove("hidden");
    loadActivitiesSelect();
}

function closeForm() {
    document.getElementById("resourceForm").classList.add("hidden");
}

window.onload = function () {
    renderTable();
};