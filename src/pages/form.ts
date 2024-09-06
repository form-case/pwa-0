import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-form')
export class AppForm extends LitElement {

  // Definimos la propiedad formId para capturar el ID del formulario
  @property({ type: String }) formId: string = '';

  render() {
    return html`
      <app-header ?enableBack="${true}"></app-header>
      <main>
        <h2>Formulario Dinámico</h2>
        <p>Formulario con ID: ${this.formId || 'ID no encontrado'}</p>

        <!-- Cargar el formulario en un iframe utilizando una URL dinámica -->
        ${this.formId ? html`<iframe src="${window.location.origin}/x/${this.formId}" width="100%" height="600px"></iframe>` :
        html`<p>Error: Formulario no encontrado</p>`}
      </main>
    `;
  }

  firstUpdated() {
    // Obtener el ID del formulario desde los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    this.formId = params.get('id') || ''; // Captura el 'id' desde la URL
  }
}
