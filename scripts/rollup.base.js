import fs from "fs";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pathmodify from "rollup-plugin-pathmodify";

export const pkg = JSON.parse(fs.readFileSync("./package.json"));
if (!pkg) {
  throw("Could not read package.json");
}
const env = process.env;
const input = env.INPUT || "src/index.js";
const name = env.NAME || pkg.name;
const external = Object.keys(pkg.dependencies || {});

const globals = {};

external.forEach(ext => {
  switch (ext) {
  case "mithril":
    globals["mithril"] = "m";
    break;
  default:
    globals[ext] = ext;
  }
});

export const createConfig = ({ includeDepencies }) => ({
  input,
  external: includeDepencies ? [] : external,
  output: {
    name,
    globals,
  },
  plugins: [
    // Resolve libs in node_modules
    resolve({
      jsnext: true,
      main: true,
    }),

    // Make sure that Mithril is included only once (if passed in INCLUDES env variable)
    pathmodify({
      aliases: [
        {
          id: "mithril/stream",
          resolveTo: "node_modules/mithril/stream/stream.js"
        },
        {
          id: "mithril",
          resolveTo: "node_modules/mithril/mithril.js"
        },
      ]
    }),

    // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    commonjs({
      include: "node_modules/**"
    }),

    babel({
      exclude: "node_modules/**"
    })
  ]
});
