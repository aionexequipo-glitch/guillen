/**
 * lead-magnet.js
 * Manejador del formulario para adquisición del PDF Lead Magnet gratuito
 * Conexión con el endpoint de Google Apps Script
 */

const APPS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyycWcVfFNTJaihLJHPveXcDyMdYSv1LONqt8xlUhK3Il93A5rEVB3wIgJouOgb69k/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lead-magnet-form');
  const submitBtn = document.getElementById('lead-submit-btn');
  const statusBox = document.getElementById('lead-status-box');

  if (!form || !submitBtn || !statusBox) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('lead-name');
    const emailInput = document.getElementById('lead-email');

    const nombreRaw = nameInput ? nameInput.value : '';
    const emailRaw = emailInput ? emailInput.value : '';

    // Mapeo exacto de los datos requeridos por el script
    const nombre = (nombreRaw || 'Amigo/a').trim();
    const email = (emailRaw || '').trim().toLowerCase();
    const origen = 'Landing Lead Magnet';
    const ahora = new Date().toISOString();

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      mostrarMensaje('Por favor, ingresá un correo electrónico válido.', 'error');
      return;
    }

    // Estado visual de envío / carga
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Generando acceso al PDF...</span>';
    statusBox.style.display = 'none';

    const payload = {
      nombre: nombre,
      email: email,
      origen: origen,
      ahora: ahora
    };

    try {
      // Petición a Google Apps Script (modo no-cors para tolerar redirecciones HTTP 302 sin bloqueos de navegador)
      await fetch(APPS_SCRIPT_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Confirmación exitosa en pantalla
      form.reset();
      form.style.display = 'none';
      mostrarMensaje(
        `✅ <strong>¡Listo, ${nombre}!</strong><br>` +
        `Te enviamos el <strong>Checklist de Emergencia</strong> a <strong>${email}</strong>.<br>` +
        `Revisá tu bandeja de entrada o spam en los próximos minutos.<br><br>` +
        `<a href="#" class="btn-primary" style="margin-top: 10px; display: inline-flex; max-width: 320px;" onclick="alert('Descargando archivo PDF...'); return false;">` +
        `<span>Descargar PDF Ahora Mismo</span>` +
        `</a>`,
        'success'
      );
    } catch (err) {
      console.error('Error al conectar con Google Apps Script:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Reintentar descarga</span><span class="arrow">↓</span>';
      mostrarMensaje('Hubo un inconveniente temporal de conexión con el servidor. Por favor, intentá nuevamente.', 'error');
    }
  });

  function mostrarMensaje(mensajeHtml, tipo) {
    statusBox.innerHTML = mensajeHtml;
    statusBox.className = `status-box ${tipo} animate-pop-in`;
    statusBox.style.display = 'block';
  }
});
