export {};

declare global {
  interface CanvasRenderingContext2D {
    wrapText(text: string, x: number, y: number, maxWidth: number, lineHeight: number): void;
  }
}

CanvasRenderingContext2D.prototype.wrapText = function(text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  let lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let words = lines[i].split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = this.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }

    this.fillText(line, x, y);
    y += lineHeight;
  }
}
