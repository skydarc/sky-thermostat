import {cssData} from './css-card.js?v=0.1';

import './editor.js';

import * as libCalc from './lib-calc.js';

import * as libCard from './lib-card.js';

console.info("%c Sky-Thermostat \n%c Version  0.1.1 ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");

class skyThermostat extends HTMLElement {
    
    static cycle = 0;
		
	constructor() {
        super();
        
        this._initializeCard();
    }
    
    _initializeCard() {
    
        if (!customElements.get("ha-entity-picker")) {
            const huiEntitiesCard = customElements.get("hui-entities-card");
            if (huiEntitiesCard) {
                huiEntitiesCard.getConfigElement();
            }
        }
        
    }
  
	setConfig(config) {

        this.config = config;
    
        // Crée la structure statique après avoir reçu la configuration
        if (!this.content) {
          this._createCardStructure();
        }
    }
    
    _createCardStructure() {
        
        // Initialize the content if it's not there yet.
		if (!this.content) {
		    
		    const cardElem = document.createElement('ha-card');
			this.appendChild(cardElem);
			
			const style = document.createElement('style');
            style.textContent = cssData();
            cardElem.appendChild(style);
			
            const contElem = document.createElement('div');
		    contElem.setAttribute('id', 'sky-thermostat');
			contElem.setAttribute('class', 'sky-thermostat');
			cardElem.appendChild(contElem);
				
			this.content = this.querySelector("div");
			
			window.contElem = this.content;
			
		}
		
        this.options = {
            diameter: 400, 
            minValue: 15,
            maxValue: 25,
            numTicks: 150,
            tickDegrees: 300,
            sizeProgIcon: 40
        };
        
        this.properties = {
        	rangeValue: this.options.maxValue - this.options.minValue,
        	radius: this.options.diameter / 2,
        	blur_radius: (this.options.diameter / 2) - 10,
        	ticksOuterRadius: this.options.diameter / 30,
        	ticksInnerRadius: this.options.diameter / 8,
        	icoIsDraw: false
        };
        
        libCard.renderBase(this);
		
		this.startDelay;
        this._drag = {
			inProgress: false,
			origine: null
		};
		this._isMenuOpen = false;

    }
    
	set hass(hass) {
	    
	    this._hass = hass;
	    
	    if (this._drag.inProgress || this._isMenuOpen) return;
	    
	    // mise en pause (ou ne pas aller plus loin) si debug
	    if (skyThermostat.cycle >= 5) return;
        
        // recuperation des parametres
		this.valueConfTemp = "";
		if(this.config.comf_temp) {
            const stateConfTemp = hass.states[this.config.comf_temp];
            this.valueConfTemp = stateConfTemp ? stateConfTemp.state : '';
		}
		
		this.valueReduitTemp = "";
		if(this.config.slow_temp) {
            const stateReduitTemp = hass.states[this.config.slow_temp];
            this.valueReduitTemp = stateReduitTemp ? stateReduitTemp.state : '';
		}
		
		libCard.renderTicks(this);
		libCard.renderTemp(this);
        libCard.renderIco(this);
		
        //skyThermostat.cycle++;
        
	}
	
	// Méthode pour générer l'élément de configuration
    static getConfigElement(hass) {
        return document.createElement('sky-thermostat-editor');
    }
	
    static getStubConfig(hass) {
        // get available power entities
    }
	
	// Méthode pour récupérer la taille de la carte
    getCardSize() {
        return 1;
    }
  
}
customElements.define('sky-thermostat', skyThermostat);

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'sky-thermostat',
    name: 'sky thermostat',
    preview: true,
    description: 'A card to control entities from boiler',
});