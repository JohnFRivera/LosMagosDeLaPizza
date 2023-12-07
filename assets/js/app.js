let contentProductos = document.getElementById('contentProductos');
let tableFactura = document.getElementById('tableFactura');
let btnLiquidarFactura = document.getElementById('btnLiquidarFactura');
let btnBorrarProductos = document.getElementById('btnBorrarProductos');
let btnBorrarFacturas = document.getElementById('btnBorrarFacturas');

let almacenamientoLocal = window.localStorage;

const onLoad = () => {
    tableFactura.innerHTML = '';
    let total = 0;
    if (almacenamientoLocal.length == 0) {
        almacenamientoLocal.setItem(1, '[]');
        almacenamientoLocal.setItem(2, '[]');
    } else if (almacenamientoLocal.getItem(1).length == 0) {
        almacenamientoLocal.setItem(1, '[]');
    } else if (almacenamientoLocal.getItem(2).length == 0) {
        almacenamientoLocal.setItem(2, '[]');
    }
    var listaAgregados = JSON.parse(almacenamientoLocal.getItem(1));
    if (listaAgregados.length > 0) {
        listaAgregados.map(Producto => {
            tableFactura.innerHTML += `
            <tr class="d-flex align-items-center justify-content-between w-100">
                <td class="rounded-start w-100 py-3 text-truncate">${Producto.nombre}</td>
                <td class="py-3 w-100">- $${Producto.precio.toLocaleString('es-CO')}</td>
                <td class="rounded-end w-auto"><button class="btn btn-danger" onclick="EliminarProducto(${Producto.id}, '${Producto.nombre}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                </svg>
                </button></td>
            </tr>
            `
            total+= Producto.precio;
        })
        tableFactura.innerHTML += `
        <tr class="bg-danger text-white d-flex align-items-center justify-content-between w-100">
            <th class="w-100 py-3">Total</th>
            <th class="py-3 w-100">$${total.toLocaleString('es-CO')}</th>
        </tr>
        `
    }
    var listaFacturas = JSON.parse(almacenamientoLocal.getItem(2));
    if (listaFacturas.length > 0) {
        listaFacturas.map(Factura => {
            tableFacturasLiquidadas.innerHTML += `
            <tr>
                <td>${Factura.idFactura}</td>
                <td>${Factura.totalProductos}</td>
                <td>${Factura.fecha}</td>
                <td>$${Factura.total.toLocaleString('es-CO')}</td>
            </tr>
            `
        });
    }
}

const EliminarProducto = (id, nombre) => {
    var listaAgregados = JSON.parse(almacenamientoLocal.getItem(1));
    listaAgregados.map(Producto => {
        if (Producto.id == id && Producto.nombre == nombre) {
            listaAgregados.splice(listaAgregados.indexOf(Producto), 1);
            almacenamientoLocal.setItem(1, JSON.stringify(listaAgregados));
        } else {
            console.log('No entró a la decision.');
        }
    })
    location.reload();
}

const AgregarProducto = (nombre, precio, id) => {
    var listaAgregados = JSON.parse(almacenamientoLocal.getItem(1));
    listaAgregados.push({nombre, precio, id});
    almacenamientoLocal.setItem(1, JSON.stringify(listaAgregados));
    location.reload();
}

const AgregarFactura = (totalProductos, total) => {
    var listaFacturas = JSON.parse(almacenamientoLocal.getItem(2));
    var idFactura = listaFacturas.length + 1;
    var fecha = new Date(Date.now());
    fecha = `${fecha.getDay()}-${fecha.getMonth()}-${fecha.getFullYear()}`;
    listaFacturas.push({idFactura, totalProductos, fecha, total});
    almacenamientoLocal.setItem(2, JSON.stringify(listaFacturas));
    almacenamientoLocal.setItem(1, '[]');
    location.reload();
}

const LiquidarFactura = () => {
    var listaAgregados = JSON.parse(almacenamientoLocal.getItem(1));
    if (listaAgregados.length > 0) {
        var total = 0;
        var totalProductos = 0;
        listaAgregados.map(Producto => {
            totalProductos++;
            total+= Producto.precio;
        });
        AgregarFactura(totalProductos, total);
    }
}

fetch('./assets/json/Productos.json')
    .then(Response => Response.json())
    .then(Data => {
        contentProductos.innerHTML = "";
        Data.map(Producto => {
            contentProductos.innerHTML += `
            <div class="p-2 border rounded-3 m-3">
                <h1>${Producto.name}</h1>
                <hr>
                <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3" id="content${Producto.name}">
                    
                </div>
            </div>
            `;
            let items = document.getElementById(`content${Producto.name}`);
            Producto.content.map(item => {
                items.innerHTML += `
                <div class="col my-1">
                    <div class="bg-${Producto.color} p-3 rounded-2 h-100">
                        <div class="row h-100">
                            <div class="col d-flex align-items-end">
                                <img src="./assets/media/${item.img}.webp" class="w-100" alt="${item.nombre}">
                            </div>
                            <div class="col text-white">
                                <h4 class="display-6 fs-4 fw-semibold">${item.nombre}</h4>
                                <h3 class="display-6 fs-3 fw-bolder">$ ${item.precio.toLocaleString('es-CO')}</h3>
                                <button class="btn btn-outline-warning" onclick="AgregarProducto('${item.nombre}', ${item.precio}, ${item.id})">Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
                `
            })
        })
    })

document.addEventListener("load", onLoad());

btnLiquidarFactura.addEventListener("click", (e) => {
    if (JSON.parse(almacenamientoLocal.getItem(1)).length > 0) {
        LiquidarFactura();
    } else {
        alert('No puede liquidar una factura sin productos.');
    }
});

btnBorrarProductos.addEventListener("click", (e) => {
    almacenamientoLocal.setItem(1, '[]');
    location.reload();
});

btnBorrarFacturas.addEventListener("click", (e) => {
    almacenamientoLocal.setItem(2, '[]');
    location.reload();
});