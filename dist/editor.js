import {css} from './css-editor.js?v=0.1';

import * as libEditor from './lib-editor.js';

class skyThermostatEditor extends HTMLElement {
    
    async setConfig(config) {
        this._config = { ...config, entities: { ...(config.entities || {}) } };
        
        await libEditor.loadTranslations(this);
    
        if (!this.shadowRoot) {
            
            this.attachShadow({ mode: 'open' });
            
            this.shadowRoot.innerHTML = `
                <div id="content" class="content">test</div>
            `;
            
            const container = this.shadowRoot;
            const style = document.createElement('style');
            style.textContent = css();
            container.appendChild(style);
            
        }
        libEditor.renderContent(this);
    }
  
    set hass(hass) {
        this._hass = hass;
    }
      
    get hass() {
        return this._hass;
    }
      
    get value() {
        return this.config;
    }
}
customElements.define('sky-thermostat-editor', skyThermostatEditor);

class skyDhwControlerEditor extends HTMLElement {
    
    async setConfig(config) {
        this._config = { ...config, entities: { ...(config.entities || {}) } };
        
        await libEditor.loadTranslations(this);
    
        if (!this.shadowRoot) {
            
            this.attachShadow({ mode: 'open' });
            
            this.shadowRoot.innerHTML = `
                <div id="content" class="content">test</div>
            `;
            
            const container = this.shadowRoot;
            const style = document.createElement('style');
            style.textContent = css();
            container.appendChild(style);
            
        }
        libEditor.renderDhwContent(this);
    }
  
    set hass(hass) {
        this._hass = hass;
    }
      
    get hass() {
        return this._hass;
    }
      
    get value() {
        return this.config;
    }
}
customElements.define('sky-dhw-controler-editor', skyDhwControlerEditor);
