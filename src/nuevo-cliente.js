(function () {
  let DB;
  const formulario = document.querySelector('#formulario');

  document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', validarCliente);
    conectarDB();
  });
  function conectarDB() {
    const abrirConexion = window.indexedDB.open('crm', 1);
    abrirConexion.onerror = function () {
      console.log('hubo un error');
    };
    abrirConexion.onsuccess = function () {
      DB = abrirConexion.result;
    };
  }

  function validarCliente(e) {
    e.preventDefault();
    // leer inputs
    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const empresa = document.querySelector('#empresa').value;
    if (nombre === '' || email === '' || telefono === '' || empresa === '') {
      imprimirAlerta('Todos los campos son obligatorios', 'error');
      return;
    }
    // crear un objeto con la informacion
    const cliente = {
      nombre,
      email,
      telefono,
      empresa,
    };
    cliente.id = Date.now();
    crearNuevoCliente(cliente);
  }
  function crearNuevoCliente(cliente) {
    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');
    objectStore.add(cliente);
    transaction.onerror = function () {
      imprimirAlerta('Revisar informacion', 'error');
    };
    transaction.oncomplete = function () {
      imprimirAlerta('El cliente se agregó correctamente');
      console.log('Cliente agregado');
      setTimeout(() => {
        window.location.href = './index.html';
      }, 3000);
    };
  }
  function imprimirAlerta(mensaje, tipo) {
    const alerta = document.querySelector('.alerta');
    if (!alerta) {
      // crear la alerta
      const divMensaje = document.createElement('div');
      divMensaje.classList.add('divPor_crear', 'alerta');

      if (tipo === 'error') {
        divMensaje.classList.add('erroraleta');
      } else {
        divMensaje.classList.add('correctoalerta');
      }
      divMensaje.textContent = mensaje;
      formulario.appendChild(divMensaje);
      setTimeout(() => {
        divMensaje.remove();
      }, 3000);
    }
  }
})();
