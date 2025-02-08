/**********************************************/
/* "variable" permettant de lister les panels */
/* qui sont "expended"                        */
/**********************************************/
let expandedPanelsState = new Set(["subPanel_temp"]);

/**********************************************/
/* "variable" permettant de lister les events */
/* sur les objets et eviter de les recrer     */
/**********************************************/
export const eventHandlers = new WeakMap();

/**************************************/
/* fonctions permettant la traduction */
/* de l'editeur graphique             */
/**************************************/
let translations = {}; // Stocke les traductions chargées

export async function loadTranslations(appendTo) {
    const lang = appendTo._hass?.language || "en"; // Langue HA, ou "en" par défaut
    try {
        const response = await import(`./lang-${lang}.js`);
        translations = response.default;
    } catch (error) {
        console.error("Erreur de chargement de la langue :", error);
        const response = await import(`./lang-en.js`);
        translations = {};
    }
}

export function t(func, key) {
    return translations?.[func]?.[key] || `⚠️ ${func}.${key} ⚠️`; // Si absent, affiche une alerte visuelle
}

/*********************************/
/* fonction de rendu pricipale : */
/*********************************/
export function renderContent(appendTo) {
    
    
    const content = appendTo.shadowRoot.querySelector('#content');
        
    content.innerHTML = `
        <!-- TEMP REDUIT ET CONFORT -->
        <ha-expansion-panel outlined id="subPanel_temp" header="${t("temp", "header")}">
            <div class="col inner">
                <div class="cell">
                    <ha-entity-picker
                        label="${t("temp", "entity_slow")}"
                        id="slow_temp"
                        data-path="slow_temp"
                    >
                    </ha-entity-picker>
                </div>
                <div class="cell">
                    <ha-entity-picker
                        label="${t("temp", "entity_comf")}"
                        id="comf_temp"
                        data-path="comf_temp"
                    >
                    </ha-entity-picker>
                </div>
            </div>
        </ha-expansion-panel>
        
        <!-- ENTITES CHAUFFAGE -->
        <ha-expansion-panel outlined id="subPanel_header" header="${t("heating", "header")}">
            <div class="col inner">
                <div class="cell">
                    <ha-entity-picker
                        label="${t("heating", "entity_heating_mode")}"
                        id="entity_heating_mode"
                        data-path="heating_mode.entity"
                    >
                    </ha-entity-picker>
                </div>
                <div class="row cell">
                    
                    <ha-combo-box class="cell" 
                        label="${t("heating", "power")}" 
                        id="power_mode_value"
                        data-path="heating_mode.power" 
                    ></ha-combo-box>
                    
                    <ha-combo-box class="cell" 
                        label="${t("heating", "auto")}" 
                        id="auto_mode_value"
                        data-path="heating_mode.auto" 
                    ></ha-combo-box>
                    
                </div>
                <div class="row cell">
                    
                    <ha-combo-box class="cell" 
                        label="${t("heating", "comf")}" 
                        id="comf_mode_value"
                        data-path="heating_mode.comf" 
                    ></ha-combo-box>
                    
                    <ha-combo-box class="cell" 
                        label="${t("heating", "slow")}" 
                        id="slow_mode_value"
                        data-path="heating_mode.slow" 
                    ></ha-combo-box>
                    
                </div>
                
                <div class="cell">
                    <ha-entity-picker
                        label="${t("heating", "entity_heating_state")}"
                        id="entity_heating_state"
                        data-path="heating_state.entity"
                    >
                    </ha-entity-picker>
                </div>
                <div class="row cell">
                    
                    <ha-textfield 
                        class="cell"
                        label="${t("heating", "comf_val")}"
                        id="comf_state_value"
                        type="number"
                        min="0"
                        step="1"
                        data-path="heating_state.comf"
                    ></ha-textfield>
                    
                    <ha-textfield 
                        class="cell"
                        label="${t("heating", "slow_val")}"
                        id="slow_state_value"
                        type="number"
                        min="0"
                        step="1"
                        data-path="heating_state.slow"
                    ></ha-textfield>
                    
                </div>
            </div>
        </ha-expansion-panel>
        
        <!-- STATUS CHAUDIERE -->
        <ha-expansion-panel outlined id="subPanel_boiler" header="${t("boiler", "header")}">
            <div class="col inner">
                <div class="cell">
                    <ha-entity-picker
                        label="${t("boiler", "boiler_state")}"
                        id="boiler_state"
                        data-path="boiler_state"
                    >
                    </ha-entity-picker>
                </div>
                <div class="cell">
                    <ha-entity-picker
                        label="${t("boiler", "boiler_modulation")}"
                        id="boiler_modulation"
                        data-path="boiler_modulation"
                    >
                    </ha-entity-picker>
                </div>
            </div>
        </ha-expansion-panel>
    `;
    
    // Réappliquer l'attribut "expanded" aux panneaux qui l'avaient avant
    expandedPanelsState.forEach(id => {
        const panel = content.querySelector(`ha-expansion-panel#${id}`);
        if (panel) {
            panel.setAttribute("expanded", "");
        } else {
            panel.removeAttribute("expanded");
        }
    });
    
    // gestion ha-entity-picker "reduit"
    const slow_temp = content.querySelector('#slow_temp');
    slow_temp.value = appendTo._config?.slow_temp ?? "";
    slow_temp.hass = appendTo._hass;
    
    // gestion ha-entity-picker "confort"
    const comf_temp = content.querySelector('#comf_temp');
    comf_temp.value = appendTo._config?.comf_temp ?? "";
    comf_temp.hass = appendTo._hass; 
    
    // gestion ha-entity-picker "mode de chauffage"
    const entity_heating_mode = content.querySelector('#entity_heating_mode');
    const entityId = appendTo._config?.heating_mode?.entity ?? "";
    entity_heating_mode.value = entityId;
    entity_heating_mode.hass = appendTo._hass;
    entity_heating_mode.includeDomains = ["select"];
    
    // recuperation des valeurs possibles pour l'entité "mode de chauffage" selectionnée
    const entity = appendTo._hass?.states?.[entityId]
    const options = entity?.attributes?.options || [];
    
    // mise en correspondance des valeurs avec le mode de chauffage
    const power_mode_value = content.querySelector(`#power_mode_value`);
    power_mode_value.items = options.map(val => ({ label: val, value: val }));
    power_mode_value.value = appendTo._config?.heating_mode?.power ?? "";
    
    const auto_mode_value = content.querySelector(`#auto_mode_value`);
    auto_mode_value.items = options.map(val => ({ label: val, value: val }));
    auto_mode_value.value = appendTo._config?.heating_mode?.auto ?? "";
    
    const comf_mode_value = content.querySelector(`#comf_mode_value`);
    comf_mode_value.items = options.map(val => ({ label: val, value: val }));
    comf_mode_value.value = appendTo._config?.heating_mode?.comf ?? "";
    
    const slow_mode_value = content.querySelector(`#slow_mode_value`);
    slow_mode_value.items = options.map(val => ({ label: val, value: val }));
    slow_mode_value.value = appendTo._config?.heating_mode?.slow ?? "";
    
    // gestion ha-entity-picker "etat du chauffage"
    const entity_heating_state = content.querySelector('#entity_heating_state');
    entity_heating_state.value = appendTo._config?.heating_state?.entity ?? "";
    entity_heating_state.hass = appendTo._hass;
    
    // mise en correspondance des valeurs avec l'état du chauffage
    const comf_state_value = content.querySelector(`#comf_state_value`);
    comf_state_value.value = appendTo._config?.heating_state?.comf ?? "";
    
    const slow_state_value = content.querySelector(`#slow_state_value`);
    slow_state_value.value = appendTo._config?.heating_state?.slow ?? "";
    
    // gestion ha-entity-picker "reduit"
    const boiler_state = content.querySelector('#boiler_state');
    boiler_state.value = appendTo._config?.boiler_state ?? "";
    boiler_state.hass = appendTo._hass;
    
    // gestion ha-entity-picker "confort"
    const boiler_modulation = content.querySelector('#boiler_modulation');
    boiler_modulation.value = appendTo._config?.boiler_modulation ?? "";
    boiler_modulation.hass = appendTo._hass; 
    
    function trackExpansionState() {
        content.querySelectorAll("ha-expansion-panel").forEach(panel => {
            panel.addEventListener("expanded-changed", (event) => {
                if (event.detail.expanded) {
                    expandedPanelsState.add(panel.id); // Ajoute l'ID du panel s'il est expandu
                } else {
                    expandedPanelsState.delete(panel.id); // Supprime s'il est refermé
                }
            });
        });
    }
    trackExpansionState();
    
    
    attachInputs(appendTo)
}

