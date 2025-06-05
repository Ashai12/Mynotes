import { Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

export default function index() {
  return (
   <ThemedView style={styles.mainContainer}>
    <Text>No notes yet...</Text>
    <Link style={styles.button} href={"/add-note"}> Add  </Link>
   </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: "#456990",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    backgroundColor: "#7EE4EC",
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginBottom: 40,
    marginRight: 20,
  },
  mainContainer: {
    backgroundColor: "#FFD4C4",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});


