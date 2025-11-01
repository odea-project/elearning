import { WebR } from "https://webr.r-wasm.org/latest/webr.mjs";

const webR = new WebR();
await webR.init();
const capture = await webR.captureR(`
  plot(1:3)
`);
console.log(capture);
await webR.close?.();