/************************************************/
/* fonction de creation des events attachés aux */
/* differents inputs de l'interface puis tri et */
/* envoi pour mise a jour du yaml               */
/************************************************/
export function attachInputs(appendTo) {
    
    // Listener pour les `ha-entity-picker`
    appendTo.shadowRoot.querySelectorAll('ha-entity-picker').forEach((entityPicker) => {
        
        if (eventHandlers.has(entityPicker)) {
            //console.log("Événement déjà attaché à cet élément ha-entity-picker :", entityPicker);
            return; // Ne rien faire si l'événement est déjà attaché
        }
            
        // Créer un nouveau gestionnaire d'événements
        const handleChange = (e) => {
            const key = entityPicker.dataset.path; // Assurez-vous que le `name` correspond à la clé dans la config
            let value = e.detail.value;
            
            // Si la valeur est une chaîne vide, la valeur est "null"
            if (!value || value.trim() === "") {
                value = null; // Marquer pour suppression dans le YAML
            }
            
            if (key) {
                appendTo._config = updateConfigRecursively(appendTo._config, key, value, true);
                notifyConfigChange(appendTo);
            }
        }
        
        // Ajouter l'événement
        entityPicker.addEventListener("value-changed", handleChange);
        
        // Enregistrer le gestionnaire dans le WeakMap
        eventHandlers.set(entityPicker, handleChange);
        
    });
    
    // Listener pour les `ha-combo-box`
    appendTo.shadowRoot.querySelectorAll('ha-combo-box').forEach((comboBox) => {
        
        if (eventHandlers.has(comboBox)) {
            //console.log("Événement déjà attaché à cet élément ha-combo-box :", comboBox);
            return; // Ne rien faire si l'événement est déjà attaché
        }
        
        // Créer un nouveau gestionnaire d'événements
        const handleChange = (e) => {
            const key = comboBox.dataset.path;
            let value = e.detail.value;
            
            if (!value) {
                value = null; // Déclenche la suppression de la clé dans le YAML
            }
            
            // Mise à jour de la config si une clé est définie
            if (key) {
                appendTo._config = updateConfigRecursively(appendTo._config, key, value, true);
                notifyConfigChange(appendTo);
            }
        };
        
        // Ajouter l'événement
        comboBox.addEventListener("value-changed", handleChange);
        
        // Enregistrer le gestionnaire dans le WeakMap
        eventHandlers.set(comboBox, handleChange);
        
    });
    
    // Listener pour les `ha-textfield` sauf les champs "anchor"
    appendTo.shadowRoot.querySelectorAll('ha-textfield').forEach((textField) => {
        
        if (eventHandlers.has(textField)) {
            //console.log("Événement déjà attaché à cet élément ha-textfield :", textField);
            return; // Ne rien faire si l'événement est déjà attaché
        }
        
        // Créer un nouveau gestionnaire d'événements
        const handleChange = (e) => {
            const key = textField.dataset.path;
            let value = e.target.value;
    
            if (!value || isNaN(parseInt(value, 10))) {
                value = null; // Déclenche la suppression de la clé dans le YAML
            } else {
                value = parseInt(value, 10); // Convertir en entier si valide
            }
        
            // Mise à jour de la config si une clé est définie
            if (key) {
                appendTo._config = updateConfigRecursively(appendTo._config, key, value, true);
                notifyConfigChange(appendTo);
            }
            
            // Émettre un événement personnalisé pour signaler que la configuration a changé
            const event = new CustomEvent('config-changed', {
                detail: { redrawRequired: true }
            });
            document.dispatchEvent(event);
        };
        
        // Ajouter l'événement
        textField.addEventListener("change", handleChange);
        
        // Enregistrer le gestionnaire dans le WeakMap
        eventHandlers.set(textField, handleChange);
        
    });
    
}

