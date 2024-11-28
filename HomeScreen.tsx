import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Switch, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const items = ["Item 1", "Item 2", "Item 3"];

export default function HomeScreen({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) {
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadSwitchStates = async () => {
      const savedStates = await AsyncStorage.getItem("switchStates");
      if (savedStates) setSwitchStates(JSON.parse(savedStates));
    };
    loadSwitchStates();
  }, []);

  const toggleSwitch = async (item: string) => {
    const newState = { ...switchStates, [item]: !switchStates[item] };
    setSwitchStates(newState);
    await AsyncStorage.setItem("switchStates", JSON.stringify(newState));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item}</Text>
            <Switch
              value={!!switchStates[item]}
              onValueChange={() => toggleSwitch(item)}
            />
          </View>
        )}
      />
      <Button title="Log out" onPress={() => setIsAuthenticated(false)} />
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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
});
