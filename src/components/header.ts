import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './SideMenu'; // Importa el menú lateral
import './SubHeader'; // Importa el subheader

@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String }) title = 'DM'; // Título del header
  @state() private isMenuOpen = false; // Estado para controlar si el menú lateral está abierto
  @state() private isSubHeaderOpen = false; // Estado para controlar si el subheader está abierto

  private subHeaderTimeout: number | undefined; // Variable para controlar el timeout

  static styles = css`
    header {
      background-color: #08c;
      padding-left: 1rem;
      padding-right: 1rem;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    button {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
    }

    .subheader {
      background-color: #004c8c;
      padding: 0.5rem;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      top: 50px; /* Ajusta según la altura del header */
      width: 100%;
      z-index: 1001;
    }
  `;

  render() {
    return html`
      <header>
        <button @click="${this.onMenuToggle}">☰</button>
        <h1>${this.title}</h1>
        <button @click="${this.onRightButtonClick}">⚙️</button>
      </header>

      <!-- Mostramos el menú lateral dependiendo del estado isMenuOpen -->
      <side-menu ?isOpen="${this.isMenuOpen}" @close-menu="${this.onMenuToggle}"></side-menu>

      <!-- Mostramos el subheader si isSubHeaderOpen es verdadero -->
      ${this.isSubHeaderOpen ? html`<app-subheader></app-subheader>` : ''}
    `;
  }

  // Método para alternar el menú lateral
  onMenuToggle() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menú abierto:', this.isMenuOpen);
  }

  // Método para mostrar/ocultar el subheader y configuramos el cierre automático
  onRightButtonClick() {
    this.isSubHeaderOpen = !this.isSubHeaderOpen;
    console.log('Subheader abierto:', this.isSubHeaderOpen);

    if (this.isSubHeaderOpen) {
      // Si el subheader se abre, establecemos un temporizador para cerrarlo automáticamente en 10 segundos
      this.clearSubHeaderTimeout(); // Aseguramos que no haya temporizadores anteriores activos
      this.subHeaderTimeout = window.setTimeout(() => {
        this.isSubHeaderOpen = false;
        console.log('Subheader cerrado automáticamente después de 10 segundos');
      }, 10000); // 10 segundos
    } else {
      this.clearSubHeaderTimeout(); // Si el subheader se cierra manualmente, cancelamos el temporizador
    }
  }

  // Método para limpiar el timeout si el subheader se cierra manualmente antes del tiempo
  clearSubHeaderTimeout() {
    if (this.subHeaderTimeout !== undefined) {
      clearTimeout(this.subHeaderTimeout);
      this.subHeaderTimeout = undefined;
    }
  }
}
