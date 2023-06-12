const {
  share,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");
module.exports = withModuleFederationPlugin({
  name: "mfe1",
  exposes: {
    "./Module": "./projects/mfe1/src/app/cryptos/cryptos.module.ts",
  },
  shared: share({
    "@angular/core": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    },
    "@angular/common": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    },
    "@angular/router": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    },
    "@angular/material": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    },
  }),
  sharedMappings: ['wallet-lib'],
});
