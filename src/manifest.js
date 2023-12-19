import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

export default defineManifest({
  name: "Are my third parties green?",
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  // default_locale: 'en',
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  // options_page: 'options.html',
  // devtools_page: 'devtools.html',
  // background: {
  //   service_worker: 'src/background/index.js',
  //   scripts: ['src/utils/ext.js', 'src/background/index.js'],
  //   type: 'module',
  // },
  // content_scripts: [
  //   {
  //     matches: ['http://*/*', 'https://*/*'],
  //     js: ['src/contentScript/index.js'],
  //   },
  // ],
  side_panel: {
    default_path: 'sidepanel.html',
  },
  // web_accessible_resources: [
  //   {
  //     resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
  //     matches: ['http://*/*', 'https://*/*'],
  //   },
  // ],
  permissions: ["sidePanel", "tabs",  "scripting",  "activeTab"],
  host_permissions: ['<all_urls>'],
})
