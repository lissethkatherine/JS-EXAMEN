const ACTIVITIES_KEY = "campusbuild_activities";
const PROJECTS_KEY = "campusbuild_projects";
const STORAGE_KEY = "campusbuild_resources";
const HITOS_KEY = "hitos";
const CALENDAR_KEY = "actividades";

function loadDashboardStats(){

    const activities = JSON.parse(localStorage.getItem(ACTIVITIES_KEY)) || [];
    const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
    const resources = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const hitos = JSON.parse(localStorage.getItem(HITOS_KEY)) || [];
    const calendarActivities = JSON.parse(localStorage.getItem(CALENDAR_KEY)) || [];

    const totalHitos = hitos.length;
    const completados = hitos.filter(h => h.estado === "terminado").length;

    const pending =
        activities.filter(a => a.status === "Pendiente").length +
        calendarActivities.filter(a => a.estado === "pendiente").length;

    const progress =
        activities.filter(a => a.status === "En progreso").length +
        calendarActivities.filter(a => a.estado === "en-proceso").length;

    const done =
        activities.filter(a => a.status === "Terminada").length +
        calendarActivities.filter(a => a.estado === "terminada").length;

    document.getElementById("totalProjects").textContent = projects.length;
    document.getElementById("totalActivities").textContent = activities.length + calendarActivities.length;
    document.getElementById("totalHitos").textContent = totalHitos;
    document.getElementById("totalResources").textContent = resources.length;

    document.getElementById("pending").textContent = pending;
    document.getElementById("progress").textContent = progress;
    document.getElementById("done").textContent = done;

    const totalActividades = pending + progress + done;
    const porcentajeActividades = totalActividades === 0 ? 0 : (done / totalActividades) * 100;

    document.querySelector(".milestone-progress p").innerHTML =
        `<span id="milestones">${completados}</span> de ${totalHitos} hitos completados`;

    const barra = document.querySelector(".milestone-progress .progress-bar div");

    if (barra) {
        const porcentaje = totalHitos === 0 ? 0 : (completados / totalHitos) * 100;
        barra.style.width = porcentaje + "%";
    }

    const barraActividades = document.querySelector(".activity-status .progress-bar div");

    if (barraActividades) {
        barraActividades.style.width = porcentajeActividades + "%";
    }
}

document.addEventListener("DOMContentLoaded", loadDashboardStats);
window.addEventListener("storage", loadDashboardStats);
