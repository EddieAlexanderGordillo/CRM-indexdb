(function () {
  let DB;
  const listadoClientes = document.querySelector('#listado-clientes');

  document.addEventListener('DOMContentLoaded', () => {
    crearDB();
    if (window.indexedDB.open('crm', 1)) {
      obtenerClientes();
    }
    listadoClientes.addEventListener('click', eliminarRegistro);
  });

  function eliminarRegistro(e) {
    if (e.target.classList.contains('eliminar')) {
      const idEliminar = Number(e.target.dataset.cliente);
      const confirmar = confirm('Deseas eliminar este cliente?');
      if (confirmar) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.delete(idEliminar);
        transaction.oncomplete = function () {
          console.log('Eliminado...');
          e.target.parentElement.parentElement.remove();
        };
        transaction.onerror = function () {
          console.log('Hubo un error al eliminar');
        };
      }
    }
  }
  // crea la base de datos de indexdb
  function crearDB() {
    const crearDB = window.indexedDB.open('crm', 1);
    crearDB.onerror = function () {
      console.log('hubo un error');
    };
    crearDB.onsuccess = function () {
      DB = crearDB.result;
    };
    crearDB.onupgradeneeded = function (e) {
      const db = e.target.result;
      const objectStore = db.createObjectStore('crm', {
        keyPath: 'id',
        autoIncrement: true,
      });
      objectStore.createIndex('nombre', 'nombre', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });
      objectStore.createIndex('telefono', 'telefono', { unique: false });
      objectStore.createIndex('empresa', 'empresa', { unique: false });
      objectStore.createIndex('id', 'id', { unique: true });
      console.log('lista y creada');
    };
  }

  function obtenerClientes() {
    const abirConexion = window.indexedDB.open('crm', 1);
    abirConexion.onerror = function () {
      console.log('Hubo un error');
    };
    abirConexion.onsuccess = function () {
      DB = abirConexion.result;
      const objectStore = DB.transaction('crm').objectStore('crm');
      objectStore.openCursor().onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
          const { nombre, empresa, email, telefono, id } = cursor.value;
          console.log(cursor.value);
          listadoClientes.innerHTML += `
          <tr>
                          <td class="celda">
                                <p class="celda__nombre"> ${nombre} </p>
                                <p class="celda__correo"> ${email} </p>
                            </td>
                            <td class="celda">
                                <p class="celda__telefono">${telefono}</p>
                            </td>
                            <td class="celda">    
                                <p class="celda__empresa">${empresa}</p>
                            </td>
                            <td class="celda">
                                <a href="editar-cliente.html?id=${id}" class="editar">Editar</a>
                                <a href="#" data-cliente="${id}" class="eliminar">Eliminar</a>
                            </td>
                        </tr>
          `;
          cursor.continue();
        } else {
          console.log('no hay mas registros...');
        }
      };
    };
  }
})();
