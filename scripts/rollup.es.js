/* globals process */
/*
Build to a module that has ES2015 module syntax but otherwise only syntax features that node supports
https://github.com/rollup/rollup/wiki/jsnext:main
*/
import { pkg, createConfig } from "./rollup.base.js";

const includeDepencies = !!parseInt(process.env.DEPS, 10) || false; // Use `false` if you are creating a library, or if you are including external script in html
const env = process.env;

const baseConfig = createConfig({ includeDepencies });
const targetConfig = Object.assign({}, baseConfig, {
  output: Object.assign(
    {},
    baseConfig.output,
    {
      file: `${env.DEST || pkg.main}.mjs`,
      format: "es"
    }
  )
});

export default targetConfig;
