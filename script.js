// Variables
let carrito = [];

// Seleccionar elementos
const carritoContenido = document.getElementById('carrito-contenido');
const totalCarrito = document.getElementById('total-carrito');
const btnVaciarCarrito = document.getElementById('vaciar-carrito');
const btnProcesarCompra = document.getElementById('procesar-compra');

// Función para agregar productos al carrito
document.querySelectorAll('.btn-agregar').forEach((boton) => {
  boton.addEventListener('click', () => {
    const nombre = boton.dataset.nombre;
    const precio = parseFloat(boton.dataset.precio);

    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }

    actualizarCarrito();
  });
});

// Función para actualizar el carrito
function actualizarCarrito() {
  carritoContenido.innerHTML = '';
  let total = 0;

  carrito.forEach((producto, index) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${producto.cantidad}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button class="btn-eliminar" data-index="${index}">Eliminar</button></td>
    `;
    carritoContenido.appendChild(fila);
  });

  totalCarrito.textContent = total.toFixed(2);
  activarBotonesEliminar();
}

// Función para eliminar productos del carrito
function activarBotonesEliminar() {
  document.querySelectorAll('.btn-eliminar').forEach((boton) => {
    boton.addEventListener('click', () => {
      const index = parseInt(boton.dataset.index);
      carrito.splice(index, 1);
      actualizarCarrito();
    });
  });
}

// Vaciar carrito
btnVaciarCarrito.addEventListener('click', () => {
  carrito = [];
  actualizarCarrito();
});

// Procesar compra
btnProcesarCompra.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  alert('Compra procesada con éxito. ¡Gracias por tu compra!');
  carrito = [];
  actualizarCarrito();
});

// PayPal
paypal.Buttons({
  createOrder: function (data, actions) {
    const total = parseFloat(totalCarrito.textContent);
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toFixed(2)
        }
      }]
    });
  },
  onApprove: function (data, actions) {
    return actions.order.capture().then(function (details) {
      alert('¡Pago exitoso! Gracias, ' + details.payer.name.given_name);
      carrito = [];
      actualizarCarrito();
    });
  },
  onError: function (err) {
    console.error(err);
    alert('Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.');
  }
}).render('#paypal-button-container');
