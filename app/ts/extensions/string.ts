export {};

declare global {
  // tslint:disable-next-line:interface-name
  interface String {
    replaceAt(index: number, character: string): string;
  }
}

String.prototype.replaceAt = function(index: number, character: string) {
  return this.substr(0, index) + character + this.substr(index + character.length);
};
