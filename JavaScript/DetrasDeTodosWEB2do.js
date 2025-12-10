const contenedor = document.getElementById("contenedor-obra");
const modal = document.getElementById("modal");
const cerrar = document.getElementById("cerrar");
const modalInfo = document.getElementById("modal-info");
const btnCargarMas = document.getElementById("cargar-mas");

let allIDs = [];       // lista de IDs de las obras
let obrasMostradas = 0; // cuántas obras se han cargado ya
const obrasPorCarga = 20;

// Obtener IDs de pinturas
async function obtenerObrasIDs() {
    const res = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11");
    const data = await res.json();
    return data.objectIDs; // todos los IDs
}

// Obtener datos de obra por ID
async function obtenerDatosObra(objectID) {
    const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
    const data = await res.json();
    return {
        titulo: data.title || "Sin título",
        autor: data.artistDisplayName || "Desconocido",
        anio: data.objectDate || "Sin fecha",
        descripcion: data.creditLine || "",
        imagen: data.primaryImage || ""
    };
}

// Cargar y mostrar un bloque de obras
async function cargarBloque() {
    let obrasCargadas = 0;
    let index = obrasMostradas;

    while (obrasCargadas < obrasPorCarga && index < allIDs.length) {
        const obra = await obtenerDatosObra(allIDs[index]);
        index++;
        if (!obra.imagen) continue; // ignorar si no tiene imagen

        mostrarObra(obra, obrasMostradas);
        obrasMostradas++;
        obrasCargadas++;
    }

    // Ocultar el botón si no hay mas obras
    if (obrasMostradas >= allIDs.length) {
        btnCargarMas.style.display = "none";
    }
}

// Función para mostrar una obra
function mostrarObra(obra, i) {
    const idObra = "obra-" + i;
    const divImagen = document.createElement("div");
    divImagen.classList.add("imagen-contenedor");
    divImagen.innerHTML = `<span id="promedio-img-${idObra}" class="promedio">⭐ 0.0</span>
                           <img src="${obra.imagen}" alt="${obra.titulo}">`;
    contenedor.appendChild(divImagen);

    let sumaPuntajes = 0;
    let totalCalificaciones = 0;

    divImagen.addEventListener("click", () => {
        modal.style.display = "flex";
        modalInfo.innerHTML = `
            <h2>${obra.titulo}</h2>
            <p><strong>Autor:</strong> ${obra.autor}</p>
            <p><strong>Año:</strong> ${obra.anio}</p>
            <p><strong>Descripción:</strong> ${obra.descripcion}</p>
            <img src="${obra.imagen}" style="width:100%; border-radius:10px; margin-top:10px;">
            
            <div class="form-calificacion">
                <input type="text" id="nombre-${idObra}" placeholder="Tu nombre">
                <select id="puntaje-${idObra}">
                    <option value="1">1 estrella</option>
                    <option value="2">2 estrellas</option>
                    <option value="3">3 estrellas</option>
                    <option value="4">4 estrellas</option>
                    <option value="5">5 estrellas</option>
                </select>
                <textarea id="comentario-${idObra}" placeholder="Comentario..."></textarea>
                <button id="guardar-${idObra}">GUARDAR</button>
            </div>

            <div id="contenedor-${idObra}" class="contenedor-calificaciones"></div>
        `;

        const btnGuardar = document.getElementById(`guardar-${idObra}`);
        btnGuardar.addEventListener("click", () => {
            const nombre = document.getElementById(`nombre-${idObra}`).value;
            const puntaje = parseInt(document.getElementById(`puntaje-${idObra}`).value);
            const comentario = document.getElementById(`comentario-${idObra}`).value;

            if(nombre === "" || comentario === ""){
                alert("Completa todos los campos.");
                return;
            }

            totalCalificaciones++;
            sumaPuntajes += puntaje;
            const promedio = (sumaPuntajes / totalCalificaciones).toFixed(1);
            document.getElementById(`promedio-img-${idObra}`).textContent = `⭐ ${promedio}`;

            const estrellas = "★★★★★".slice(0, puntaje) + "☆☆☆☆☆".slice(0, 5 - puntaje);
            const tarjeta = `<div class="calificacion"><h4>${nombre} — ${estrellas}</h4><p>${comentario}</p></div>`;
            document.getElementById(`contenedor-${idObra}`).innerHTML += tarjeta;

            document.getElementById(`nombre-${idObra}`).value = "";
            document.getElementById(`comentario-${idObra}`).value = "";
        });
    });
}

// Inicializar: obtener IDs y cargar primeras 20 obras
async function cargar20prim() {
    allIDs = await obtenerObrasIDs();
    cargarBloque();
}

// Botón "Cargar más"
btnCargarMas.addEventListener("click", cargarBloque);

// Modal
cerrar.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });

cargar20prim();
