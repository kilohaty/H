export default (function () {
    var div;
    var span;
    function createElements() {
        div = document.createElement('div');
        span = document.createElement('span');
        div.style.cssText = 'position: absolute; left: -9999px; top: -9999px;';
        div.appendChild(span);
        document.body.appendChild(div);
    }
    return {
        measureText: function (text, cssText) {
            if (!div)
                createElements();
            span.innerText = text;
            span.style.cssText = cssText;
            return {
                width: span.offsetWidth,
                height: span.offsetHeight
            };
        }
    };
}());
//# sourceMappingURL=text-helper.js.map