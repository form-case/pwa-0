import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('app-subheader')
export class SubHeader extends LitElement {
  @state() isSyncing = false;
  @state() isUploading = false;
  @state() isResetting = false;

  static styles = css`
    div {
      display: flex;
      justify-content: flex-end;
      padding: 0.5rem;
      color: black;
      background-color: #f4f4f4;
      width: 100%;
      z-index: 1001;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    button {
      margin: 0 10px;
      padding: 0.5rem;
      background-color: #08c;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
    }

    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #007cba;
    }
  `;

  render() {
    return html`
      <div>
        <button @click="${this.handleSyncClick}" ?disabled="${this.isSyncing || this.isUploading || this.isResetting}">
          🔄 Sincronizar
        </button>
        <button @click="${this.handleUploadClick}" ?disabled="${this.isSyncing || this.isUploading || this.isResetting}">
          📤 Subir
        </button>
        <button @click="${this.handleResetClick}" ?disabled="${this.isSyncing || this.isUploading || this.isResetting}">
          🗑️ Resetear
        </button>
      </div>
    `;
  }

  handleSyncClick() {
    this.isSyncing = true;
    setTimeout(() => {
      alert('Sincronización completada');
      this.isSyncing = false;
    }, 2000);
  }

  handleUploadClick() {
    this.isUploading = true;
    setTimeout(() => {
      alert('Datos subidos a Cloudant');
      this.isUploading = false;
    }, 2000);
  }

  handleResetClick() {
    this.isResetting = true;
    setTimeout(() => {
      alert('Base de datos reiniciada');
      this.isResetting = false;
    }, 2000);
  }
}
