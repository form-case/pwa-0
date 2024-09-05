import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { resolveRouterPath } from '../router'; // Asegúrate de tener el archivo de rutas configurado

@customElement('side-menu')
export class SideMenu extends LitElement {
  // Propiedad que controla si el menú está abierto o no
  @property({ type: Boolean }) isOpen = false;

  static styles = css`
    .menu {
      position: fixed;
      top: 0;
      left: -100%;
      width: 80%;
      max-width: 300px;
      height: 100%;
      background: #fff;
      color: #000;
      padding: 1rem;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      z-index: 2000;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      transition: left 0.3s ease;
    }

    /* Cuando el menú está abierto */
    .menu.open {
      left: 0;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: none;
    }

    .overlay.open {
      display: block;
    }

    button {
      margin-bottom: 1rem;
      cursor: pointer;
    }
  `;

  // Método para cerrar el menú
  closeMenu() {
    this.isOpen = false;
  }

  // Método para abrir el menú
  openMenu() {
    this.isOpen = true;
  }

  // Método de navegación con resolveRouterPath
  navigateTo(page: string) {
    const path = resolveRouterPath(page); // Resuelve la ruta según la página
    window.location.href = path; // Redirecciona a la ruta resuelta
    this.closeMenu();
  }

  render() {
    return html`
      <div class="overlay ${this.isOpen ? 'open' : ''}" @click="${this.closeMenu}"></div>
      <div class="menu ${this.isOpen ? 'open' : ''}">
        <button @click="${this.closeMenu}">Cerrar Menú ❎</button>
        <nav>
          <!-- Uso de resolveRouterPath para manejar la navegación -->
          <sl-button href="${resolveRouterPath('home')}" variant="primary">Inicio</sl-button>
          <sl-button href="${resolveRouterPath('about')}" variant="primary">Acerca de</sl-button>
        </nav>
      </div>
    `;
  }
}
