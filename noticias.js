// Configuración del cliente de Contentful
const SPACE_ID = 'wyf2s0ghneqe';
const ACCESS_TOKEN = 'bv3LvJSPiky12oLK6mMJBqNCXlopcRZCC0xNJoWCU20';

const client = window.contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN
});

async function obtenerNovedades() {
  const contenedor = document.getElementById('contenedor-noticias');

  try {
    const response = await client.getEntries({
      content_type: 'noticias',
      order: '-sys.createdAt',
      include: 2 // Necesario para resolver y traer la información del archivo de imagen
    });

    if (response.items.length === 0) {
      contenedor.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #a0aec0;">No hay artículos publicados por el momento.</p>';
      return;
    }

    contenedor.innerHTML = '';

    response.items.forEach(item => {
      const campos = item.fields;

      // Procesar la imagen desde Contentful
      let elementoImagen = '<div class="card-icon">📰</div>'; // Icono por defecto si no hay imagen

      // Verifica si existe el campo imagen y si tiene un archivo enlazado
      if (campos.imagen && campos.imagen.fields && campos.imagen.fields.file) {
        const urlImagen = 'https:' + campos.imagen.fields.file.url;
        const altImagen = campos.titulo || 'Noticia';
        elementoImagen = `<img src="${urlImagen}" alt="${altImagen}" class="card-image" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px 8px 0 0; margin-bottom: 1rem;">`;
      }

      const tarjeta = document.createElement('div');
      tarjeta.className = 'card';

      tarjeta.innerHTML = `
        ${elementoImagen}
        <h3>${campos.titulo || 'Sin título'}</h3>
        <p>${campos.resumen || campos.descripcion || ''}</p>
      `;

      contenedor.appendChild(tarjeta);
    });

  } catch (error) {
    console.error('Error al conectar con Contentful:', error);
    contenedor.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #e53e3e;">Ocurrió un error al cargar las novedades.</p>';
  }
}

document.addEventListener('DOMContentLoaded', obtenerNovedades);
