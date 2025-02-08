export function cssData(user) {
    var css =`
    
        ha-card {
            overflow: hidden;
            --rail_border_color: transparent;
            --auto_color: rgb(227, 99, 4, 1);
            --cool_color: rgba(0, 122, 241, 0.6);
            --cool_colorc: rgba(0, 122, 241, 1);
            --heat_color: #ff8100;
            --heat_colorc: rgb(227, 99, 4, 1);
            --manual_color: #44739e;
            --off_color: #8a8a8a;
            --fan_only_color: #D7DBDD;
            --dry_color: #efbd07;
            --idle_color: #808080;
            --unknown_color: #bac;
            --text-color: white;
        }
        
        .sky-thermostat {
            padding: 15px;
        }
        
        /*#thermostat {
            width: 50vmin;
        	height: 50vmin;
        	margin: 5px auto;
        	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        	padding: 10px;
        }*/
        
        .dial {
        	-webkit-user-select: none;
        	-moz-user-select: none;
        	-ms-user-select: none;
        	user-select: none;
        }
        
        /* ICON */
        .dial__icon {
        	fill: #f12c06;
        	/*opacity: 1;*/
        	transition: opacity 0.5s;
        	pointer-events: none;
        }
        .dial.has-icon .dial__icon {
        	display: block;
        	/*opacity: 1;*/
        	pointer-events: initial;
        }
    
        
        /* MASQUE FLOU */
        .dial__mask {
        	fill: #222;
        	opacity: 0;
        	transition: opacity 0.5s;
        }
        .dial--edit .dial__mask {
        	opacity: 0.5;
        }
        
        /* INDICATEUR DE CONTROLE */
        .dial__editableIndicator {
        	fill: white;
        	fill-rule: evenodd;
        	opacity: 0;
        	transition: opacity 0.5s;
        }
        .dial--edit .dial__editableIndicator {
        	opacity: 1;
        }
        
        /* GRADUATION */
        .dial__ticks path {
    	    fill: rgba(255, 255, 255, 0.3);
        }
        .dial__ticks path.active {
        	fill: rgba(255, 255, 255, 0.8);
        }
        
        .dial__ticks path.min {
        	fill: rgba(0, 255, 0, 0.8);
        }
        
        .dial__ticks path.minEcs {
        	fill: rgba(0, 78, 255, 0.8);
        }
        .dial__ticks path.max {
        	fill: rgba(255, 0, 0, 0.8);
        }
        
        /* TEMPERATURE SUR GRADUATION */
        .dial text {
        	fill: white;
        	text-anchor: middle;
        	font-family: Helvetica, sans-serif;
        	alignment-baseline: central;
        }
        .dial__lbl--target {
        	opacity: 0;
        	transition: opacity 0.5s;
        }
        .dial--edit .dial__lbl--target {
        	opacity: 1;
        }
        .dial__lbl--target {
        	font-size: 120px;
        	font-weight: bold;
        }
        .dial__lbl--confort {
        	font-size: 22px;
        	font-weight: bold;
        }
        .dial__lbl--reduit {
        	font-size: 22px;
        	font-weight: bold;
        }
        
        /* AUTO, STATUS ET MODULATION */
        .dial__lbl--auto {
            fill: #999 !important;
            font-size: 20px;
            font-weight: bold;
            margin: 10px;
            padding: 10px;
            margin: 10px;
        }
        .dial__lbl--status {
        	font-size: 20px;
        	font-weight: bold;
        	margin: 10px;
        
        	padding: 10px;
        	margin: 10px;
        }
        .dial__lbl--modulation {
        	font-size: 16px;
        	margin: 10px;
        	padding: 10px;
        	margin: 10px;
        }
        
        .confElem {
            position: absolute;
            top: 0px;
            left: 0px;
            width: calc(100% - 30px);
            aspect-ratio: 1 / 1;
            background-color: #0000;
            border-radius: 50%;
            margin: 15px;
            transition: background-color 0.3s;
            overflow: hidden;
        }
        
        .disableButtonElem {
            position: absolute;
            --mdc-icon-size: 100%;
            color: rgba(99,99,99,0.6);
            top: 0px;
            left: 0px;
            opacity: 0;
            transition: left 0.5s, top 0.5s, opacity 0.3s;
        }
        
        .buttonElem {
            position: absolute;
            --mdc-icon-size: 100%;
            color: rgba(255,255,255,0.9);
            top: 0px;
            left: 0px;
            opacity: 0;
            transition: left 0.5s, top 0.5s, opacity 0.3s;
        }
        
        .titre {
            position: absolute;
            bottom: -18px;
            left: 50%;
            transform: translateX(-50%);
            margin: 0px;
        }
        
        .titreOnly {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            margin: 0px;
        }
		
  `
    return css;

}
  