/**********************************************/
/* fonction de modification de la config yaml */
/* en local (en fait l'array local)           */
/* renvoi la nouvelle confif pour mod du yaml */
/* via la fonction notifyConfigChange         */
/**********************************************/
export function updateConfigRecursively(obj, path, value, removeIfNull = false) {
    const cloneObject = (o) => {
        return Array.isArray(o)
            ? o.map(cloneObject)
            : o && typeof o === "object"
            ? { ...o }
            : o;
    };

    const keys = path.split('.');
    let clonedObj = cloneObject(obj);
    let current = clonedObj;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (i === keys.length - 1) {
            if (value === null && removeIfNull) {
                delete current[key]; // Supprime la clé si `null` et `removeIfNull` est vrai
            } else {
                current[key] = value; // Définit la nouvelle valeur
            }
            break;
        }

        if (!current[key]) {
            current[key] = {};
        }

        current[key] = cloneObject(current[key]);
        current = current[key];
    }

    // Suppression des clés vides (supprime les objets vides récursivement)
    const removeEmptyKeys = (obj) => {
        for (const key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                if (Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                } else {
                    removeEmptyKeys(obj[key]);
                }
            }
        }
    };

    removeEmptyKeys(clonedObj);
    return clonedObj;
}

/***********************************/
/* fonction de mise à jour du yaml */
/***********************************/
export function notifyConfigChange(appendTo) {
    const event = new Event('config-changed', {
        bubbles: true,
        composed: true,
    });
    
    //console.log(appendTo._config);
    
    event.detail = { config: appendTo._config };
    appendTo.dispatchEvent(event);
}