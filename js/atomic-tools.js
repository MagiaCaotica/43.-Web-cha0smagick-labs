/* Atomic Tools engine. Independent from shared.js and conversion.js. */
(function () {
  'use strict';

  const DATA_URL = '../data/atomic-tools.json';
  const app = document.querySelector('[data-atomic-tool]');
  if (!app) return;

  const toolId = app.getAttribute('data-atomic-tool') || '';
  const mount = document.getElementById('atomic-app');
  if (!mount) return;

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const asList = (value) => Array.isArray(value) ? value : [value];
  const getFieldValue = (form, field) => {
    const input = form.elements.namedItem(field.id);
    if (!input) return '';
    if (field.type === 'checkbox') {
      return form.querySelectorAll(`[name="${CSS.escape(field.id)}"]:checked`).length > 0 ? 'Sí' : 'No';
    }
    return typeof input.value === 'string' ? input.value.trim() : '';
  };

  const fieldMarkup = (field) => {
    const id = escapeHtml(field.id);
    const label = escapeHtml(field.label || field.id);
    const required = field.required ? ' required' : '';
    const described = `help-${id}`;
    const base = `id="field-${id}" name="${id}" aria-describedby="${described}"`;
    let control = '';
    switch (field.type) {
      case 'textarea':
        control = `<textarea ${base}${required} rows="5" placeholder="Escribe con tus propias palabras"></textarea>`;
        break;
      case 'select':
        control = `<select ${base}${required}><option value="">Selecciona una opción</option>${asList(field.options || []).map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join('')}</select>`;
        break;
      case 'checkbox':
        control = `<input ${base} type="checkbox" value="Sí">`;
        break;
      case 'number':
        control = `<input ${base}${required} type="number" inputmode="decimal" step="any" placeholder="Escribe un número">`;
        break;
      case 'date':
        control = `<input ${base}${required} type="date">`;
        break;
      case 'time':
        control = `<input ${base}${required} type="time">`;
        break;
      case 'month':
        control = `<input ${base}${required} type="month">`;
        break;
      case 'search':
        control = `<input ${base}${required} type="search" placeholder="Buscar o escribir">`;
        break;
      default:
        control = `<input ${base}${required} type="text" placeholder="Escribe tu respuesta">`;
    }
    const inputType = field.type === 'checkbox' ? ' checkbox-control' : '';
    return `<div class="atomic-field${inputType}"><div class="atomic-label-row"><label for="field-${id}">${label}${field.required ? '<span aria-hidden="true"> *</span>' : ''}</label>${field.type === 'checkbox' ? '<span class="field-optional">opcional</span>' : ''}</div>${control}<small id="${described}">Se guarda solo en este navegador cuando sea posible.</small></div>`;
  };

  const renderForm = (tool) => {
    const fields = asList(tool.fields || []);
    mount.innerHTML = `<div class="atomic-hero"><p class="atomic-kicker">${escapeHtml(tool.category || 'Herramienta simbólica')}</p><h1>${escapeHtml(tool.name)}</h1><p class="atomic-lead">${escapeHtml(tool.description || '')}</p><div class="atomic-notice"><strong>Herramienta gratuita</strong><span> Usa esta página como una herramienta de reflexión y registro. No sustituye atención médica, psicológica, legal o financiera.</span></div></div><section class="atomic-card"><h2>Configura tu lectura</h2><p class="atomic-muted">Completa los campos opcionales o obligatorios y obtén una guía simbólica reproducible en este dispositivo.</p><form id="atomic-form" novalidate>${fields.map(fieldMarkup).join('')}<div class="atomic-actions"><button class="atomic-button" type="submit">Generar resultado</button><button class="atomic-button atomic-button-secondary" type="reset">Limpiar</button></div><p id="atomic-form-status" class="atomic-status" role="status" aria-live="polite"></p></form></section><section id="atomic-result" class="atomic-card atomic-result" hidden></section><section class="atomic-card"><h2>Cómo usar esta herramienta</h2><ol class="atomic-steps">${asList(tool.method || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol><h3>Qué esperar</h3><p>${escapeHtml(tool.result || 'Obtendrás una guía práctica para reflexionar y registrar tu proceso.')}</p><h3>Uso responsable</h3><p>${escapeHtml(tool.safety || 'No uses esta herramienta para sustituir decisiones importantes ni para obtener datos de terceros sin consentimiento.')}</p></section><section class="atomic-card atomic-faq"><h2>Preguntas frecuentes</h2><details><summary>¿La lectura es una predicción?</summary><p>No. Es una interpretación simbólica y de autoconocimiento; las decisiones importantes deben apoyarse en información y contexto reales.</p></details><details><summary>¿Se envía mi información a un servidor?</summary><p>El motor funciona en el navegador. La página no necesita una cuenta ni almacena tus respuestas en un servidor.</p></details><details><summary>¿Puedo usar el resultado en un diario?</summary><p>Sí, úsalo como registro reflexivo y compara tus observaciones a lo largo del tiempo.</p></details></section>`;

    const form = document.getElementById('atomic-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const startedAt = Date.now();
      const status = document.getElementById('atomic-form-status');
      const missing = fields.filter((field) => field.required && !getFieldValue(form, field));
      if (missing.length) {
        status.textContent = `Completa: ${missing.map((field) => field.label || field.id).join(', ')}.`;
        status.className = 'atomic-status is-error';
        return;
      }
      if (window.Cha0Analytics && typeof window.Cha0Analytics.track === 'function') {
        window.Cha0Analytics.track('tool_start', {
          tool_id: toolId,
          category: tool.category || 'tool',
          source: 'atomic_tool'
        });
      }
      const values = fields.map((field) => ({ label: field.label || field.id, value: getFieldValue(form, field) })).filter((item) => item.value);
      const result = document.getElementById('atomic-result');
      result.hidden = false;
      result.innerHTML = `<p class="atomic-kicker">Resultado simbólico</p><h2>${escapeHtml(tool.name)}</h2><p class="atomic-lead">Tu registro está listo para interpretar con curiosidad y sin certezas forzadas.</p><div class="atomic-result-grid">${values.map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join('')}</div><h3>${escapeHtml(tool.result || 'Lectura de referencia')}</h3><p>Usa estos datos para escribir una interpretación propia, revisar patrones y elegir una acción pequeña y reversible. Guarda la fecha y observa qué resulta útil con el tiempo.</p><button id="atomic-save" class="atomic-button atomic-button-secondary" type="button">Guardar resumen local</button><span id="atomic-save-status" class="atomic-status" role="status" aria-live="polite"></span>`;
      status.textContent = 'Resultado generado.';
      status.className = 'atomic-status is-success';
      const durationSeconds = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
      const durationBucket = durationSeconds <= 30 ? '0-30'
        : durationSeconds <= 60 ? '31-60'
          : durationSeconds <= 180 ? '61-180'
            : durationSeconds <= 600 ? '181-600' : '601+';
      if (window.Cha0Analytics && typeof window.Cha0Analytics.track === 'function') {
        window.Cha0Analytics.track('tool_complete', {
          tool_id: toolId,
          category: tool.category || 'tool',
          result_present: true,
          duration_bucket: durationBucket,
          source: 'atomic_tool'
        });
      }
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('atomic-save').addEventListener('click', () => {
        try {
          const key = `atomic-tool:${toolId}`;
          localStorage.setItem(key, JSON.stringify({ savedAt: new Date().toISOString(), values }));
          document.getElementById('atomic-save-status').textContent = 'Resumen guardado en este navegador.';
        } catch (error) {
          document.getElementById('atomic-save-status').textContent = 'No se pudo guardar localmente; puedes copiar el resultado.';
        }
      });
    });
  };

  const showError = (error) => {
    mount.innerHTML = `<section class="atomic-card atomic-error"><h1>No se pudo cargar la herramienta</h1><p>Actualiza la página o comprueba la conexión. No se han enviado tus datos.</p></section>`;
    console.error('[atomic-tools]', error);
  };

  fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((catalog) => {
      const tool = catalog.tools && catalog.tools[toolId];
      if (!tool) throw new Error(`Unknown tool ${toolId}`);
      document.title = `${tool.name} | Herramientasgratuitas`;
      renderForm(tool);
    })
    .catch(showError);
})();
