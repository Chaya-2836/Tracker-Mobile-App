
import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function Spinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

// // import React, { useEffect, useRef } from 'react';
// // import { View, Animated, StyleSheet, Dimensions, Image } from 'react-native';
// // import { LinearGradient } from 'expo-linear-gradient';

// // const Spinner = () => {
// //   const progress = useRef(new Animated.Value(0)).current;
// //   const screenWidth = Dimensions.get('window').width;

// //   useEffect(() => {
// //     // הפעלת האנימציה
// //     Animated.loop(
// //       Animated.timing(progress, {
// //         toValue: 1,
// //         duration: 1500,
// //         useNativeDriver: true,
// //       })
// //     ).start();
// //   }, []);

// //   const translateX = progress.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, screenWidth], // תזוזת הפס
// //   });

// //   return (
// //     <View style={styles.exteriorContainer}>
// //       {/* הלוגו מוצג מיד */}
// //       <Image
// //         source={require('../assets/images/appsflyer_logo_transparent.png')}
// //         style={styles.logo}
// //         resizeMode="contain"
// //       />

// //       {/* פס טעינה */}
// //       <View style={styles.container}>
// //         <Animated.View
// //           style={[
// //             styles.animatedBar,
// //             { transform: [{ translateX }] },
// //           ]}
// //         >
// //           <LinearGradient
// //             colors={['#7AD143', '#00C2FF', '#7AD143', '#00C2FF']}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 0 }}
// //             style={styles.gradient}
// //           />
// //         </Animated.View>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   exteriorContainer: {
// //     padding: 20,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   logo: {
// //     width: 120,
// //     height: 50,
// //     marginBottom: 10,
// //   },
// //   container: {
// //     height: 3,
// //     width: '50%',
// //     backgroundColor: '#E0E0E0',
// //     overflow: 'hidden',
// //   },
// //   animatedBar: {
// //     position: 'absolute',
// //     width: '100%',
// //     height: '100%',
// //   },
// //   gradient: {
// //     width: '50%',
// //     height: '100%',
// //   },
// // });

// // export default Spinner;
// import React, { useEffect, useRef } from 'react';
// import { View, Image, Animated, StyleSheet, Dimensions, Platform } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const Spinner = () => {
//   const progress = useRef(new Animated.Value(0)).current;
//   const screenWidth = Dimensions.get('window').width;

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(progress, {
//         toValue: 1,
//         duration: 1500,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const translateX = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-screenWidth * 0.5, screenWidth * 0.5],
//   });

//   return (
//     <View style={styles.exteriorContainer}>

//       <Image
//         source={
//           Platform.OS === 'web'
//             ? { uri: process.env.PUBLIC_URL + '/appsflyer_logo_transparent.png' } // Web → public
//             : require('../assets/images/favicon.png') // Mobile → bundle
//         }
//         style={styles.logo}
//         resizeMode="contain"
//       />

//       <View style={styles.container}>
//         <Animated.View
//           style={[
//             styles.animatedBar,
//             { transform: [{ translateX }] },
//           ]}
//         >
//           <LinearGradient
//             colors={['#7AD143', '#00C2FF', '#7AD143', '#00C2FF']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.gradient}
//           />
//         </Animated.View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   exteriorContainer: {
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logo: {
//     width: 120,
//     height: 50,
//     marginBottom: 10,
//   },
//   container: {
//     height: 3,
//     width: '50%',
//     backgroundColor: '#E0E0E0',
//     overflow: 'hidden',
//   },
//   animatedBar: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   },
//   gradient: {
//     width: '50%', 
//     height: '100%',
//   },
// });

// export default Spinner;
