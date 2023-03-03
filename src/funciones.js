function conectarDB() {
  const abrirConexion = window.indexedDB.open('crm', 1);
  abrirConexion.onerror = function () {
    console.log('hubo un error');
  };
  abrirConexion.onsuccess = function () {
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
