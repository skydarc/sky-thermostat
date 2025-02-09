import * as libCalc from './lib-calc.js';
import * as libSvg from './lib-svg.js';

/**************************************/
/* fonctions permettant la traduction */
/* de l'interface                     */
/**************************************/
let translations = {}; // Stocke les traductions chargées

export async function loadTranslations(appendTo) {
    if(!appendTo._hass) return;
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
    return translations?.[func]?.[key] || ''; // Si absent, affiche une alerte visuelle
}


export function renderBase(appendTo) {
    
    appendTo.lblConfortPosition = [appendTo.properties.radius, appendTo.properties.ticksOuterRadius - (appendTo.properties.ticksOuterRadius - appendTo.properties.ticksInnerRadius) / 2];
    
    appendTo.offsetDegrees = 180 - (360 - appendTo.options.tickDegrees) / 2;
    
    appendTo.theta = appendTo.options.tickDegrees / appendTo.options.numTicks;
	
    appendTo.svgElem = libCalc.createSVGElement('svg', {
            version: "1.0",
    	    encoding: "UTF-8",
            width: '100%',
        	height: '100%', 
        	viewBox: '0 0 ' + appendTo.options.diameter + ' ' + appendTo.options.diameter,
        	class: 'dial  has-icone' 
        },appendTo.content
    );
    
    // blur effect
	appendTo.blurEffect = libCalc.createSVGElement('filter', {
			x: '-50%',
    		y: '-50%',
    		width: '200%',
    		height: '200%',
    		id: 'blur'
		},appendTo.svgElem
	);
	appendTo.gaussianBlur = libCalc.createSVGElement('feGaussianBlur', {
			stdDeviation: '5'
		},appendTo.blurEffect
	);
	
	// grad flame
	/*appendTo.gradFlam = libCalc.createSVGElement('radialGradient', {
			id: 'gradFlam',
			cx: '50%',
    		cy: '50%',
    		r: '50%'
		},appendTo.svgElem
	);
	appendTo.col1_gradFlam = libCalc.createSVGElement('stop', {
			'stop-color': '#440',
			offset: '10%'
		},appendTo.gradFlam
	);
	appendTo.col2_gradFlam = libCalc.createSVGElement('stop', {
			'stop-color': '#400',
			offset: '60%'
		},appendTo.gradFlam
	);
	appendTo.col3_gradFlam = libCalc.createSVGElement('stop', {
			'stop-color': '#000',
			offset: '100%'
		},appendTo.gradFlam
	);*/
	
	// grad icon flam
	libSvg.addGradFlamIcon(appendTo);
	
	libSvg.addGradLeafIcon(appendTo);
    
    // CERCLE FOND NOIR
    appendTo.circleElem = libCalc.createSVGElement('circle', {
    		cx: appendTo.properties.radius,
    		cy: appendTo.properties.radius,
    		r: appendTo.properties.radius,
    		class: 'dial__shape' 
    	},appendTo.svgElem
    );
    
    // path accueillant l'icone principale
    appendTo.icoPath = libCalc.createSVGElement('path', {
            class: 'dial__icon'
        },appendTo.svgElem
    );
    
    // mode auto
    appendTo.lblAuto = libCalc.createSVGElement('text', {
            id: 'dial__lbl--auto',
    		class: 'dial__lbl dial__lbl--auto'
    	},appendTo.svgElem
    );
    
	// status chaudierer
    appendTo.lblStatus = libCalc.createSVGElement('text', {
            id: 'dial__lbl--status',
    		class: 'dial__lbl dial__lbl--status'
    	},appendTo.svgElem
    );
        
    // modulation chaudiere
    appendTo.lblModulation = libCalc.createSVGElement('text', {
            id: 'dial__lbl--modulation',
    		class: 'dial__lbl dial__lbl--modulation'
    	},appendTo.svgElem
    );
    
    // cercle blanc indicateur de controle
    appendTo.editCircle = libCalc.createSVGElement('path', {
		    d: libCalc.donutPath(appendTo.properties.radius, appendTo.properties.radius, appendTo.properties.radius - 4, appendTo.properties.radius - 8),
	        class: 'dial__editableIndicator'
        },appendTo.svgElem
	);
	
	// MASQUE DE FLOU GAUSSIEN (cercle ou l'on va appliquer le flou)
    appendTo.blur_mask = libCalc.createSVGElement('circle', {
    		cx: appendTo.properties.radius,
    		cy: appendTo.properties.radius,
    		r: appendTo.properties.blur_radius,
    		class: 'dial__mask' 
    	},appendTo.svgElem
    );
    
    // GRADUATION (creation des "ticks" dans array pour repartition plus tard)
    appendTo.ticks = libCalc.createSVGElement('g', {
	        class: 'dial__ticks' 
	    },appendTo.svgElem
	);
	
	appendTo.tickPoints = [
		[appendTo.properties.radius - 1, appendTo.properties.ticksOuterRadius],
		[appendTo.properties.radius + 1, appendTo.properties.ticksOuterRadius],
		[appendTo.properties.radius + 1, appendTo.properties.ticksInnerRadius],
	    [appendTo.properties.radius - 1, appendTo.properties.ticksInnerRadius]
	];
	
	appendTo.tickPointsLarge = [
		[appendTo.properties.radius - 1.5, appendTo.properties.ticksOuterRadius],
		[appendTo.properties.radius + 1.5, appendTo.properties.ticksOuterRadius],
		[appendTo.properties.radius + 1.5, appendTo.properties.ticksInnerRadius + 20],
	    [appendTo.properties.radius - 1.5, appendTo.properties.ticksInnerRadius + 20]
	];
	
	appendTo.tickArray = [];
	for (var iTick = 0; iTick < appendTo.options.numTicks; iTick++) {
		appendTo.tickArray.push(libCalc.createSVGElement('path', { d: libCalc.pointsToPath(appendTo.tickPoints) }, appendTo.ticks));
	}
	
	// temp affichage central
    appendTo.lblTarget = libCalc.createSVGElement('text', {
            id: 'dial__lbl--target',
    		x: appendTo.properties.radius,
    		y: appendTo.properties.radius,
    		class: 'dial__lbl dial__lbl--target' 
    	},appendTo.svgElem
    );
    appendTo.lblTarget.textContent =  "----";

	// temp confort
	appendTo.lblConfort = libCalc.createSVGElement('text', {
	        id: 'dial__lbl--confort',
	        class: 'dial__lbl dial__lbl--confort'
	    },appendTo.svgElem
	);

	// temp reduite
	appendTo.lblReduit = libCalc.createSVGElement('text', {
	        id: 'dial__lbl--reduit',
	        class: 'dial__lbl dial__lbl--reduit'
	    },appendTo.svgElem
	);
	
	// div accueillant le menu conf
	appendTo.divElem = document.createElement('div');
    appendTo.divElem.setAttribute('id', 'divElem');
    appendTo.content.appendChild(appendTo.divElem);
    
	// ajout des events sur les temperatures "reduites" et "confort"
	appendTo.lblReduit.addEventListener('mousedown', () => dragStart(1, appendTo));
    appendTo.lblReduit.addEventListener('touchstart', () => dragStart(1, appendTo));
    appendTo.lblConfort.addEventListener('mousedown', () => dragStart(2, appendTo));
    appendTo.lblConfort.addEventListener('touchstart', () => dragStart(2, appendTo));
        
    appendTo.svgElem.addEventListener('mouseup', () => dragEnd(appendTo));
	appendTo.svgElem.addEventListener('mouseleave', () => dragEnd(appendTo));
	appendTo.svgElem.addEventListener('touchend', () => dragEnd(appendTo));
		
	appendTo.svgElem.addEventListener('mousemove', (ev) => dragMove(ev, appendTo));
	appendTo.svgElem.addEventListener('touchmove', (ev) => dragMove(ev, appendTo));
	
	// ajout de l'event pour ouverture du menu
	appendTo.lblTarget.addEventListener('click', () => renderConf(appendTo));
        
	

}

