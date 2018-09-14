function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve.bind(null, image);
    image.onerror = reject.bind(null);
    image.src = src;
  });
}

export {loadImage};