import { obras } from "./obras.js";

const contenedor = document.getElementById("contenedor-obras");

for (let i = 0; i < obras.length; i++) {
    const obra = obras[i];

    const section = document.createElement("section");
    section.classList.add("obra");

    const imagenHTML = `
        <div class="imagen-contenedor">
            <img src="${obra.imagen}" alt="${obra.titulo}">
        </div>
    `;

    const descripcionHTML = `
        <div class="descripcion">
            <h2>${obra.titulo}</h2>
            <p><strong>AUTOR: </strong> ${obra.autor}</p>
            <p><strong>AÑO DE CREACIÓN: </strong> ${obra.anio}</p>
            <p><strong>DESCRIPCIÓN: </strong> ${obra.descripcion}</p>
        </div>
    `;

    const botonesHTML = `
        <div class="btns">
            <button>REVISAR</button>
            <button>CALIFICAR</button>
        </div>
    `;

    // Alternar izquierda/derecha usando i
    if (i % 2 === 0) {
        section.innerHTML = `
            ${imagenHTML}
            ${descripcionHTML}
            ${botonesHTML}
        `;
    } else {
        section.innerHTML = `
            ${botonesHTML}
            ${descripcionHTML} 
            ${imagenHTML}
        `;
    }

    contenedor.appendChild(section);
}