export function renderTicks(appendTo) {
    
    // recuperation du mode de chauffage : off - auto - confort - reduit
    const heating_mode = appendTo._hass.states[appendTo.config?.heating_mode?.entity];
    appendTo.heating_mode_value = heating_mode ? heating_mode.state : '';
    
	var	vMin = Math.min(appendTo.valueConfTemp, appendTo.valueReduitTemp);
	var	vMax = Math.max(appendTo.valueConfTemp, appendTo.valueReduitTemp);

	var min = libCalc.restrictToRange(Math.round((vMin - appendTo.options.minValue) / appendTo.properties.rangeValue * appendTo.options.numTicks), 0, appendTo.options.numTicks - 1);
	var max = libCalc.restrictToRange(Math.round((vMax - appendTo.options.minValue) / appendTo.properties.rangeValue * appendTo.options.numTicks), 0, appendTo.options.numTicks - 1);
		
	var minTrue = libCalc.restrictToRange(Math.round((appendTo.valueReduitTemp - appendTo.options.minValue) / appendTo.properties.rangeValue * appendTo.options.numTicks), 0, appendTo.options.numTicks - 1);
	var maxTrue = libCalc.restrictToRange(Math.round((appendTo.valueConfTemp - appendTo.options.minValue) / appendTo.properties.rangeValue * appendTo.options.numTicks), 0, appendTo.options.numTicks - 1);
	
	appendTo.tickArray.forEach(function (tick, iTick) {
		var isLarge = iTick == min || iTick == max;
		var isActive = iTick >= min && iTick <= max;
		var isMin = iTick == minTrue;
		var isMax = iTick == maxTrue;
		
		if(appendTo.heating_mode_value == appendTo.config?.heating_mode?.power || appendTo.valueConfTemp == "" || appendTo.valueReduitTemp == "" ) {
		    
		    // si chaudiere eteinte, les graduations sont "simples"
		    libCalc.attr(tick, {
    			d: libCalc.pointsToPath(libCalc.rotatePoints(appendTo.tickPoints, iTick * appendTo.theta - appendTo.offsetDegrees, [appendTo.properties.radius, appendTo.properties.radius])),
    		});
		    
	    } else {
	        
	        // sinon on affiche la plage de reglage et les limites
    		libCalc.attr(tick, {
    			d: libCalc.pointsToPath(libCalc.rotatePoints(isLarge ? appendTo.tickPointsLarge : appendTo.tickPoints, iTick * appendTo.theta - appendTo.offsetDegrees, [appendTo.properties.radius, appendTo.properties.radius])),
    		    class: isMax ? 'max' : (isMin ? 'min' : (isActive ? 'active' : ''))
    		});
	    }
	});
}

export function renderTemp(appendTo) {
    
    const lbl_text_conf = appendTo.svgElem.querySelector('#dial__lbl--confort');
    const lbl_text_red = appendTo.svgElem.querySelector('#dial__lbl--reduit');
    
    
    // si la chaudiere est eteinte, pas d'affichages des temperatures de reglage
    if(appendTo.heating_mode_value == appendTo.config?.heating_mode?.power) {
        
        lbl_text_conf.textContent = "";
    	lbl_text_red.textContent = "";
    	
        return;
        
    } else {

		// si les valeurs de temperatures de reglage ne sont pas encore pretes on annule ce tour
		if(isNaN(appendTo.valueConfTemp) || isNaN(appendTo.valueReduitTemp) || appendTo.valueConfTemp == "" || appendTo.valueReduitTemp == "") return;
            
        lbl_text_conf.textContent = parseFloat(appendTo.valueConfTemp).toFixed(1);
    	lbl_text_red.textContent = parseFloat(appendTo.valueReduitTemp).toFixed(1);
    	
    	// on s'assure que les temperatures sont dans la bonne plage
        var peggedValue_conf = libCalc.restrictToRange(appendTo.valueConfTemp, appendTo.options.minValue, appendTo.options.maxValue);
        var peggedValue_red = libCalc.restrictToRange(appendTo.valueReduitTemp, appendTo.options.minValue, appendTo.options.maxValue);
        
        // position en degré du "marqueur" de temperature 
		var degs_conf = appendTo.options.tickDegrees * (peggedValue_conf - appendTo.options.minValue) / appendTo.properties.rangeValue - appendTo.offsetDegrees;
		var degs_red = appendTo.options.tickDegrees * (peggedValue_red - appendTo.options.minValue) / appendTo.properties.rangeValue - appendTo.offsetDegrees;
		
		// decallage de la position pour une meilleur lecture
		if (peggedValue_conf > appendTo.valueReduitTemp ) {
        	degs_conf += 9;
        } else {
        	degs_conf -= 9;
        }
        		
        if (peggedValue_red > appendTo.valueConfTemp ) {
        	degs_red += 9;
        } else {
        	degs_red -= 9;
        }

        // position x-y de l'affichage des temperature
		var pos_conf = libCalc.rotatePoint(appendTo.lblConfortPosition, degs_conf, [appendTo.properties.radius, appendTo.properties.radius]);
		var pos_red = libCalc.rotatePoint(appendTo.lblConfortPosition, degs_red, [appendTo.properties.radius, appendTo.properties.radius]);
		
			
		libCalc.attr(lbl_text_conf, {
			x: pos_conf[0],
		    y: pos_conf[1] 
		});
			
		libCalc.attr(lbl_text_red, {
			x: pos_red[0],
		    y: pos_red[1] 
		});
			
	}
}
		
