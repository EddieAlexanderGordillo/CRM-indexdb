(function () {
  let DB;
  let idCliente;
  const nombreImput = document.querySelector('#nombre');
  const emailInput = document.querySelector('#email');
  const empresaInput = document.querySelector('#empresa');
  const telefonoInput = document.querySelector('#telefono');
  const formulario = document.querySelector('#formulario');
  document.addEventListener('DOMContentLoaded', () => {
    conectarDB();
    //   actualiza el registro
    formulario.addEventListener('submit', actualizarCliente);
    // verificar el id de la url
    const parametroURL = new URLSearchParams(window.location.search);
    idCliente = parametroURL.get('id');
    if (idCliente) {
      setTimeout(() => {
        obtnerCliente(idCliente);
      }, 100);
    }
  });
  function actualizarCliente(e) {
    e.preventDefault();
    if (
      nombreImput.value === '' ||
      emailInput.value === '' ||
      telefonoInput.value === '' ||
      empresaInput.value === ''
    ) {
      imprimirAlerta('Todos los campos son obligatorios', 'error');
      return;
    }
    //   actualizar cliente
    const clienteActualizado = {
      nombre: nombreImput.value,
      email: emailInput.value,
      telefono: telefonoInput.value,
      empresa: emailInput.value,
      id: Number(idCliente),
    };
    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');
    objectStore.put(clienteActualizado);
    transaction.oncomplete = function () {
      imprimirAlerta('Editado Correctamente');
      setTimeout(() => {
        window.location.href = './index.html';
      }, 3000);
    };
    transaction.onerror = function () {
      imprimirAlerta('Hubo un error', 'error');
    };
  }
  function obtnerCliente(id) {
    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');
    console.log(id);
    const cliente = objectStore.openCursor();
    cliente.onsuccess = function (e) {
      let cursor = e.target.result;
      if (cursor) {
        console.log(cursor.value);
        if (cursor.value.id === Number(id)) {
          console.log(cursor.value);
          llenarFormulario(cursor.value);
        }
        cursor.continue();
      }
    };
  }
  function llenarFormulario(datosCliente) {
    const { nombre, email, telefono, empresa } = datosCliente;
    nombreImput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  }
  function conectarDB() {
    // ABRIR CONEXIÓN EN LA BD:
    const abrirConexion = window.indexedDB.open('crm', 1);
    // si hay un error, lanzarlo
    abrirConexion.onerror = function () {
      console.log('hubo un error');
    };
    // si todo esta bien, asignar a database el resultado
    abrirConexion.onsuccess = function () {
      // guardamos el resultado
      DB = abrirConexion.result;
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
