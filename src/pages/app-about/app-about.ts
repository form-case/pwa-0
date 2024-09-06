import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { router } from '../../router';

@customElement('app-about')
export class AppAbout extends LitElement {
  @state() formFile: File | null = null;
  @state() modelFile: File | null = null;
  @state() formTitle: string | null = null; // Aquí almacenamos el título del formulario
  @state() loadedForms: { title: string; enketoId: string }[] = []; // Lista de formularios cargados

  static styles = css`
    .uploader {
      margin-top: 20px;
    }
    input {
      margin-bottom: 10px;
    }
    .form-list {
      margin-top: 20px;
    }
    .form-list button {
      margin-right: 10px;
      padding: 10px;
      background-color: #08c;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }
  `;

  // Lee el contenido del archivo
  readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Error al leer el archivo"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  // Función para extraer el título del formulario desde el XML
  extractFormTitle(xmlContent: string): string | null {
    const titleMatch = xmlContent.match(/id="form-title">([^<]+)</);
    return titleMatch ? titleMatch[1] : null;
  }

  // Almacenar el formulario y el modelo en IndexedDB
  storeInIndexedDB(formString: string, modelString: string, enketoId: string) {
    const request = indexedDB.open('enketo', 4);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('surveys')) {
        const surveysStore = db.createObjectStore('surveys', { keyPath: 'enketoId' });
        surveysStore.createIndex('enketoId', 'enketoId', { unique: true });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('surveys', 'readwrite');
      const store = transaction.objectStore('surveys');

      const survey = {
        form: formString,
        enketoId: `${enketoId}`, // EnketoId dinámico
        model: modelString,
        hash: 'md5:hashcode',
        languageMap: {},
        maxSize: 10000000,
        media: {}
      };
      store.put(survey);

      // Actualizar la lista de formularios cargados
      this.loadedForms = [...this.loadedForms, { title: this.formTitle ?? 'Sin título', enketoId }];
    };

    request.onerror = (event) => {
      console.error('Error al abrir IndexedDB:', (event.target as IDBOpenDBRequest).error);
    };
  }

  // Cargar los formularios almacenados en IndexedDB
  loadFormsFromIndexedDB() {
    const request = indexedDB.open('enketo', 4);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('surveys', 'readonly');
      const store = transaction.objectStore('surveys');
      const requestAll = store.getAll();

      requestAll.onsuccess = () => {
        const surveys = requestAll.result;
        this.loadedForms = surveys.map((survey: any) => ({
          title: this.extractFormTitle(survey.form) ?? 'Sin título',
          enketoId: survey.enketoId
        }));
      };

      requestAll.onerror = () => {
        console.error('Error al cargar formularios de IndexedDB');
      };
    };

    request.onerror = (event) => {
      console.error('Error al abrir IndexedDB:', (event.target as IDBOpenDBRequest).error);
    };
  }

  // Llamar a esta función cuando el componente se monte
  firstUpdated() {
    this.loadFormsFromIndexedDB();
  }

  // Manejador de cambios en el archivo del formulario
  handleFormChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.formFile = inputElement.files ? inputElement.files[0] : null;
  }

  // Manejador de cambios en el archivo del modelo
  handleModelChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.modelFile = inputElement.files ? inputElement.files[0] : null;
  }

  // Manejador para subir los archivos y almacenar en IndexedDB
  handleUpload() {
    if (!this.formFile || !this.modelFile) {
      alert('Por favor selecciona ambos archivos');
      return;
    }

    Promise.all([
      this.readFileContent(this.formFile),
      this.readFileContent(this.modelFile)
    ])
    .then(([formContent, modelContent]) => {
      const cleanFormString = this.cleanString(formContent);
      const cleanModelString = this.cleanString(modelContent);

      // Extraer título del formulario desde el XML
      this.formTitle = this.extractFormTitle(cleanFormString);

      // Obtener el nombre del archivo sin extensión para el enketoId
      const enketoId = this.formFile?.name.split('.')[0] || 'unknown';

      this.storeInIndexedDB(cleanFormString, cleanModelString, enketoId);
    })
    .catch(error => console.error('Error al cargar los archivos:', error));
  }

  cleanString(input: string): string {
    return input.replace(/\\\\/g, '\\').replace(/\\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  }

  render() {
    return html`
      <app-header ?enableBack="${true}"></app-header>
      <main>
        <h2>Subir Formulario y Modelo</h2>
        <div class="uploader">
          <input type="file" accept=".xml" @change="${this.handleFormChange}">
          <input type="file" accept=".xml" @change="${this.handleModelChange}">
          <button @click="${this.handleUpload}">Subir Form y Model a IndexDB</button>
        </div>

        ${this.formTitle ? html`<p>Formulario cargado: ${this.formTitle}</p>` : ''}

        <h3>Formularios cargados:</h3>
        <ul>
          ${this.loadedForms.map(
            (form) => html`
              <li>
                <button @click="${() => router.navigate(`/form?id=${form.enketoId}`)}">
                  Ir a ${form.title} (ID: ${form.enketoId})
                </button>
              </li>
            `
          )}
        </ul>
      </main>
    `;
  }
}