export function renderIco(appendTo) {
    
    // on supprime l'icone precedente    	
    appendTo.icoPath.removeAttribute("d");
    appendTo.icoPath.removeAttribute("transform");
    appendTo.icoPath.removeAttribute("style");
    
    // recuperation du mode de chauffage : off - auto - confort - reduit
    const heating_mode = appendTo._hass.states[appendTo.config?.heating_mode?.entity];
    appendTo.heating_mode_value = heating_mode ? heating_mode.state : '';
    
    // recuperation du mot binaire de l'etat du chauffage:
    // 0b00010000 - reduit 16
    // 0b00100000 - confort 32
    // 0b10000000 - vacances 128 
    const heating_state = appendTo._hass.states[appendTo.config?.heating_state?.entity];
    appendTo.heating_state_value = heating_state ? heating_state.state : '';
    
    const isReduced = (appendTo.heating_state_value & appendTo.config?.heating_state?.slow) === appendTo.config?.heating_state?.slow; // Vérifie si le bit 5 est à 1
    const isComfort = (appendTo.heating_state_value & appendTo.config?.heating_state?.comf) === appendTo.config?.heating_state?.comf; // Vérifie si le bit 6 est à 1
    //const isVac = (appendTo.heating_state_value & 128) === 128; // Vérifie si le bit 8 est à 1

    // creation de l'icone correspondante:
    if(appendTo.heating_mode_value == appendTo.config?.heating_mode?.power){
        
        // si "off"
        addCenteredMdiIcon("power", appendTo);
        
    } else {
        
        // si auto sur "on"
        if(appendTo.heating_mode_value == appendTo.config?.heating_mode?.auto) {
            
            // afficher auto au dessus de l'icone principale
            const lbl_text_auto = appendTo.svgElem.querySelector('#dial__lbl--auto');
		
            lbl_text_auto.textContent = "AUTO";
            libCalc.attr(lbl_text_auto, {
            		x: appendTo.properties.radius,
            		y: appendTo.properties.radius*0.60
            	}
            );
            
        } else {
            
            // sinon on efface 'auto'
            const lbl_text_auto = appendTo.svgElem.querySelector('#dial__lbl--auto');
            lbl_text_auto.textContent = "";
        }
        
        // affichage de l'icone prevue
        if (isReduced) {
            addCenteredMdiIcon("leaf", appendTo);
        } else if (isComfort) {
            addCenteredMdiIcon("fire", appendTo);
        //} else if (isVac) {
            //addCenteredMdiIcon("vac", appendTo);
        } else {
            addCenteredMdiIcon("", appendTo);
        }
        
        
        // STATUS CHAUDIERE
        if(appendTo.config.boiler_state) {
            const boiler_state = appendTo._hass.states[appendTo.config.boiler_state];
            const boiler_state_value = boiler_state ? boiler_state.state : '';
            
            const lbl_text_status = appendTo.svgElem.querySelector('#dial__lbl--status');
            //const statusArray = ['R\u00E9amorcage', 'D\u00E9marrage', 'Allumage', 'Allumage stab', 'Combustion', 'Fin comb.', 'Arr\u00EAt', 'Aspi.', '! Cendre !', '! Pellets !', 'Pell. switch', 'erreur', '\u00C9talonner'];
            
            lbl_text_status.textContent = boiler_state_value;
            //lbl_text_status.textContent = statusArray[boiler_state_value];
            libCalc.attr(lbl_text_status, {
            		x: appendTo.properties.radius,
            		y: appendTo.properties.radius*1.4
            	}
            );
        }
        
        // MODULATION
        if(appendTo.config.boiler_modulation) {
            const boiler_modulation = appendTo._hass.states[appendTo.config.boiler_modulation];
            const boiler_modulation_value = boiler_modulation ? boiler_modulation.state : '';
            
            const lbl_text_modulation = appendTo.svgElem.querySelector('#dial__lbl--modulation');
    		
            lbl_text_modulation.textContent = boiler_modulation_value + "%";
            libCalc.attr(lbl_text_modulation, {
            		x: appendTo.properties.radius,
            		y: appendTo.properties.radius*1.52
            	}
            );
        }
        
    }
    
}

function addCenteredMdiIcon(iconName, appendTo) {
    
    if(iconName !== "" ) {
        const { path: mdiPath, scale, offsetY, color } = libSvg.mdiIcons[iconName];
    
        appendTo.icoPath.setAttribute("d", mdiPath);
        appendTo.icoPath.setAttribute("style", "fill:"+color);
    
        // Récupérer la taille originale (boîte englobante)
        const originalWidth = 24 * scale;
        const originalHeight = (24 - offsetY) * scale;
        
        // Calcul du centre du SVG
        const centerX = appendTo.properties.radius;
        const centerY = appendTo.properties.radius;
    
        // Calcul du déplacement pour centrer l'icône
        const finalOffsetX = centerX - (originalWidth) / 2;
        const finalOffsetY = centerY - (originalHeight) / 2;
    
        // Appliquer la transformation (déplacement + mise à l'échelle)
        appendTo.icoPath.setAttribute("transform", `translate(${finalOffsetX},${finalOffsetY}) scale(${scale})`);
        
    } else {
        appendTo.icoPath.setAttribute("d", "");
    }

}

export function eventPosition(event, appendTo) {
	let rect = appendTo.svgElem.getBoundingClientRect();
	if (event.targetTouches && event.targetTouches.length) {
		var x = event.targetTouches[0].clientX - rect.left - appendTo.svgElem.clientWidth/2;
		var y = event.targetTouches[0].clientY - rect.top - appendTo.svgElem.clientHeight/2;
	} else {
		var x = event.clientX - rect.left - appendTo.svgElem.clientWidth/2;
		var y = event.clientY - rect.top - appendTo.svgElem.clientHeight/2;
	}
	return [Math.floor(x) , Math.floor(-y) ];
}
        
export function dragStart(origine, appendTo) {
    
    if (appendTo._isMenuOpen) return;
    
	appendTo.startDelay = setTimeout(function () {
	    
	    libCalc.setClass(appendTo.svgElem, 'dial--edit', true);
		
		const lbl_text_target = appendTo.svgElem.querySelector('#dial__lbl--target');
		if(origine == 1) lbl_text_target.textContent = parseFloat(appendTo.valueReduitTemp).toFixed(1);
		else lbl_text_target.textContent = parseFloat(appendTo.valueConfTemp).toFixed(1);
		
		appendTo.icoPath.setAttribute("filter", "url(#blur)");
		appendTo.lblAuto.setAttribute("filter", "url(#blur)");
		appendTo.lblStatus.setAttribute("filter", "url(#blur)");
		appendTo.lblModulation.setAttribute("filter", "url(#blur)");
		
		appendTo._drag.inProgress = true;
		appendTo._drag.origine = origine;
	}, 1000);
};
		
export function dragEnd(appendTo) {
    
	clearTimeout(appendTo.startDelay);
		
	libCalc.setClass(appendTo.svgElem, 'dial--edit', false);
	if (!appendTo._drag.inProgress || appendTo._isMenuOpen) return;
    appendTo._drag.inProgress = false;
    
    appendTo.icoPath.removeAttribute("filter");
    appendTo.lblAuto.removeAttribute("filter");
	appendTo.lblStatus.removeAttribute("filter");
	appendTo.lblModulation.removeAttribute("filter");
            
    let entityID;
    let domain;
    let newTemp;
            
    if(appendTo._drag.origine == 1) {
                
        entityID = appendTo.config.reduit_temp;
        domain = entityID.split('.')[0];
        newTemp = appendTo.valueReduitTemp;
                
    } else if(appendTo._drag.origine == 2) {
            
        entityID = appendTo.config.conf_temp;
        domain = entityID.split('.')[0];
        newTemp = appendTo.valueConfTemp;
                
    }    
                
    appendTo._hass.callService(domain, 'set_value', {
        entity_id: entityID,
        value: newTemp
    });
            
            
};
		
