const contenedor = document.getElementById("contenedor-obra");
const modal = document.getElementById("modal");
const cerrar = document.getElementById("cerrar");
const modalInfo = document.getElementById("modal-info");
const btnCargarMas = document.getElementById("cargar-mas");

let allIDs = [];       
let obrasMostradas = 0; 
const obrasPorCarga = 20;

// Objeto para guardar calificaciones por obra
const calificaciones = {}; // clave: idObra, valor: array de {nombre, puntaje, comentario}

// Obtener IDs de pinturas
async function obtenerObrasIDs() {
    const url = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11");
    const data = await url.json();
    return data.objectIDs;
}

// Obtener datos de obra por ID
async function obtenerDatosObra(objectID) {
    const url = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
    const data = await url.json();
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
    let cont = obrasMostradas;

    while (obrasCargadas < obrasPorCarga && cont < allIDs.length) {
        const obra = await obtenerDatosObra(allIDs[cont]);
        cont++;
        if (!obra.imagen) continue;

        mostrarObra(obra, obrasMostradas);
        obrasMostradas++;
        obrasCargadas++;
    }

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

    if (!calificaciones[idObra]) calificaciones[idObra] = [];
    let sumaPuntajes = calificaciones[idObra].reduce((sum, c) => sum + c.puntaje, 0);
    let totalCalificaciones = calificaciones[idObra].length;

    divImagen.addEventListener("click", () => {
        modal.style.display = "flex";

        // Calcular promedio actual
        const promedio = totalCalificaciones ? (sumaPuntajes / totalCalificaciones).toFixed(1) : "0.0";
        document.getElementById(`promedio-img-${idObra}`).textContent = `⭐ ${promedio}`;

        // Crear contenido del modal
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

        // Mostrar calificaciones previas si existen
        const contCalif = document.getElementById(`contenedor-${idObra}`);
        calificaciones[idObra].forEach(c => {
            const estrellas = "★★★★★".slice(0, c.puntaje) + "☆☆☆☆☆".slice(0, 5 - c.puntaje);
            contCalif.innerHTML += `<div class="calificacion"><h4>${c.nombre} — ${estrellas}</h4><p>${c.comentario}</p></div>`;
        });

        const btnGuardar = document.getElementById(`guardar-${idObra}`);
        btnGuardar.addEventListener("click", () => {
            const nombre = document.getElementById(`nombre-${idObra}`).value;
            const puntaje = parseInt(document.getElementById(`puntaje-${idObra}`).value);
            const comentario = document.getElementById(`comentario-${idObra}`).value;

            if(nombre === "" || comentario === ""){
                alert("Completa todos los campos.");
                return;
            }

            // Guardar en el objeto calificaciones
            calificaciones[idObra].push({nombre, puntaje, comentario});
            sumaPuntajes += puntaje;
            totalCalificaciones++;

            // Actualizar promedio en la imagen
            const promedioActual = (sumaPuntajes / totalCalificaciones).toFixed(1);
            document.getElementById(`promedio-img-${idObra}`).textContent = `⭐ ${promedioActual}`;

            const estrellas = "★★★★★".slice(0, puntaje) + "☆☆☆☆☆".slice(0, 5 - puntaje);
            contCalif.innerHTML += `<div class="calificacion"><h4>${nombre} — ${estrellas}</h4><p>${comentario}</p></div>`;

            // Limpiar inputs
            document.getElementById(`nombre-${idObra}`).value = "";
            document.getElementById(`comentario-${idObra}`).value = "";
        });
    });
}

// Inicializar
async function cargar20prim() {
    allIDs = await obtenerObrasIDs();
    cargarBloque();
}

btnCargarMas.addEventListener("click", cargarBloque);

cerrar.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });

cargar20prim();
