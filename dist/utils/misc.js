function loadImage(src) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.onload = resolve.bind(null, image);
        image.onerror = reject.bind(null);
        image.src = src;
    });
}
export { loadImage };
//# sourceMappingURL=misc.js.map