export function dragMove(ev, appendTo) {
    ev.preventDefault();
    if (!appendTo._drag.inProgress || appendTo._isMenuOpen) return;
    var evPos = eventPosition(ev, appendTo);
		    
    var theta_newVal = -(90 + (360-appendTo.options.tickDegrees)/2 ) + (Math.atan2(evPos[1], evPos[0]) * 180/Math.PI) * -1;
	if (theta_newVal < 0) { theta_newVal += 360; }
	const r_newVal = Math.sqrt(evPos[0]*evPos[0] + evPos[1]*evPos[1]);

	let new_temp = (appendTo.options.maxValue - appendTo.options.minValue) * (theta_newVal / appendTo.options.tickDegrees) + appendTo.options.minValue;
			
	const gape = ((360 - appendTo.options.tickDegrees) * appendTo.properties.rangeValue ) / (appendTo.options.tickDegrees * 2);
	
    if(new_temp > (appendTo.options.maxValue + gape)) new_temp = appendTo.options.minValue;
    else if(new_temp > appendTo.options.maxValue) new_temp = appendTo.options.maxValue;
			
	if(appendTo._drag.origine == 1) {
	    
        const lbl_text_red = appendTo.svgElem.querySelector('#dial__lbl--reduit');
			    
	    appendTo.valueReduitTemp = parseFloat(new_temp).toFixed(1);
	    lbl_text_red.textContent = appendTo.valueReduitTemp;

	} else if(appendTo._drag.origine == 2) {
			    
	    const lbl_text_conf = appendTo.svgElem.querySelector('#dial__lbl--confort');
    			
		appendTo.valueConfTemp = parseFloat(new_temp).toFixed(1);
		lbl_text_conf.textContent = appendTo.valueConfTemp;

	}
			
	const lbl_text_target = appendTo.svgElem.querySelector('#dial__lbl--target');
	lbl_text_target.textContent = parseFloat(new_temp).toFixed(1);
			
	renderTicks(appendTo);
    renderTemp(appendTo);
}

export function renderConf(appendTo) {
    
    if (appendTo._isMenuOpen) return;
    
    appendTo._isMenuOpen = true;
    
    const heating_mode_entity = appendTo._hass.states[appendTo.config.heating_mode.entity];
    appendTo.heating_mode_value = heating_mode_entity ? heating_mode_entity.state : '';
    
    appendTo.icoPath.setAttribute("filter", "url(#blur)");
	appendTo.lblAuto.setAttribute("filter", "url(#blur)");
	appendTo.lblStatus.setAttribute("filter", "url(#blur)");
	appendTo.lblModulation.setAttribute("filter", "url(#blur)");
	appendTo.lblConfort.setAttribute("filter", "url(#blur)");
	appendTo.lblReduit.setAttribute("filter", "url(#blur)");
	appendTo.ticks.setAttribute("filter", "url(#blur)");
	
	appendTo.confElem = document.createElement('div');
    appendTo.confElem.setAttribute('id', 'confElem');
    appendTo.confElem.setAttribute('class', 'confElem');
    appendTo.divElem.appendChild(appendTo.confElem);
    
    let confButton;
    if(appendTo.heating_mode_value == appendTo.config.heating_mode.comf) confButton = renderButton('disableButtonElem', 'mdi:fire', '', 150, 0.65, 1, appendTo);
    else confButton = renderButton('buttonElem', 'mdi:fire', '', 150, 0.65, 1, appendTo);
    confButton.addEventListener('mouseup', () => {
        closeConf("conf", appendTo);
    });
    
    let autoButton;
    if(appendTo.heating_mode_value == appendTo.config.heating_mode.auto) autoButton = renderButton('disableButtonElem', '', 'AUTO', 90, 0.65, 1.8, appendTo);
    else autoButton = renderButton('buttonElem', '', 'AUTO', 90, 0.65, 1.8, appendTo);
    autoButton.addEventListener('mouseup', () => {
        closeConf("auto", appendTo);
    });
    
    let slowButton;
    if(appendTo.heating_mode_value == appendTo.config.heating_mode.slow) slowButton = renderButton('disableButtonElem', 'mdi:leaf', '', 30, 0.65, 1, appendTo);
    else slowButton = renderButton('buttonElem', 'mdi:leaf', '', 30, 0.65, 1, appendTo);
    slowButton.addEventListener('mouseup', () => {
        closeConf("slow", appendTo);
    });
    
    let powerButton;
    if(appendTo.heating_mode_value == appendTo.config.heating_mode.power) powerButton = renderButton('disableButtonElem', 'mdi:power', '', -30, 0.65, 1, appendTo);
    else powerButton = renderButton('buttonElem', 'mdi:power', '', -30, 0.65, 1, appendTo);
    powerButton.addEventListener('mouseup', () => {
        closeConf("power", appendTo);
    });
    
    const backButton = renderButton('buttonElem', 'mdi:arrow-left-top', '', 210, 0.65, 1, appendTo);
	backButton.addEventListener('mouseup', () => {
        closeConf("back", appendTo);
    });
	
	
	
	appendTo.confElem.setAttribute('style', 'background-color: #000000d6');
}
        
function renderButton(className, nameIcon, titre, angle, rayon, sizeFactor, appendTo) {
		    
    const rect = appendTo.confElem.getBoundingClientRect();
            
    const buttonElem = document.createElement('div');
    buttonElem.setAttribute('class', className); //'buttonElem');
    appendTo.confElem.appendChild(buttonElem);
    
    const iconElem = document.createElement('ha-icon');
    if(nameIcon !== "") {
        iconElem.setAttribute('class', 'iconElem');
        iconElem.setAttribute('icon', nameIcon);
        buttonElem.appendChild(iconElem);
    }
    
    const titleElem = document.createElement('p');
    if(nameIcon !== "") titleElem.setAttribute('class', 'titre');
    else titleElem.setAttribute('class', 'titreOnly');
    titleElem.innerHTML = titre;
    buttonElem.appendChild(titleElem);
    
    const start_x = (rect.width/2) + (2 * (rect.width/2) * Math.cos(angle * Math.PI / 180) );
    const start_y = (rect.height/2) - (2 * (rect.height/2) * Math.sin(angle * Math.PI / 180) );
            
    const x = (rect.width/2) + (rayon * (rect.width/2) * Math.cos(angle * Math.PI / 180) );
    const y = (rect.height/2) - (rayon * (rect.height/2) * Math.sin(angle * Math.PI / 180) );
            
    buttonElem.style.left = start_x - (appendTo.options.sizeProgIcon/2) + "px";
    buttonElem.style.top = start_y - (appendTo.options.sizeProgIcon/2) + "px";
    
    buttonElem.setAttribute('angle', angle);
    
    setTimeout(() => {
        buttonElem.style.left = x - (appendTo.options.sizeProgIcon/2) + "px";
        buttonElem.style.top = y - (appendTo.options.sizeProgIcon/2) + "px";
        buttonElem.style.height = appendTo.options.sizeProgIcon + "px";
        buttonElem.style.width = appendTo.options.sizeProgIcon + "px";
        buttonElem.style.opacity = "1";
        buttonElem.style.fontSize = sizeFactor +"em";
        
        if(nameIcon !== "") {
            iconElem.style.left = (appendTo.options.sizeProgIcon * ( 1 - sizeFactor))/2 + "px";
            iconElem.style.top = (appendTo.options.sizeProgIcon * ( 1 - sizeFactor))/2 + "px";
            iconElem.style.height = appendTo.options.sizeProgIcon*sizeFactor + "px";
            iconElem.style.width = appendTo.options.sizeProgIcon*sizeFactor + "px";
        }
        
    }, 10);
            
    return buttonElem;
}

