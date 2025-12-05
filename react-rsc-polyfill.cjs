const Module = require("module");
const React = require("react");

const runtimeModules = new Set([
  "next/dist/compiled/next-server/app-page.runtime.prod.js",
  "next/dist/compiled/next-server/app-page.runtime.dev.js",
  "next/dist/compiled/next-server/app-route.runtime.prod.js",
  "next/dist/compiled/next-server/app-route.runtime.dev.js",
]);

const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  const exported = originalLoad.apply(this, arguments);
  if (runtimeModules.has(request)) {
    tryPatchReactRSC(exported);
  }
  return exported;
};

function tryPatchReactRSC(runtime) {
  try {
    const rscReact = runtime?.vendored?.["react-rsc"]?.React;
    if (!rscReact) return;

    if (!("Component" in rscReact) && React.Component) {
      rscReact.Component = React.Component;
    }

    if (!("PureComponent" in rscReact) && React.PureComponent) {
      rscReact.PureComponent = React.PureComponent;
    }
  } catch {
    // Ignore failures; we'll fall back to Next defaults.
  }
}
