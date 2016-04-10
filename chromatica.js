

var Chromatica = (function(window) {
    "use strict";

    var document = window.document,
        $ = document.querySelector.bind(document);

    var Chromatica = {};
    var emitColorChange = null;
    var cycleHandle = null;

    function hex2dec(hex) { return (parseInt(hex, 16)); }
    function dec2hex(dec) { return (dec < 16 ? "0" : "") + dec.toString(16); }
    function cleanHex(c) {
        c = (c || "").replace(/[^\dA-F]/gi, "");
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]].join("");
        }
        return c.length == 6 ? "#" + c : null;
    }
    function hex2rgb(hexColor) {
        if (hexColor.r) return hexColor; //already rgb
        hexColor = cleanHex(hexColor);
        return !hexColor ? null : {
            r: hex2dec(hexColor.slice(1, 3)),
            g: hex2dec(hexColor.slice(3, 5)),
            b: hex2dec(hexColor.slice(5, 7))
        };
    }

    function rgb2hex(rgbColor) {
        return cleanHex(dec2hex(rgbColor.r) + dec2hex(rgbColor.g) + dec2hex(rgbColor.b));
    }

    function interpolate(startColor, endColor, percent) {
        var c1 = hex2rgb(startColor),
            c2 = hex2rgb(endColor),
            pc = percent / 100;
        var rgbColor = {
            r: Math.floor(c1.r + (pc * (c2.r - c1.r)) + .5),
            g: Math.floor(c1.g + (pc * (c2.g - c1.g)) + .5),
            b: Math.floor(c1.b + (pc * (c2.b - c1.b)) + .5)
        };
        return rgb2hex(rgbColor);
    }


    function ensureThemeColorMetaTag() {
        var meta = $("meta[name='theme-color']");
        if (!meta) {
            meta = document.createElement("meta");
            meta.name = "theme-color";
            $("head").appendChild(meta);
        }
        return meta;
    }

    Chromatica.setColor = function(color) {
        color = cleanHex(color);
        if (!color) return false;
        ensureThemeColorMetaTag().content = color;
        emitColorChange && emitColorChange(color);
        return true;
    };
    
    Chromatica.clear = function () {
        ensureThemeColorMetaTag().content = "";
        emitColorChange && emitColorChange("");
        return true;
    }

    Chromatica.subscribe = function(callback) {
        if (typeof callback == "function") {
            emitColorChange = callback;
        }
    };
    
    Chromatica.util = {
      cleanHex: cleanHex,
      hex2rgb: hex2rgb,
      rgb2hex: rgb2hex,
      interpolate: interpolate  
    };

    return Chromatica;
})(window);

if (typeof module !== 'undefined') {
    module.exports = Chromatica;
} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define('Chromatica', [], function() {
        return Chromatica;
    });
} else {
    window.Chromatica = Chromatica;
}