export function closeConf(cmd, appendTo) {
    
    appendTo._isMenuOpen = false;
	
	const rect = appendTo.confElem.getBoundingClientRect();
	
	appendTo.confElem.setAttribute('style', 'background-color: #0000');
	
	appendTo.confElem.querySelectorAll("div").forEach(button => {
	    
	    const angle = button.getAttribute('angle');
	    
	    const out_x = (rect.width/2) + (1.5 * (rect.width/2) * Math.cos(angle * Math.PI / 180) );
        const out_y = (rect.height/2) - (1.5 * (rect.height/2) * Math.sin(angle * Math.PI / 180) );

        button.style.left = out_x - (appendTo.options.sizeProgIcon/2) + "px";
        button.style.top = out_y - (appendTo.options.sizeProgIcon/2) + "px";
    });
    
    setTimeout(() => {
    
        appendTo.icoPath.removeAttribute("filter");
    	appendTo.lblAuto.removeAttribute("filter");
    	appendTo.lblStatus.removeAttribute("filter");
    	appendTo.lblModulation.removeAttribute("filter");
    	appendTo.lblConfort.removeAttribute("filter");
    	appendTo.lblReduit.removeAttribute("filter");
    	appendTo.ticks.removeAttribute("filter");
    	
    	appendTo.confElem.remove();
    }, 200);
    
    
    if(cmd == "power") {
        
        appendTo._hass.callService('select', 'select_option', {
            entity_id: appendTo.config.heating_mode.entity,//'select.pellematic_heating_circuit_1_mode_auto',
            option: appendTo.config.heating_mode.power
        });
        
    } else if(cmd == "auto") {
        
        appendTo._hass.callService('select', 'select_option', {
            entity_id: appendTo.config.heating_mode.entity,//'select.pellematic_heating_circuit_1_mode_auto',
            option: appendTo.config.heating_mode.auto
        });
        
    } else if(cmd == "conf") {
        
        appendTo._hass.callService('select', 'select_option', {
            entity_id: appendTo.config.heating_mode.entity,//'select.pellematic_heating_circuit_1_mode_auto',
            option: appendTo.config.heating_mode.comf
        });
        
    } else if(cmd == "slow") {
        
        appendTo._hass.callService('select', 'select_option', {
            entity_id: appendTo.config.heating_mode.entity,//'select.pellematic_heating_circuit_1_mode_auto',
            option: appendTo.config.heating_mode.slow
        });
        
    }
    
}




export function renderDhwBase(appendTo) {
    
    appendTo.lblConfortPosition = [appendTo.properties.radius, appendTo.properties.ticksOuterRadius - (appendTo.properties.ticksOuterRadius - appendTo.properties.ticksInnerRadius) / 2];
    
    appendTo.offsetDegrees = 180 - (360 - appendTo.options.tickDegrees) / 2;
    
    appendTo.theta = appendTo.options.tickDegrees / appendTo.options.numTicks;
	
    appendTo.svgElem = libCalc.createSVGElement('svg', {
            version: "1.0",
    	    encoding: "UTF-8",
            width: '100%',
        	height: '100%', 
        	viewBox: '0 0 ' + appendTo.options.diameter + ' ' + appendTo.options.diameter,
        	class: 'dial  has-icone' 
        },appendTo.content
    );
    
    // blur effect
	appendTo.blurEffect = libCalc.createSVGElement('filter', {
			x: '-50%',
    		y: '-50%',
    		width: '200%',
    		height: '200%',
    		id: 'blur'
		},appendTo.svgElem
	);
	appendTo.gaussianBlur = libCalc.createSVGElement('feGaussianBlur', {
			stdDeviation: '5'
		},appendTo.blurEffect
	);
	
	// grad icon flam
	libSvg.addGradFlamIcon(appendTo);
	
    // CERCLE FOND NOIR
    appendTo.circleElem = libCalc.createSVGElement('circle', {
    		cx: appendTo.properties.radius,
    		cy: appendTo.properties.radius,
    		r: appendTo.properties.radius,
    		class: 'dial__shape' 
    	},appendTo.svgElem
    );
    
    // path accueillant l'icone principale
    appendTo.icoPath = libCalc.createSVGElement('path', {
            class: 'dial__icon'
        },appendTo.svgElem
    );
    
    // mode auto
    appendTo.lblMode = libCalc.createSVGElement('text', {
            id: 'dial__lbl--mode',
    		class: 'dial__lbl dial__lbl--mode'
    	},appendTo.svgElem
    );
    
    // cercle blanc indicateur de controle
    appendTo.editCircle = libCalc.createSVGElement('path', {
		    d: libCalc.donutPath(appendTo.properties.radius, appendTo.properties.radius, appendTo.properties.radius - 4, appendTo.properties.radius - 8),
	        class: 'dial__editableIndicator'
        },appendTo.svgElem
	);
	
	// MASQUE DE FLOU GAUSSIEN (cercle ou l'on va appliquer le flou)
    appendTo.blur_mask = libCalc.createSVGElement('circle', {
    		cx: appendTo.properties.radius,
    		cy: appendTo.properties.radius,
    		r: appendTo.properties.blur_radius,
    		class: 'dial__mask' 
    	},appendTo.svgElem
    );
    
    // GRADUATION (creation des "ticks" dans array pour repartition plus tard)
    appendTo.ticks = libCalc.createSVGElement('g', {
	        class: 'dial__ticks' 
	    },appendTo.svgElem
	);
	
	appendTo.tickIndic = libCalc.createSVGElement('g', {
	        class: 'dial__ticks' 
	    },appendTo.svgElem
	);
	
	appendTo.tickPoints = [
		[appendTo.properties.radius - 1, appendTo.properties.ticksOuterRadius],
		[appendTo.properties.radius + 1, appendTo.properties.ticksOuterRadius],
		[appendTo.properties.radius + 1, appendTo.properties.ticksInnerRadius],
	    [appendTo.properties.radius - 1, appendTo.properties.ticksInnerRadius]
	];
	
	appendTo.tickPointsLarge = [
		[appendTo.properties.radius - 1.5, appendTo.properties.ticksOuterRadius],
		[appendTo.properties.radius + 1.5, appendTo.properties.ticksOuterRadius],
		[appendTo.properties.radius + 1.5, appendTo.properties.ticksInnerRadius + 20],
	    [appendTo.properties.radius - 1.5, appendTo.properties.ticksInnerRadius + 20]
	];
	
	appendTo.tickPointsIndic = [
	    [appendTo.properties.radius, appendTo.properties.ticksInnerRadius + 6],
		[appendTo.properties.radius + 6, appendTo.properties.ticksInnerRadius + 15],
		[appendTo.properties.radius - 6, appendTo.properties.ticksInnerRadius + 15]
	];
	
	appendTo.tickArray = [];
	for (var iTick = 0; iTick < appendTo.options.numTicks; iTick++) {
		appendTo.tickArray.push(libCalc.createSVGElement('path', { d: libCalc.pointsToPath(appendTo.tickPoints) }, appendTo.ticks));
	}
	appendTo.tickIndicArray = [];
	appendTo.tickIndicArray.push(libCalc.createSVGElement('path', { d: libCalc.pointsToPath(appendTo.tickPointsIndic) }, appendTo.tickIndic));
	
	// temp current
    appendTo.lblCurrent = libCalc.createSVGElement('text', {
            id: 'dial__lbl--current',
    		x: appendTo.properties.radius,
    		y: appendTo.properties.radius,
    		class: 'dial__lbl dial__lbl--current' 
    	},appendTo.svgElem
    );
	
	// temp affichage central
    appendTo.lblTarget = libCalc.createSVGElement('text', {
            id: 'dial__lbl--target',
    		x: appendTo.properties.radius,
    		y: appendTo.properties.radius,
    		class: 'dial__lbl dial__lbl--target' 
    	},appendTo.svgElem
    );
    appendTo.lblTarget.textContent =  "----";

	// temp max
	appendTo.lblMax = libCalc.createSVGElement('text', {
	        id: 'dial__lbl--max',
	        class: 'dial__lbl dial__lbl--confort'
	    },appendTo.svgElem
	);

	// temp min
	appendTo.lblMin = libCalc.createSVGElement('text', {
	        id: 'dial__lbl--min',
	        class: 'dial__lbl dial__lbl--reduit'
	    },appendTo.svgElem
	);
	
	// div accueillant le menu conf
	appendTo.divElem = document.createElement('div');
    appendTo.divElem.setAttribute('id', 'divElem');
    appendTo.content.appendChild(appendTo.divElem);
    
	// ajout des events sur les temperatures "reduites" et "confort"
	appendTo.lblMin.addEventListener('mousedown', () => dragDhwStart(1, appendTo));
    appendTo.lblMin.addEventListener('touchstart', () => dragDhwStart(1, appendTo));
    appendTo.lblMax.addEventListener('mousedown', () => dragDhwStart(2, appendTo));
    appendTo.lblMax.addEventListener('touchstart', () => dragDhwStart(2, appendTo));
        
    appendTo.svgElem.addEventListener('mouseup', () => dragDhwEnd(appendTo));
	appendTo.svgElem.addEventListener('mouseleave', () => dragDhwEnd(appendTo));
	appendTo.svgElem.addEventListener('touchend', () => dragDhwEnd(appendTo));
		
	appendTo.svgElem.addEventListener('mousemove', (ev) => dragDhwMove(ev, appendTo));
	appendTo.svgElem.addEventListener('touchmove', (ev) => dragDhwMove(ev, appendTo));
	
	// ajout de l'event pour ouverture du menu
	appendTo.lblTarget.addEventListener('click', () => renderDhwConf(appendTo));
        
}

