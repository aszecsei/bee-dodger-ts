export {};

declare global {
  // tslint:disable-next-line:interface-name
  interface CanvasRenderingContext2D {
    wrapText(text: string, x: number, y: number, maxWidth: number, lineHeight: number): void;
  }
}

CanvasRenderingContext2D.prototype.wrapText = function(text: string, x: number, y: number,
                                                       maxWidth: number, lineHeight: number) {
  const lines = text.split("\n");
  for (const line of lines) {
    const words = line.split(" ");
    let mLine = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = mLine + words[n] + " ";
      const metrics = this.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.fillText(line, x, y);
        mLine = words[n] + " ";
        y += lineHeight;
      } else {
        mLine = testLine;
      }
    }

    this.fillText(line, x, y);
    y += lineHeight;
  }
};
