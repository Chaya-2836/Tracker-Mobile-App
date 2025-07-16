// import 'dotenv/config';

// export default {
//   expo: {
//     name: "client",
//     slug: "client",
//     version: "1.0.0",
//     orientation: "portrait",
//     icon: "./assets/images/icon.png",
//     scheme: "client",
//     userInterfaceStyle: "automatic",
//     newArchEnabled: true,
//     ios: {
//       supportsTablet: true
//     },
//       "splash": {
//       "image": "./assets/images/appsflyer_logo_transparent.png",
//       "resizeMode": "contain",
//       "backgroundColor": "#ffffff"
//     },
//     android: {
//       adaptiveIcon: {
//         foregroundImage: "./assets/images/adaptive-icon.png",
//         backgroundColor: "#ffffff"
//       },
//       edgeToEdgeEnabled: true
//     },
//     web: {
//       bundler: "metro",
//       output: "static",
//       favicon: "./assets/images/favicon.png"
//     },
//     plugins: [
//       "expo-router",
//       [
//         "expo-splash-screen",
//         {
//           image: "./assets/images/splash-icon.png",
//           imageWidth: 200,
//           resizeMode: "contain",
//           backgroundColor: "#ffffff"
//         }
//       ]
//     ],
//     experiments: {
//       typedRoutes: true
//     },
//     extra: {
//       API_BASE: process.env.API_BASE
//     }
//   }
// };
import 'dotenv/config';

export default {
  expo: {
    name: "client",
    slug: "client",
    version: "1.0.0",
    orientation: "portrait",
    favicon: "./assets/images/favicon.png",
    scheme: "client",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/favicon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/images/favicon.png",
      bundler: "metro",
      output: "static",
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/images/favicon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      API_BASE: process.env.API_BASE
    }
  }
};