export function renderDhwTicks(appendTo) {
    
    // recuperation du mode ecs : off - auto - forcé
    const dhw_mode = appendTo._hass.states[appendTo.config?.dhw_mode?.entity];
    appendTo.dhw_mode_value = dhw_mode ? dhw_mode.state : '';
    
	const	vMin = Math.min(appendTo.valueMaxTemp, appendTo.valueMinTemp);
	const	vMax = Math.max(appendTo.valueMaxTemp, appendTo.valueMinTemp);
	var vCurrent = appendTo.valueDhwTemp;
	//var indicTick;

	var min = libCalc.restrictToRange(Math.round((vMin - appendTo.options.minValue) / appendTo.properties.rangeValue * appendTo.options.numTicks), 0, appendTo.options.numTicks - 1);
	var max = libCalc.restrictToRange(Math.round((vMax - appendTo.options.minValue) / appendTo.properties.rangeValue * appendTo.options.numTicks), 0, appendTo.options.numTicks - 1);
	var current = libCalc.restrictToRange(Math.round((vCurrent - appendTo.options.minValue) / appendTo.properties.rangeValue * appendTo.options.numTicks), 0, appendTo.options.numTicks - 1);
	
	var minTrue = libCalc.restrictToRange(Math.round((appendTo.valueMinTemp - appendTo.options.minValue) / appendTo.properties.rangeValue * appendTo.options.numTicks), 0, appendTo.options.numTicks - 1);
	var maxTrue = libCalc.restrictToRange(Math.round((appendTo.valueMaxTemp - appendTo.options.minValue) / appendTo.properties.rangeValue * appendTo.options.numTicks), 0, appendTo.options.numTicks - 1);
	
	appendTo.tickArray.forEach(function (tick, iTick) {
		var isLarge = iTick == min || iTick == max;
		var isDhw = iTick == current;
		var isActive = iTick >= min && iTick <= max;
		var isMin = iTick == minTrue;
		var isMax = iTick == maxTrue;
		
		if(appendTo.dhw_mode_value == appendTo.config?.dhw_mode?.power || appendTo.valueMaxTemp == "" || appendTo.valueMinTemp == "" ) {
		    
		    // si chaudiere eteinte, les graduations sont "simples"
		    libCalc.attr(tick, {
    			d: libCalc.pointsToPath(libCalc.rotatePoints(appendTo.tickPoints, iTick * appendTo.theta - appendTo.offsetDegrees, [appendTo.properties.radius, appendTo.properties.radius])),
    		});
		    
	    } else {
	        
	        // sinon on affiche la plage de reglage et les limites
    		libCalc.attr(tick, {
    			d: libCalc.pointsToPath(libCalc.rotatePoints(isLarge ? appendTo.tickPointsLarge : appendTo.tickPoints, iTick * appendTo.theta - appendTo.offsetDegrees, [appendTo.properties.radius, appendTo.properties.radius])),
    		    
    		    //d: libCalc.pointsToPath(libCalc.rotatePoints( isDhw ? appendTo.tickPointsIndic : (isLarge ? appendTo.tickPointsLarge : appendTo.tickPoints) , iTick * appendTo.theta - appendTo.offsetDegrees, [appendTo.properties.radius, appendTo.properties.radius])),
    		    
    		    
    		    class: isMax ? 'max' : (isMin ? 'minDhw' : (isActive ? 'active' : ''))
    		});
    		
    		if(isDhw) {
    		    libCalc.attr(appendTo.tickIndicArray[0], {
        			d: libCalc.pointsToPath(libCalc.rotatePoints( appendTo.tickPointsIndic, iTick * appendTo.theta - appendTo.offsetDegrees, [appendTo.properties.radius, appendTo.properties.radius])),
        		    class: 'active'
        		});
    		}
    		
	    }
	    
	});
	
}

export function renderDhwTemp(appendTo) {
    
    const lbl_text_max = appendTo.svgElem.querySelector('#dial__lbl--max');
    const lbl_text_min = appendTo.svgElem.querySelector('#dial__lbl--min');
    const lbl_text_current = appendTo.svgElem.querySelector('#dial__lbl--current');
    
    // si la chaudiere est eteinte, pas d'affichages des temperatures de reglage
    if(appendTo.dhw_mode_value == appendTo.config?.dhw_mode?.power) {
        
        lbl_text_max.textContent = "";
    	lbl_text_min.textContent = "";
    	
        return;
        
    } else {

		// si les valeurs de temperatures de reglage ne sont pas encore pretes on annule ce tour
		if(isNaN(appendTo.valueMaxTemp) || isNaN(appendTo.valueMinTemp) || appendTo.valueMaxTemp == "" || appendTo.valueMinTemp == "") return;
            
        lbl_text_max.textContent = parseFloat(appendTo.valueMaxTemp).toFixed(1);
    	lbl_text_min.textContent = parseFloat(appendTo.valueMinTemp).toFixed(1);
    	
    	// on s'assure que les temperatures sont dans la bonne plage
        var peggedValue_max = libCalc.restrictToRange(appendTo.valueMaxTemp, appendTo.options.minValue, appendTo.options.maxValue);
        var peggedValue_min = libCalc.restrictToRange(appendTo.valueMinTemp, appendTo.options.minValue, appendTo.options.maxValue);
        
        // position en degré du "marqueur" de temperature 
		var degs_max = appendTo.options.tickDegrees * (peggedValue_max - appendTo.options.minValue) / appendTo.properties.rangeValue - appendTo.offsetDegrees;
		var degs_min = appendTo.options.tickDegrees * (peggedValue_min - appendTo.options.minValue) / appendTo.properties.rangeValue - appendTo.offsetDegrees;
		
		// decallage de la position pour une meilleur lecture
		if (peggedValue_max > appendTo.valueMinTemp ) {
        	degs_max += 9;
        } else {
        	degs_max -= 9;
        }
        		
        if (peggedValue_min > appendTo.valueMaxTemp ) {
        	degs_min += 9;
        } else {
        	degs_min -= 9;
        }

        // position x-y de l'affichage des temperature
		var pos_max = libCalc.rotatePoint(appendTo.lblConfortPosition, degs_max, [appendTo.properties.radius, appendTo.properties.radius]);
		var pos_min = libCalc.rotatePoint(appendTo.lblConfortPosition, degs_min, [appendTo.properties.radius, appendTo.properties.radius]);
		
			
		libCalc.attr(lbl_text_max, {
			x: pos_max[0],
		    y: pos_max[1] 
		});
			
		libCalc.attr(lbl_text_min, {
			x: pos_min[0],
		    y: pos_min[1] 
		});
		
		lbl_text_current.textContent = appendTo.valueDhwTemp;
			
	}
}

