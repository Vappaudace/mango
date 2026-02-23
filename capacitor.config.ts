import type { CapacitorConfig } from '@capacitor/cli';

const isLocal = process.env.CAPACITOR_ENV === 'local';

const config: CapacitorConfig = {
  appId: 'com.mango.app',
  appName: 'Mango',
  // In production the native app loads from Firebase App Hosting (live URL).
  // During local dev with `CAPACITOR_ENV=local npx cap run ios`, it points to localhost.
  webDir: 'out',
  server: isLocal
    ? { url: 'http://localhost:3000', cleartext: true }
    : { url: 'https://studio-3482489049-5e5d0.web.app', androidScheme: 'https' },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1A0A00',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1A0A00',
    },
  },
};

export default config;
