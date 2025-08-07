const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    electronVersion: '23.6.8', // Última versão com suporte experimental ao Win7
    win32metadata: {
      minimumSupportedWindowsRelease: 'win7',
    },
    asar: true,
    icon: './assets/icon',
    ignore: [
      /^\/tests?/,
      /^\/docs?/,
      /\.md$/,
      /\.ts$/,
      /\.map$/,
      /\/node_modules\/.*\/(test|tests|example|docs)\//,
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      config: {
        icon: './assets/icons/win/icon.ico',
        arch: 'x86', 
        platform: 'win32',
      },
      platforms: ['win32'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './assets/icons/linux/icon.png',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