export function renderDhwStatus(appendTo) {
    
    // on supprime l'icone precedente    	
    appendTo.icoPath.removeAttribute("d");
    appendTo.icoPath.removeAttribute("transform");
    appendTo.icoPath.removeAttribute("style");
    
    // recuperation du mode ecs : off - auto - forcé
    const dhw_mode = appendTo._hass.states[appendTo.config?.dhw_mode?.entity];
    appendTo.dhw_mode_value = dhw_mode ? dhw_mode.state : '';
    
    // recuperation de la charge ecs : off - on
    const dhw_charge = appendTo._hass.states[appendTo.config?.dhw_charge?.entity];
    appendTo.dhw_charge_value = dhw_charge ? dhw_charge.state : '';
    
    // creation de l'icone correspondante:
    if(appendTo.dhw_mode_value == appendTo.config?.dhw_mode?.power) {
        
        // si "off"
        addCenteredMdiIcon("power", appendTo);
        
        const lbl_text_mode = appendTo.svgElem.querySelector('#dial__lbl--mode');
        lbl_text_mode.textContent = "";
        
        
    } else if(appendTo.dhw_mode_value == appendTo.config?.dhw_mode?.auto) {
        
        // afficher auto au dessus de l'icone principale
        const lbl_text_mode = appendTo.svgElem.querySelector('#dial__lbl--mode');
            
        lbl_text_mode.textContent = "AUTO";
        libCalc.attr(lbl_text_mode, {
        		x: appendTo.properties.radius,
        		y: appendTo.properties.radius*0.65
        	}
        );
        
        
    } else if(appendTo.dhw_mode_value == appendTo.config?.dhw_mode?.force) {
        
        // afficher auto au dessus de l'icone principale
        const lbl_text_mode = appendTo.svgElem.querySelector('#dial__lbl--mode');
            
        lbl_text_mode.textContent = t("renderDhwStatus", "force");
        libCalc.attr(lbl_text_mode, {
        		x: appendTo.properties.radius,
        		y: appendTo.properties.radius*0.65
        	}
        );
        
        
    } else {
            
            // sinon on efface 'auto'
            const lbl_text_mode = appendTo.svgElem.querySelector('#dial__lbl--mode');
            lbl_text_mode.textContent = "";
    }
    
    if(appendTo.dhw_charge_value == appendTo.config?.dhw_charge?.power_on) {
        addDhwMdiIcon("fire", appendTo);
    } else {
        addDhwMdiIcon("", appendTo);
    }
    
}

export function dragDhwStart(origine, appendTo) {
    
    if (appendTo._isMenuOpen) return;
    
	appendTo.startDelay = setTimeout(function () {
	    
	    libCalc.setClass(appendTo.svgElem, 'dial--edit', true);
		
		const lbl_text_target = appendTo.svgElem.querySelector('#dial__lbl--target');
		if(origine == 1) lbl_text_target.textContent = parseFloat(appendTo.valueMinTemp).toFixed(1);
		else lbl_text_target.textContent = parseFloat(appendTo.valueMaxTemp).toFixed(1);
		
		appendTo.lblCurrent.setAttribute("filter", "url(#blur)");
		appendTo.lblMode.setAttribute("filter", "url(#blur)");
		appendTo.icoPath.setAttribute("filter", "url(#blur)");
		
		appendTo._drag.inProgress = true;
		appendTo._drag.origine = origine;
	}, 1000);
};
		
export function dragDhwEnd(appendTo) {
    
	clearTimeout(appendTo.startDelay);
		
	libCalc.setClass(appendTo.svgElem, 'dial--edit', false);
	if (!appendTo._drag.inProgress || appendTo._isMenuOpen) return;
    appendTo._drag.inProgress = false;
    
    appendTo.lblCurrent.removeAttribute("filter");
    appendTo.lblMode.removeAttribute("filter");
    appendTo.icoPath.removeAttribute("filter");
            
    let entityID;
    let domain;
    let newTemp;
            
    if(appendTo._drag.origine == 1) {
                
        entityID = appendTo.config.min_temp;
        domain = entityID.split('.')[0];
        newTemp = appendTo.valueMinTemp;
                
    } else if(appendTo._drag.origine == 2) {
            
        entityID = appendTo.config.max_temp;
        domain = entityID.split('.')[0];
        newTemp = appendTo.valueMaxTemp;
                
    }    
                
    appendTo._hass.callService(domain, 'set_value', {
        entity_id: entityID,
        value: newTemp
    });
            
            
};

export function dragDhwMove(ev, appendTo) {
    ev.preventDefault();
    if (!appendTo._drag.inProgress || appendTo._isMenuOpen) return;
    var evPos = eventPosition(ev, appendTo);
		    
    var theta_newVal = -(90 + (360-appendTo.options.tickDegrees)/2 ) + (Math.atan2(evPos[1], evPos[0]) * 180/Math.PI) * -1;
	if (theta_newVal < 0) { theta_newVal += 360; }
	const r_newVal = Math.sqrt(evPos[0]*evPos[0] + evPos[1]*evPos[1]);

	let new_temp = (appendTo.options.maxValue - appendTo.options.minValue) * (theta_newVal / appendTo.options.tickDegrees) + appendTo.options.minValue;
			
	const gape = ((360 - appendTo.options.tickDegrees) * appendTo.properties.rangeValue ) / (appendTo.options.tickDegrees * 2);
	
    if(new_temp > (appendTo.options.maxValue + gape)) new_temp = appendTo.options.minValue;
    else if(new_temp > appendTo.options.maxValue) new_temp = appendTo.options.maxValue;
			
	if(appendTo._drag.origine == 1) {
	    
        const lbl_text_min = appendTo.svgElem.querySelector('#dial__lbl--min');
			    
	    appendTo.valueMinTemp = parseFloat(new_temp).toFixed(1);
	    lbl_text_min.textContent = appendTo.valueMinTemp;

	} else if(appendTo._drag.origine == 2) {
			    
	    const lbl_text_max = appendTo.svgElem.querySelector('#dial__lbl--max');
    			
		appendTo.valueMaxTemp = parseFloat(new_temp).toFixed(1);
		lbl_text_max.textContent = appendTo.valueMaxTemp;

	}
			
	const lbl_text_target = appendTo.svgElem.querySelector('#dial__lbl--target');
	lbl_text_target.textContent = parseFloat(new_temp).toFixed(1);
			
	renderDhwTicks(appendTo);
    renderDhwTemp(appendTo);
}

