import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import styles from "../app/styles/welcomeScreen"
import fetchUser from "../scripts/fetchUser";

type User = {
  name: string;
  [key: string]: any; 
};

export function WelcomeMessage() {
  const [user, setUser] = useState<{ name?: string }>({});

  useEffect(() => {
    fetchUser()
      .then(
        setUser
      )
      .catch((err: unknown) => {
        console.error("Failed to fetch user:", err);
      });
  }, []);

  return (
    <View>
      <Text style={styles.text}>
        {user?.name ? `Hello for you, ${user.name} 😍😍😍` : "Loading..."}
      </Text>
    </View>
  );
}
