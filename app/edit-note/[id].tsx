// /app/edit-note/[id].tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditNote() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState({ title: "", text: "", date: "" });
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem("notes");
        const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
        setNotes(parsedNotes);

        const index = parseInt(id as string);
        const selectedNote = parsedNotes[index];
        if (selectedNote) {
          setNote(selectedNote);
        }
      } catch (error) {
        console.log("Erreur lors du chargement :", error);
      }
    };

    loadNote();
  }, [id]);

  const handleSave = async () => {
    try {
      const updatedNotes = [...notes];
      updatedNotes[parseInt(id as string)] = note;
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
      router.back(); // revenir à la liste
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sauvegarder la note.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={note.title}
        onChangeText={(text) => setNote((n) => ({ ...n, title: text }))}
      />
      <Text style={styles.label}>Text</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={note.text}
        multiline
        onChangeText={(text) => setNote((n) => ({ ...n, text }))}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#FFD4C4",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 6,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});




