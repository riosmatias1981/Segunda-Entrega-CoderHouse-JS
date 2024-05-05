// local storage
const productos = JSON.parse(localStorage.getItem("productos")) || [] 
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

const agregarProducto = ({id, nombre, precio})=>{
    if(productos.some(prod=>prod.id===id)){
    } else {
        const productoNuevo = new Producto(id, nombre, precio)
        productos.push(productoNuevo)
        localStorage.setItem('productos', JSON.stringify(productos))
    }
}

const productosPreexistentes = ()=>{
    if (productos.length===0){
        productosBase.forEach(prod=>{
            let dato = JSON.parse(JSON.stringify(prod))
                agregarProducto(dato)}
            )
    }
}

const totalCarrito = ()=>{
    let total = carrito.reduce((acumulador, {precio, cantidad})=>{
        return acumulador + (precio*cantidad)
    }, 0)
    return total
}

const totalCarritoRender = ()=>{
    const carritoTotal = document.getElementById("carritoTotal")
    carritoTotal.innerHTML=`Precio total: $ ${totalCarrito()}`
}


const agregarCarrito = (objetoCarrito)=>{
    // agrega productos al carrito
    carrito.push(objetoCarrito)
    totalCarritoRender()
}

const mostrarCarrito = ()=>{
    // borra el contenido del carrito y lo muestra en una lista
    const listaCarrito = document.getElementById("listaCarrito")
    // borramos para evitar clones viejos
    listaCarrito.innerHTML=""
    carrito.forEach(({nombre, precio, cantidad, id}) =>{
        let elementoLista = document.createElement("li")
        elementoLista.innerHTML=`Producto:${nombre} -- P/u: ${precio} -- Cant.:${cantidad} <button id="eliminarCarrito${id}">X</button>`
        listaCarrito.appendChild(elementoLista)
        const botonBorrar = document.getElementById(`eliminarCarrito${id}`)
        botonBorrar.addEventListener("click",()=>{
            // creo un array sin el elemento a borrar y lo igualo a carrito
            carrito = carrito.filter((elemento)=>{
                if(elemento.id !== id){
                    return elemento
                }
            })
            let carritoString = JSON.stringify(carrito)
            localStorage.setItem("carrito", carritoString)
            mostrarCarrito()
        })
        let carritoString = JSON.stringify(carrito)
        localStorage.setItem("carrito", carritoString)
    })
}


const borrarCarrito = ()=>{
    carrito.length = 0  //es una manera de borrar el contenido de un array constante
    let carritoString = JSON.stringify(carrito)
    localStorage.setItem("carrito", carritoString)
    mostrarCarrito()
}

const renderizarProductos = (arrayUtilizado)=>{
    const contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = ""
    arrayUtilizado.forEach(({id, nombre, precio})=>{
        const prodCard = document.createElement("div")
        prodCard.classList.add("col-xs")
        prodCard.classList.add("card")
        prodCard.classList.add("productos")
        prodCard.id = id
        prodCard.innerHTML = `
                <img src="./assets/${nombre+id}.jpg" class="card-img-top" alt="${nombre}">
                <div class="card-body">
                    <h4 class="card-title">${nombre}</h4>
                    <label>$ ${precio}</label>
                    <form id="form${id}">
                        <label for="contador${id}">Cantidad</label>
                        <input type="number" class="contador" placeholder="0" id="contador${id}" min="0">
                      <p>  <button class="btn btn-primary" id="botonProd${id}">Agregar</button></p>
                    </form>
                </div>`
        contenedorProductos.appendChild(prodCard)
        const btn = document.getElementById(`botonProd${id}`)
        btn.addEventListener("click",(evento)=>{
            evento.preventDefault()
            const contadorQuantity = Number(document.getElementById(`contador${id}`).value)
            if(contadorQuantity>0){
                agregarCarrito({id, nombre, precio, cantidad:contadorQuantity})
                mostrarCarrito()
                const form = document.getElementById(`form${id}`)
                form.reset()
            }
        }) 
    })
}


const finalizarCompra = (event)=>{
    
    borrarCarrito()
    let mensaje = document.getElementById("carritoTotal")
    mensaje.innerHTML = "Muchas gracias por su compra, los esperamos pronto"

}


// DOM
const compraFinal = document.getElementById("formCompraFinal")
compraFinal.addEventListener("submit",(event)=>{
    event.preventDefault()
    if(carrito.length>0){
        finalizarCompra(event)
    }
})





// Testing
const app = ()=>{
    productosPreexistentes()
    renderizarProductos(productos)
    mostrarCarrito()
    totalCarritoRender()
}

//ejecuto mi aplicacion
app()