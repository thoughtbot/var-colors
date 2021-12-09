![image](https://user-images.githubusercontent.com/3891632/142780096-33dafc63-00ec-4cf5-bafb-a81170a5aade.png)


<p align=center><b>A template for <a href="https://preactjs.com/">Preact</a>-powered <a href="https://figma.com">Figma</a> plugins</b></p>

### Setup

1. Create a new plugin via Figma. `Plugins > Development > New Plugin` Choose the "Empty" plugin type.

2. Clone this repo into your plugin folder.

  You can do `npx degit github:setphen/FigmaPreactStarter --force` to copy the
  main branch without cloning any of this template's git history.

3. Add or replace these lines in `manifest.json`

```
"main": "dist/code.js",
"ui": "dist/ui.html",
```

`npm i` to install modules

`npm run watch` to start development
