import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { TextInput, Button, Card } from 'react-native-paper';
import React, { useState } from 'react';

export default function addNoteScreen() {
  const [title, settitle] = useState('');
  const [text, settext] = useState('');

  const handleSubmit = () => {
    if (!title || !text) {
      console.log('Erreur', 'Veuillez remplir tous les champs.');
    } else {
      console.log('Succès', `Title: ${title}\nText: ${text}`);
    }
  };
  return (
   <ThemedView style={styles.mainContainer}>
    <Card>
        <Card.Title title="Note" />
        <Card.Content>
          <TextInput
            label="Title"
            value={title}
            onChangeText={text => settitle(text)}
            mode="outlined"
            activeOutlineColor="#456990"
            style={{ marginBottom: 16 }}
          />
          <TextInput
            label="text"
            value={text}
            onChangeText={text => settext(text)}
            autoCapitalize="none"
            mode="outlined"
            activeOutlineColor="#456990"
            style={{ marginBottom: 16 }}
          />
          <Button mode="outlined" buttonColor="#7EE4EC" textColor="#000"  style={{ borderColor: '#456990', borderWidth: 2 }} onPress={handleSubmit}>
            Submit
          </Button>
        </Card.Content>
      </Card>
   </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FFD4C4",
    flex: 1,
    justifyContent: "center",
  },
});
