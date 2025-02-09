export function createSVGElement(tag, attributes, appendTo) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
	attr(element, attributes);
	if (appendTo) {
		appendTo.appendChild(element);
  	}
	return element;
}

// Set attributes for an element
export function attr(element, attrs) {
    //console.log(element);
    for (var i in attrs) {
    	element.setAttribute(i, attrs[i]);
    }
}

export function setClass(el, className, state) {
    el.classList[state ? 'add' : 'remove'](className);
}

export function pointsToPath(points) {
	return points.map(function (point, iPoint) {
		return (iPoint > 0 ? 'L' : 'M') + point[0] + ' ' + point[1];
	}).join(' ') + 'Z';
}

export function restrictToRange(val, min, max) {
	if (val < min) return min;
	if (val > max) return max;
	return val;
}
    
export function rotatePoint(point, angle, origin) {
	var radians = angle * Math.PI / 180;
	var x = point[0] - origin[0];
	var y = point[1] - origin[1];
	
	//console.log(radians + " : " + x + " : " + y);
	
	var x1 = x * Math.cos(radians) - y * Math.sin(radians) + origin[0];
	var y1 = x * Math.sin(radians) + y * Math.cos(radians) + origin[1];
	return [x1, y1];
}
    
// Rotate an array of cartesian points about a given origin by X degrees
export function rotatePoints(points, angle, origin) {
	return points.map(function (point) {
		return rotatePoint(point, angle, origin);
	});
}

export function circleToPath(cx, cy, r) {
	return [
		"M", cx, ",", cy,
		"m", 0 - r, ",", 0,
		"a", r, ",", r, 0, 1, ",", 0, r * 2, ",", 0,
		"a", r, ",", r, 0, 1, ",", 0, 0 - r * 2, ",", 0,"z"
	].
    join(' ').replace(/\s,\s/g, ",");
}
    

export function donutPath(cx, cy, rOuter, rInner) {
    return circleToPath(cx, cy, rOuter) + " " + circleToPath(cx, cy, rInner);
}
