import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-participant-list')
export class AppParticipantList extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
  `;

  render() {
    return html`
      <app-header></app-header>
      <main>
        <h1>Lista de Participantes</h1>
        <p>Esta es una página simple de lista de participantes.</p>
      </main>
    `;
  }
}
