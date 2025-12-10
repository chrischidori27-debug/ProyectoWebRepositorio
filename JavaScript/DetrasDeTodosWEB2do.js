import { obras } from "./obras.js";
const contenedor = document.getElementById("contenedor-obra");
const modal = document.getElementById("modal");
const cerrar = document.getElementById("cerrar");
const modalInfo = document.getElementById("modal-info");

for (let i = 0; i < obras.length; i++) {
    const obra = obras[i];
    const idObra = "obra-" + i;

    const divImagen = document.createElement("div");
    divImagen.classList.add("imagen-contenedor");
    divImagen.innerHTML = `<span id="promedio-img-${idObra}" class="promedio">⭐ 0.0</span>
                            <img src="${obra.imagen}" alt="${obra.titulo}">`;
    contenedor.appendChild(divImagen);

    let sumaPuntajes = 0;
    let totalCalificaciones = 0;

    // Abrir modal al hacer clic en la imagen
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

        // Guardar calificación dentro del modal
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

// Cerrar modal
cerrar.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });
