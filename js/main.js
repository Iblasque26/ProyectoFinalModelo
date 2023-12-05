document.addEventListener("DOMContentLoaded", function () {
    const numeroCarritoElement = document.querySelector(".numeroCarrito");
    const productosDelCarritoLS = JSON.parse(localStorage.getItem("productosDelCarrito")) || [];
    const cantidadTotalEnCarrito = productosDelCarritoLS.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeroCarritoElement.textContent = cantidadTotalEnCarrito;
});

const contenedorProductos = document.querySelector("#contenedorProductos");
let botonesAgregar = document.querySelectorAll(".productoAgregar");
const numeroCarrito = document.querySelector(".numeroCarrito");

const productosApiUrl = 'https://my-json-server.typicode.com/Iblasque26/APIProductos/productos';

function cargarProductos() {
    fetch(productosApiUrl)
        .then(response => response.json())
        .then(data => {
            productos = data;
            contenedorProductos.innerHTML = "";
            productos.forEach(producto => {
                const div = document.createElement("div");
                div.classList.add("producto");
                div.innerHTML = `
                    <div class="card shadow-sm" data-aos="fade-left">
                        <img src="${producto.imagen}" alt="${producto.titulo}">
                        <button class="productoAgregar card-body" id="${producto.id}">
                            <p class="card-text">${producto.titulo}</p>
                            <p>$${producto.precio}</p>
                        </button>
                    </div>
                `;
                contenedorProductos.append(div);
            });
            botonAgregar();
        })
        .catch(error => console.error('Error al obtener productos:', error));
}

function botonAgregar() {
    botonesAgregar = document.querySelectorAll(".productoAgregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosDelCarrito;

let productosDelCarritoLS = localStorage.getItem("productosDelCarrito");

if (productosDelCarritoLS) {
    productosDelCarrito = JSON.parse(productosDelCarritoLS);
    actualizarNumeroDelCarrito();
} else {
    productosDelCarrito = [];
}

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosDelCarrito.some(producto => producto.id === idBoton)) {
        const index = productosDelCarrito.findIndex(producto => producto.id === idBoton);
        productosDelCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosDelCarrito.push(productoAgregado);
    }
    actualizarNumeroDelCarrito();
    mostrarNotificacion("Usted ha agregado el producto al carrito!");
    localStorage.setItem("productosDelCarrito", JSON.stringify(productosDelCarrito));
}

function actualizarNumeroDelCarrito() {
    let numeroActualizado = productosDelCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeroCarrito.innerText = numeroActualizado;
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById("notificacionProducto");
    const mensajeNotificacion = document.getElementById("mensajeProducto");

    mensajeNotificacion.textContent = mensaje;
    notificacion.style.display = "block";

    setTimeout(() => {
        notificacion.style.display = "none";
    }, 3000);
}


cargarProductos();

