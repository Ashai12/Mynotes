import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ThemedView } from "@/components/ThemedView"; 
import { Link, useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "react-native-paper";

export default function Index() {
  const [notes, setNotes] = useState([]); 
  const [clickStates, setClickStates] = useState({}); // État de priorité de chaque note
  const [checked, setChecked] = useState({}); 
  const [selectionMode, setSelectionMode] = useState(false); // Mode sélection multiple actif ou non

  const navigation = useNavigation(); 
  const router = useRouter(); 

  // Chargement des données à chaque focus de l'écran
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

  // Met à jour le header quand on entre/sort du mode sélection
  useEffect(() => {
    const count = Object.values(checked).filter(Boolean).length;

    if (selectionMode) {
      navigation.setOptions({
        title: `${count} sélectionnée${count > 1 ? "s" : ""}`,
        headerLeft: () => (
          <TouchableOpacity onPress={cancelSelection} style={{ marginLeft: 10 }}>
            <Text style={[styles.headerBtn, { color: "red" }]}>Cancel</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={deleteSelectedNotes} style={{ marginRight: 10 }}>
            <Text style={[styles.headerBtn, { color: "black" }]}>Delete</Text>
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        title: "Dashboard",
        headerLeft: undefined,
        headerRight: undefined,
      });
    }
  }, [selectionMode, checked]);

  // Sauvegarde des états de priorité dans le stockage local
  const saveClickStates = async (newStates) => {
    try {
      await AsyncStorage.setItem("clickStates", JSON.stringify(newStates));
    } catch (error) {
      console.log("Erreur lors de la sauvegarde des états :", error);
    }
  };

  // Gère le changement de couleur (priorité) du carré
  const changeColor = (index) => {
    setClickStates((prevStates) => {
      const newState = (prevStates[index] ?? 0) + 1;
      const updatedStates = { ...prevStates, [index]: newState % 3 };
      saveClickStates(updatedStates);
      return updatedStates;
    });
  };

  // Supprime toutes les notes sélectionnées (après confirmation)
  const deleteSelectedNotes = async () => {
    Alert.alert(
      "Delete",
      "Do you really want to delete all the selected notes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const newNotes = notes.filter((_, index) => !checked[index]);
            const updatedClickStates = {};
            newNotes.forEach((_, newIndex) => {
              updatedClickStates[newIndex] = 0;
            });

            setNotes(newNotes);
            setClickStates(updatedClickStates);
            setChecked({});
            setSelectionMode(false);

            await AsyncStorage.setItem("notes", JSON.stringify(newNotes));
            await AsyncStorage.setItem("clickStates", JSON.stringify(updatedClickStates));
          },
        },
      ]
    );
  };

  // Quitte le mode sélection
  const cancelSelection = () => {
    setSelectionMode(false);
    setChecked({});
  };

  // Active le mode sélection en appuyant longuement
  const onLongPressNote = (index) => {
    setSelectionMode(true);
    setChecked({ [index]: true });
  };

  // Trie les notes selon leur priorité 
  const sortedNotes = [...notes].sort((a, b) => {
    const stateA = clickStates[notes.indexOf(a)] ?? 0;
    const stateB = clickStates[notes.indexOf(b)] ?? 0;
    const priority = { 2: 0, 1: 1, 0: 2 };
    return priority[stateA] - priority[stateB];
  });

  return (
    <ThemedView style={styles.mainContainer}>
      {notes.length === 0 ? (
        <Text>Aucune note pour l’instant...</Text>
      ) : (
        <FlatList
          data={sortedNotes}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => {
            const noteIndex = notes.indexOf(item);

            return (
              <TouchableOpacity
                style={styles.noteItem}
                onLongPress={() => onLongPressNote(noteIndex)}
                onPress={() => {
                  if (selectionMode) {
                    // Sélectionne/désélectionne une note
                    setChecked((prev) => ({
                      ...prev,
                      [noteIndex]: !prev[noteIndex],
                    }));
                  } else {
                    // Sinon, redirige vers l’édition de la note
                    router.push({ pathname: "/edit-note/[id]", params: { id: noteIndex.toString() } });
                  }
                }}
              >
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

                {/* Affiche la checkbox seulement en mode sélection */}
                {selectionMode && (
                  <Checkbox
                    status={checked[noteIndex] ? "checked" : "unchecked"}
                    onPress={() =>
                      setChecked((prev) => ({
                        ...prev,
                        [noteIndex]: !prev[noteIndex],
                      }))
                    }
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Le bouton "Add" s'affiche uniquement en dehors du mode sélection */}
      {!selectionMode && (
        <Link style={styles.button} href="/add-note">
          Add
        </Link>
      )}
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
  headerBtn: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
