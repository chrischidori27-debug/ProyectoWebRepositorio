import { obras } from "./obras.js";

const contenedor = document.getElementById("contenedor-obras");

for (let i = 0; i < obras.length; i++) {
    const obra = obras[i];

    const section = document.createElement("section");
    section.classList.add("obra");
    //Estructuras de las obras
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

    // Alternar izquierda o derecha usando i
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
//Lleva a la venta de registro
const btnReg = document.getElementById("btnRegistrarse");
btnReg.addEventListener("click", () => {
    window.location.href = "./ventanaLogin.html";
});
//Lleva a la ventana de iniciar sesion
const btnIn = document.getElementById("btnInciarSesion");

btnIn.addEventListener("click", () => {
    window.location.href = "./ventanaSingUp.html";
});