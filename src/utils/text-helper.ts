export default (function () {
  let div: HTMLDivElement;
  let span: HTMLSpanElement;

  function createElements() {
    div = document.createElement('div');
    span = document.createElement('span');
    div.style.cssText = 'position: absolute; left: -9999px; top: -9999px;';
    div.appendChild(span);
    document.body.appendChild(div);
  }

  return {
    measureText(text: string, cssText: any): { width: number, height: number } {
      if (!div) createElements();

      span.innerText = text;
      span.style.cssText = cssText;

      return {
        width: span.offsetWidth,
        height: span.offsetHeight
      };
    }
  }
}());