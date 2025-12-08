import { obras } from "./obras.js";

const contenedor = document.getElementById("contenedor-obras");

for (let i = 0; i < obras.length; i++) {

    const obra = obras[i];
    const idObra = "obra-" + i;

    // Crear SECTION
    const section = document.createElement("section");
    section.classList.add("obra");

    // Imagen con promedio arriba
    const imagenHTML = `
        <div class="imagen-contenedor">
            <span id="promedio-img-${idObra}" class="promedio">
                ⭐ 0.0
            </span>
            <img src="${obra.imagen}" alt="${obra.titulo}">
        </div>
    `;

    // Zona de información
    const descripcionHTML = `
        <div class="descripcion">
            <h2>${obra.titulo}</h2>
            <p><strong>AUTOR: </strong>${obra.autor}</p>
            <p><strong>AÑO DE CREACIÓN: </strong>${obra.anio}</p>
            <p><strong>DESCRIPCIÓN: </strong>${obra.descripcion}</p>

            <div class="btns">
                <button class="btn-calificar" data-obra="${idObra}">CALIFICAR</button>
            </div>
        </div>
    `;

    // Contenedor oculto de calificación
    const calificacionHTML = `
        <div id="zona-calificacion-${idObra}" class="zona-calificacion oculto">

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

                <button class="btn-guardar" data-obra="${idObra}">GUARDAR</button>
            </div>

            <div id="contenedor-${idObra}" class="contenedor-calificaciones"></div>
        </div>
    `;

    // Alternar orden
    if (i % 2 === 0) {
        section.innerHTML = imagenHTML + descripcionHTML + calificacionHTML;
    } else {
        section.innerHTML = descripcionHTML + imagenHTML + calificacionHTML;
    }

    contenedor.appendChild(section);

    // VARIABLES DE CALIFICACIÓN
    let sumaPuntajes = 0;
    let totalCalificaciones = 0;

    // BOTÓN CALIFICAR
    section.querySelector(".btn-calificar").addEventListener("click", () => {
        const zona = document.getElementById("zona-calificacion-" + idObra);
        zona.classList.toggle("oculto");
    });

    // BOTÓN GUARDAR
    section.querySelector(".btn-guardar").addEventListener("click", () => {

        const nombre = document.getElementById(`nombre-${idObra}`).value;
        const puntaje = parseInt(document.getElementById(`puntaje-${idObra}`).value);
        const comentario = document.getElementById(`comentario-${idObra}`).value;

        if (nombre === "" || comentario === "") {
            alert("Completa todos los campos.");
            return;
        }

        totalCalificaciones++;
        sumaPuntajes += puntaje;

        const promedio = (sumaPuntajes / totalCalificaciones).toFixed(1);

        document.getElementById(`promedio-img-${idObra}`).textContent = `⭐ ${promedio}`;

        const estrellas = "★★★★★".slice(0, puntaje) + "☆☆☆☆☆".slice(0, 5 - puntaje);

        const tarjeta = `
            <div class="calificacion">
                <h4>${nombre} — ${estrellas}</h4>
                <p>${comentario}</p>
            </div>
        `;

        document.getElementById(`contenedor-${idObra}`).innerHTML += tarjeta;
        
        document.getElementById(`nombre-${idObra}`).value = "";
        document.getElementById(`comentario-${idObra}`).value = "";
    });
}

