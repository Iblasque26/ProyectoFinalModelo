const carritoVacio = document.querySelector(".carritoVacio");
const carritoProductos = document.querySelector(".carritoProductos");
const carritoAcciones = document.querySelector(".carritoAcciones");
const carritoCompra = document.querySelector(".carritoCompra");
const botonVaciar = document.querySelector(".vaciarCarrito");
const botonComprar = document.querySelector(".carritoComprar");
const contTotal = document.querySelector(".total");

let botonesEliminar = document.querySelectorAll(".carritoProductoEliminar");
let productosDelCarritoLS = JSON.parse(localStorage.getItem("productosDelCarrito"));

// URL de la API de carrito en https://my-json-server.typicode.com/
const carritoApiUrl = 'https://my-json-server.typicode.com/Iblasque26/APIProductos';

function cargarCarrito() {
    fetch(carritoApiUrl)
        .then(response => response.json())
        .then(data => {
            productosDelCarritoLS = data;
            mostrarCarrito();
            botonEliminar();
            totalActualizado();
        })
        .catch(error => console.error('Error al obtener productos del carrito:', error));
}

function mostrarCarrito() {
    if (productosDelCarritoLS && productosDelCarritoLS.length > 0) {
        carritoVacio.classList.add("disabled");
        carritoProductos.classList.remove("disabled");
        carritoAcciones.classList.remove("disabled");
        carritoCompra.classList.add("disabled");

        carritoProductos.innerHTML = "";

        productosDelCarritoLS.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("contenedorProducto");

            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carritoProductoTitulo">
                    <small>Titulo</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carritoProductoCantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carritoProductoPrecio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carritoProductoSubtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button id="${producto.id}" class="carritoProductoEliminar"><i class="bi bi-cart-dash"></i></button>
            `;

            carritoProductos.append(div);
        });
    } else {
        carritoVacio.classList.remove("disabled");
        carritoProductos.classList.add("disabled");
        carritoAcciones.classList.add("disabled");
        carritoCompra.classList.add("disabled");
    }
}

function botonEliminar() {
    botonesEliminar = document.querySelectorAll(".carritoProductoEliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarProducto);
    });
}

function eliminarProducto(e) {
    const idBoton = e.currentTarget.id;
    const index = productosDelCarritoLS.findIndex(producto => producto.id === idBoton);
    if (productosDelCarritoLS[index].cantidad > 1) {
        productosDelCarritoLS[index].cantidad--;
    } else {
        productosDelCarritoLS.splice(index, 1);
    }

    fetch(carritoApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productosDelCarritoLS),
    })
        .then(response => response.json())
        .then(data => {
            productosDelCarritoLS = data;
            mostrarCarrito();
            totalActualizado();
        })
        .catch(error => console.error('Error al eliminar producto del carrito:', error));
}

function vaciarCarrito() {
    fetch(carritoApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([]),
    })
        .then(response => response.json())
        .then(data => {
            productosDelCarritoLS = data;
            mostrarCarrito();
            totalActualizado();
        })
        .catch(error => console.error('Error al vaciar carrito:', error));
}

function totalActualizado() {
    const totalTotal = productosDelCarritoLS.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contTotal.innerText = `$${totalTotal}`;
}

function comprarCarrito() {
    fetch(carritoApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([]),
    })
        .then(response => response.json())
        .then(data => {
            productosDelCarritoLS = data;
            mostrarCarrito();
            totalActualizado();
        })
        .catch(error => console.error('Error al realizar compra:', error));
}

cargarCarrito();

botonVaciar.addEventListener("click", vaciarCarrito);
botonComprar.addEventListener("click", comprarCarrito);
