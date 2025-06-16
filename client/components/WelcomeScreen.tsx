import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from "../app/styles/welcomeScreen";
import fetchUser from "../scripts/fetchUser";

export function WelcomeMessage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser()
      .then(
        setUser()
      )
      .catch((err: unknown) => {
        console.error("Failed to fetch user:", err);
      });
  }, []);

  return (
    <View>
      <Text style={styles.text}>
        {user.name ? `Hello for you, ${user.name} 😍😍😍` : 'Loading...'}
      </Text>
    </View>
  );
}