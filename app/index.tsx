import { Text, StyleSheet, FlatList, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [notes, setNotes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        try {
          const storedNotes = await AsyncStorage.getItem("notes");
          const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
          setNotes(parsedNotes);
        } catch (error) {
          console.log("Erreur lors du chargement des notes :", error);
        }
      };

      loadNotes();
    }, [])
  );

  return (
    <ThemedView style={styles.mainContainer}>
      {notes.length === 0 ? (
        <Text>No notes yet...</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2} // 🟢 Grille 2 colonnes
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <View style={styles.square} />
              </View>
              <Text style={styles.noteText}>
                {item.text ? item.text : "No text"}
              </Text>
              <Text style={styles.noteDate}>
                {item.date ? item.date : "No date"}
              </Text>
            </View>
          )}
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
    width: "48%", // 🟢 2 colonnes
    justifyContent: "space-between",
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
    width: 20,
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 4,
  },
});
