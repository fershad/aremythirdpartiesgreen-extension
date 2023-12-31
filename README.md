# Are my third parties green? - Chrome Extension

A Firefox and Chrome extension to extend the usability of the [Are my third parties green?](http://aremythirdpartiesgreen.com) website testing tools.

Check any web page to see if the third-party services being used are being served from verified green web hosts.

## Availability

Available for Firefox here: https://addons.mozilla.org/firefox/addon/are-my-third-parties-green/  
Available for Chrome here: https://chromewebstore.google.com/detail/are-my-third-parties-gree/pihgiflkcmeaghbmdicclkkagfbiamak  

## Installing

1. Check if your `Node.js` version is >= **14**.
2. Change or configurate the name of your extension on `src/manifest`.
3. Run `npm install` to install the dependencies.

## Developing

run the command

```shell
cd amtpg-crx

npm run dev
```

### Chrome Extension Developer Mode

1. set your Chrome browser 'Developer mode' up
2. click 'Load unpacked', and select `amtpg-crx/build` folder

### Nomal FrontEnd Developer Mode

1. access `http://0.0.0.0:3000/`
2. when debugging popup page, open `http://0.0.0.0:3000//popup.html`
3. when debugging options page, open `http://0.0.0.0:3000//options.html`

## Packing

After the development of your extension run the command

```shell
npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

---

Generated by [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext)
