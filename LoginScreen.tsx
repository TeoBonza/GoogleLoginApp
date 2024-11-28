import React from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Google from "expo-auth-session/providers/google";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginScreen({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "<your client Id>",
    redirectUri: "<your redirectUri>",
    scopes: ["profile", "email"],
  });

  React.useEffect(() => {
    console.log("Authentication response:", response);
    if (response?.type === "success" && response.authentication) {
      const { authentication } = response;
      console.log("Authentication successful:", authentication);

      (async () => {
        try {
          const userInfoResponse = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${authentication.accessToken}`
          );
          const userInfo = await userInfoResponse.json();
          console.log("User Info:", userInfo);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      })();
    } else if (response?.type === "cancel") {
      Alert.alert("Login Canceled", "You canceled the login process.");
    } else if (response?.type === "dismiss") {
      Alert.alert("Login Dismissed", "The login screen was dismissed.");
    }
  }, [response]);

  const onSubmit = (data: { email: string; password: string }) => {
    if (data.email === "test@gmail.com" && data.password === "test123") {
      setIsAuthenticated(true);
    } else {
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={value}
              onChangeText={onChange}
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      <Button
        disabled={!request}
        title="Log in with Google"
        onPress={() => promptAsync()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
  },
});
