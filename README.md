# nw-builder

[![npm](https://img.shields.io/npm/v/nw-builder.svg?style=flat)](https://www.npmjs.com/package/nw-builder)
[![Join the chat at https://gitter.im/nwjs/nw-builder](https://badges.gitter.im/nwjs/nw-builder.svg)](https://gitter.im/nwjs/nw-builder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Build [NW.js](https://github.com/nwjs/nw.js) applications for Mac, Windows and Linux.

> Before using `nw-builder`, please go through how to [write an NW.js application](https://nwjs.readthedocs.io/en/latest/For%20Users/Getting%20Started/).

## Install

Install `nw-builder` via `npm` or your preferred Node package manager of choice.

```shell
npm i -D nw-builder
```

## Usage

### Run your first application

Module usage

```javascript
import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./nwapp",
  mode: "run",
  version: "0.70.1",
  flavor: "sdk",
});
```

CLI usage

```shell
nwbuild ./nwapp --mode=run --version=0.70.1 --flavor=sdk
```

package.json usage

`./nwapp/package.json`

```json
{
  "name": "nwdemo",
  "main": "./index.html",
  "nwbuild": {
    "srcDir": "./nwapp",
    "mode": "run",
    "version": "0.70.1",
    "flavor": "sdk"
  }
}
```

### Build your first application

Module usage

```javascript
import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./nwapp",
  mode: "build",
  version: "0.70.1",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  outDir: "./out",
});
```

CLI usage

```shell
nwbuild ./nwapp --mode=build --version=0.70.1 --flavor=normal --platform=linux --arch=x64 --outDir=./out
```

package.json usage

`./nwapp/package.json`

```json
{
  "name": "nwdemo",
  "main": "./index.html",
  "nwbuild": {
    "srcDir": "./nwapp",
    "mode": "build",
    "version": "0.70.1",
    "flavor": "normal",
    "platform": "linux",
    "arch": "x64",
    "outDir": "./out"
  }
}
```

## API Reference

### Methods

`nwbuild(options) :Promise<undefined>`

| Name        | Type                                | Default                    | Description                                                                    |
| ----------- | ----------------------------------- | -------------------------- | ------------------------------------------------------------------------------ |
| srcDir      | `string`                            | `./`                       | Directory to hold NW app files                                                 |
| mode        | `run \| build`                      | `build`                    | Run or build application                                                       |
| version     | `latest \| stable \| string \| lts` | `latest`                   | NW runtime version                                                             |
| flavor      | `sdk \| normal`                     | `normal`                   | NW runtime build flavor.                                                       |
| platform    | `linux \| osx \| win`               | `<current platform>`       | NW supported platforms                                                         |
| arch        | `ia32 \| x64`                       | `<current architecture>`   | NW supported architectures                                                     |
| outDir      | `string`                            | `./out`                    | Directory to store build artifacts                                             |
| cacheDir    | `string`                            | `./cacheDir`               | Directory to store NW binaries                                                 |
| downloadUrl | `string`                            | `https://dl.nwjs.io`       | URI to download NW binaries from                                               |
| manifestUrl | `string`                            | `https://nwjs.io/versions` | URI to download manifest from                                                  |
| cache       | `boolean`                           | `true`                     | If `true` the existing cache is used. Otherwise it removes and redownloads it. |
| zip         | `boolean`                           | `false`                    | If `true` the `outDir` directory is zipped                                     |

## Migration to v4

### Update `nw-builder`

With npm:

```shell
npm update nw-builder@^4.0.3
```

With yarn:

```shell
yarn upgrade nw-builder@^4.0.3
```

With pnpm:

```shell
pnpm update nw-builder@^4.0.3
```

> Note: `nw-builder` has been tested on Node 16 and 18 only.

### Update options

Let's take an example of v3 code and migrate it to v4.

```javascript
const NwBuilder = require("nw-builder");

const nw = new NwBuilder({
  files: ["./nwapp", "./other/**/*.js"],
  version: "latest",
  flavor: "normal",
  platforms: ["win32", "win64", "osx32", "osx64", "linux32", "linux64"],
  cacheDir: "./cache",
  buildDir: "./build",
  buildType: "versioned",
  forceDownload: true,
  appName: "nwdemo",
  appVersion: "0.1.0",
  argv: "--nw-stderr-logging",
  macCredits: "./nwapp/credits.html",
  macIcns: "./nwapp/mac.icns",
  macPlist: { ... },
  winVersionString: { ... },
  winIco: "./nwapp/win.ico",
  zip: true,
  macZip: false,
  mergeZip: false,
});

nw.build();
```

Update the import path

```patch
-const NwBuilder = require("nw-builder");
+const nwbuild = require("nw-builder");
```

Replace the `NwBuilder` initialization with a function

```patch
-const nw = new NwBuilder({
+await nwbuild({
```

The `files` property has been renamed to `srcDir`. As the name suggests, it does not taken in any globbing patterns. Structure of the NW app if left up to the user.

```patch
-  files: ["./nwapp", "./other/**/*.js"],
+  srcDir: "./nwapp",
```

Add the `mode` option.

```patch
+  mode: "build",
```

The `platforms` option has been removed and replaced with `platform` and `arch`. Notice that one `nwbuild` function call now creates one build only. Refer to the [documentation](./index.md) for valid `platform` and `arch` values.

```patch
-  platforms: ["win32", "win64", "osx32", "osx64", "linux32", "linux64"],
+  platform: "linux",
+  arch: "x64",
```

The `buildDir` option has been rename to `outDir`.

```patch
-  buildDir: "./build",
+  outDir: "./build",
```

The `buildType` option has been removed.

```patch
-  buildType: "versioned",
```

The `forceDownload` option has been changed to `cache`.

```patch
-  forceDownload: true,
+  cache: false,
```

The `appName` option has been changed to `app.name`.

```patch
-  appName: "nwdemo",
+  app: { name: "nwdemo" },
```

The `appVersion` option has been removed. The `version` is automatically taken from `srcDir/package.json`.

```patch
-  appVersion: "0.1.0",
```

The `macCredit` option has been removed.

```patch
-  macCredits: "./nwapp/credits.html",
```

The `macIcns` option has been replaced with `icon`.

```patch
-  macIcns: "./nwapp/mac.icns",
+  icon: "./nwapp/mac.icns",
```

The `macPlist` option has been removed.

```patch
-  macPlist: { ... },
```

The `winVersionString` option has been replaced with `app`.

```patch
-  winVersionString: {
-    'CompanyName': 'Some Company',
-    'FileDescription': 'Process Name',
-    'ProductName': 'Some Product',
-    'LegalCopyright': 'Copyright 2017',
-  }
+  app: {
+    company: "Some Company",
+    fileDescription: "Process Name",
+    productName: "Some Product",
+    legalCopyright: "Copyright 2017",
+  }
```

The `winIco` option has been replaced by `app.icon`.

```patch
-  winIco: "./nwapp/win.ico",
+  app: { icon: "./nwapp/win.ico" },
```

The `macZip` option has been removed.

```patch
-  macZip: false,
```

The `mergeZip` option has been removed.

```patch
-  mergeZip: false,
```

The final code should look like this.

```javascript
const { nwbuild } = require("nw-builder");

await nwbuild({
  srcDir: "./nwapp",
  mode: "build",
  version: "latest",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  outDir: "./build",
  cache: false,
  app: {
    name: "Some Product",
    icon: "./nwapp/icon.png",
    company: "Some Company",
    fileDescription: "Process Name",
    productName: "Some Product",
    legalCopyright: "Copyright 2017",
  },
});
```

## Contributing

1. Pick and install a Node version manager
   - Linux/OSX - [nvm](https://github.com/nvm-sh/nvm)
   - Win 7+/Linux/OSX - [volta](https://volta.sh)
1. Use your version manager to install Node 14.19 or above
1. Run `npm install`
1. `npm run demo` to test your changes at first glance
1. `npm t` to run unit tests
1. Don't forget to run `npm run format && npm run lint` before commiting your changes
1. Whenever possible, open an issue before submitting a pull request
1. Ensure there are tests that cover your changes

## License

[MIT](https://github.com/nwutils/nw-builder/blob/master/.github/LICENSE)
