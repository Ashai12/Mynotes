// /app/index.tsx

import { Text, StyleSheet, FlatList, View, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from 'react-native-paper';

export default function Index() {
  const [notes, setNotes] = useState([]);
  const [clickStates, setClickStates] = useState<{ [key: number]: number }>({});
  const [checked, setChecked] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const storedNotes = await AsyncStorage.getItem("notes");
          const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
          setNotes(parsedNotes);

          const storedStates = await AsyncStorage.getItem("clickStates");
          const parsedStates = storedStates ? JSON.parse(storedStates) : {};
          setClickStates(parsedStates);
        } catch (error) {
          console.log("Erreur lors du chargement :", error);
        }
      };

      loadData();
    }, [])
  );

  const saveClickStates = async (newStates: { [key: number]: number }) => {
    try {
      await AsyncStorage.setItem("clickStates", JSON.stringify(newStates));
    } catch (error) {
      console.log("Erreur lors de la sauvegarde des états :", error);
    }
  };

  const changeColor = (index: number) => {
    setClickStates((prevStates) => {
      const newState = (prevStates[index] ?? 0) + 1;
      const updatedStates = { ...prevStates, [index]: newState % 3 };
      saveClickStates(updatedStates);
      return updatedStates;
    });
  };

  const sortedNotes = [...notes].sort((a, b) => {
    const stateA = clickStates[notes.indexOf(a)] ?? 0;
    const stateB = clickStates[notes.indexOf(b)] ?? 0;
    const priority = { 2: 0, 1: 1, 0: 2 };
    return priority[stateA] - priority[stateB];
  });

  const onPressFunction = () => {
    alert("Long press detected!");
    <Checkbox
                       status={checked ? 'checked' : 'unchecked'}
                       onPress={() => {
                         setChecked(!checked);
                       }}
                  />
  }

  return (
    <ThemedView style={styles.mainContainer}>
      {notes.length === 0 ? (
        <Text>No notes yet...</Text>
      ) : (
        <FlatList
          data={sortedNotes}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => {
            const noteIndex = notes.indexOf(item);
            return (
              <Link
                href={{ pathname: "/edit-note/[id]", params: { id: noteIndex.toString() } }}
                asChild
              >
                <TouchableOpacity style={styles.noteItem} onLongPress={() => onPressFunction()}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteTitle}>{item.title}</Text>
                    <TouchableOpacity
                      style={[
                        styles.square,
                        clickStates[noteIndex] === 1 && styles.orange,
                        clickStates[noteIndex] === 2 && styles.green,
                      ]}
                      onPress={() => changeColor(noteIndex)}
                    />
                  </View>
                  <Text style={styles.noteText}>{item.text || "No text"}</Text>
                  <Text style={styles.noteDate}>{item.date || "No date"}</Text>
                  
                </TouchableOpacity>
              </Link>
            );
          }}
        />
      )}

      <Link style={styles.button} href="/add-note">
        Add
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: "#456990",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#7EE4EC",
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 40,
    marginRight: 20,
  },
  mainContainer: {
    backgroundColor: "#FFD4C4",
    flex: 1,
    padding: 20,
  },
  noteItem: {
    backgroundColor: "#E3E7E8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: "48%",
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  noteText: {
    fontSize: 14,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: "#444",
  },
  square: {
    width: 30,
    height: 30,
    backgroundColor: "#ccc",
    borderRadius: 4,
  },
  orange: {
    backgroundColor: "orange",
  },
  green: {
    backgroundColor: "green",
  },
});
