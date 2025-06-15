import { WelcomeMessage } from "@/components/WelcomeScreen";
import { NativeBaseProvider, Box, Text } from 'native-base';
import React from "react";


export default function HomeScreen() {
  return (
    <NativeBaseProvider>
      <Box flex={1} justifyContent="center" alignItems="center">
        <WelcomeMessage/>
      </Box>
    </NativeBaseProvider>
  )
}