function addDhwMdiIcon(iconName, appendTo) {
    
    if(iconName !== "" ) {
        const { path: mdiPath, scale, offsetY, color } = libSvg.mdiIcons[iconName];
    
        appendTo.icoPath.setAttribute("d", mdiPath);
        appendTo.icoPath.setAttribute("style", "fill:"+color);
    
        // Récupérer la taille originale (boîte englobante)
        const originalWidth = 24 * scale/1.5;
        const originalHeight = (24 - offsetY) * scale/1.5;
        
        // Calcul du centre du SVG
        const centerX = appendTo.properties.radius;
        const centerY = appendTo.properties.radius;
    
        // Calcul du déplacement pour centrer l'icône
        const finalOffsetX = centerX - (originalWidth) / 2;
        const finalOffsetY = centerY - (originalHeight) / 2;
    
        // Appliquer la transformation (déplacement + mise à l'échelle)
        appendTo.icoPath.setAttribute("transform", `translate(${finalOffsetX},${finalOffsetY*1.5}) scale(${scale/1.5})`);
        
    } else {
        appendTo.icoPath.setAttribute("d", "");
    }

}

export function renderDhwConf(appendTo) {
    
    if (appendTo._isMenuOpen) return;
    
    appendTo._isMenuOpen = true;
    
    //const dhw_mode_entity = appendTo._hass.states[appendTo.config.dhw_mode.entity];
    //appendTo.dhw_mode_value = dhw_mode_entity ? dhw_mode_entity.state : '';
    
    //const dhw_charge_entity = appendTo._hass.states[appendTo.config.dhw_charge.entity];
    //appendTo.dhw_charge_value = dhw_charge_entity ? dhw_charge_entity.state : '';
    
    appendTo.icoPath.setAttribute("filter", "url(#blur)");
    appendTo.lblMode.setAttribute("filter", "url(#blur)");
    appendTo.lblCurrent.setAttribute("filter", "url(#blur)");
	appendTo.lblMax.setAttribute("filter", "url(#blur)");
	appendTo.lblMin.setAttribute("filter", "url(#blur)");
	appendTo.ticks.setAttribute("filter", "url(#blur)");
	appendTo.tickIndic.setAttribute("filter", "url(#blur)");
	
	appendTo.confElem = document.createElement('div');
    appendTo.confElem.setAttribute('id', 'confElem');
    appendTo.confElem.setAttribute('class', 'confElem');
    appendTo.divElem.appendChild(appendTo.confElem);
    
    let autoButton;
    if(appendTo.dhw_mode_value == appendTo.config?.dhw_mode?.auto) autoButton = renderButton('disableButtonElem', '', 'AUTO', 150, 0.65, 1.8, appendTo);
    else autoButton = renderButton('buttonElem', '', 'AUTO', 150, 0.65, 1.8, appendTo);
    autoButton.addEventListener('mouseup', () => {
        closeDhwConf("auto", appendTo);
    });
    
    let chargeButton;
    let chargeCmd;
    if(appendTo.dhw_charge_value == appendTo.config?.dhw_charge?.power_on) {
        chargeButton = renderButton('buttonElem', 'mdi:fire-off', 'STOP', 90, 0.65, 1, appendTo);
        chargeCmd = "charge_off";
    } else {
        chargeButton = renderButton('buttonElem', 'mdi:fire', 'CHARGE', 90, 0.65, 1, appendTo);
        chargeCmd = "charge_on";
    }
    chargeButton.addEventListener('mouseup', () => {
        closeDhwConf(chargeCmd, appendTo);
    });
    
    let forceButton;
    if(appendTo.dhw_mode_value == appendTo.config?.dhw_mode?.force) forceButton = renderButton('disableButtonElem', 'mdi:run-fast', '', 30, 0.65, 1, appendTo);
    else forceButton = renderButton('buttonElem', 'mdi:run-fast', '', 30, 0.65, 1, appendTo);
    forceButton.addEventListener('mouseup', () => {
        closeDhwConf("force", appendTo);
    });
    
    let powerButton;
    if(appendTo.dhw_mode_value == appendTo.config?.dhw_mode?.power) powerButton = renderButton('disableButtonElem', 'mdi:power', '', -30, 0.65, 1, appendTo);
    else powerButton = renderButton('buttonElem', 'mdi:power', '', -30, 0.65, 1, appendTo);
    powerButton.addEventListener('mouseup', () => {
        closeDhwConf("power", appendTo);
    });
    
    const backButton = renderButton('buttonElem', 'mdi:arrow-left-top', '', 210, 0.65, 1, appendTo);
	backButton.addEventListener('mouseup', () => {
        closeDhwConf("back", appendTo);
    });
	
	appendTo.confElem.setAttribute('style', 'background-color: #000000d6');
}

export function closeDhwConf(cmd, appendTo) {
    
    appendTo._isMenuOpen = false;
	
	const rect = appendTo.confElem.getBoundingClientRect();
	
	appendTo.confElem.setAttribute('style', 'background-color: #0000');
	
	appendTo.confElem.querySelectorAll("div").forEach(button => {
	    
	    const angle = button.getAttribute('angle');
	    
	    const out_x = (rect.width/2) + (1.5 * (rect.width/2) * Math.cos(angle * Math.PI / 180) );
        const out_y = (rect.height/2) - (1.5 * (rect.height/2) * Math.sin(angle * Math.PI / 180) );

        button.style.left = out_x - (appendTo.options.sizeProgIcon/2) + "px";
        button.style.top = out_y - (appendTo.options.sizeProgIcon/2) + "px";
    });
    
    setTimeout(() => {
    
        appendTo.icoPath.removeAttribute("filter");
    	appendTo.lblMode.removeAttribute("filter");
    	appendTo.lblCurrent.removeAttribute("filter");
    	appendTo.lblMax.removeAttribute("filter");
    	appendTo.lblMin.removeAttribute("filter");
    	appendTo.ticks.removeAttribute("filter");
    	appendTo.tickIndic.removeAttribute("filter");
    	
    	appendTo.confElem.remove();
    }, 200);
    
    if(cmd == "power") {
        
        appendTo._hass.callService('select', 'select_option', {
            entity_id: appendTo.config.dhw_mode.entity,//'select.pellematic_heating_circuit_1_mode_auto',
            option: appendTo.config.dhw_mode.power
        });
        
    } else if(cmd == "auto") {
        
        appendTo._hass.callService('select', 'select_option', {
            entity_id: appendTo.config.dhw_mode.entity,//'select.pellematic_heating_circuit_1_mode_auto',
            option: appendTo.config.dhw_mode.auto
        });
        
    } else if(cmd == "force") {
        
        appendTo._hass.callService('select', 'select_option', {
            entity_id: appendTo.config.dhw_mode.entity,//'select.pellematic_heating_circuit_1_mode_auto',
            option: appendTo.config.dhw_mode.force
        });
        
    } else if(cmd == "charge_on") {
        
        appendTo._hass.callService('select', 'select_option', {
            entity_id: appendTo.config.dhw_charge.entity,//'select.pellematic_heating_circuit_1_mode_auto',
            option: appendTo.config.dhw_charge.power_on
        });
        
    } else if(cmd == "charge_off") {
        
        appendTo._hass.callService('select', 'select_option', {
            entity_id: appendTo.config.dhw_charge.entity,//'select.pellematic_heating_circuit_1_mode_auto',
            option: appendTo.config.dhw_charge.power_off
        });
        
    }
    
}

