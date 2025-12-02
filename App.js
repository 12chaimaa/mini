import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function MiniJeuInteractif() {
  const [codeSecret, setCodeSecret] = useState(genererCode());
  const [proposition, setProposition] = useState('');
  const [historique, setHistorique] = useState([]);
  const [tentatives, setTentatives] = useState(0);

  function genererCode() {
    return Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
  }

  function analyserProposition(prop, code) {
    const feedback = [];
    const codeUtilise = [false, false, false];
    const propUtilise = [false, false, false];

    // Étape 1 : Correct
    for (let i = 0; i < 3; i++) {
      if (prop[i] === code[i]) {
        feedback[i] = 'Correct';
        codeUtilise[i] = true;
        propUtilise[i] = true;
      }
    }

   
    for (let i = 0; i < 3; i++) {
      if (!propUtilise[i]) {
        for (let j = 0; j < 3; j++) {
          if (!codeUtilise[j] && prop[i] === code[j]) {
            feedback[i] = 'Present';
            codeUtilise[j] = true;
            propUtilise[i] = true;
            break;
          }
        }
      }
    }

    
    for (let i = 0; i < 3; i++) {
      if (!feedback[i]) {
        feedback[i] = 'Absent';
      }
    }

    return feedback;
  }

  function validerProposition() {
    if (proposition.length !== 3 || !/^\d{3}$/.test(proposition)) return;

    const feedback = analyserProposition(proposition, codeSecret);
    const nouvelleTentative = {
      proposition,
      feedback,
    };

    setHistorique([...historique, nouvelleTentative]);
    setTentatives(tentatives + 1);
    setProposition('');
  }

  function rejouer() {
    setCodeSecret(genererCode());
    setHistorique([]);
    setTentatives(0);
    setProposition('');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mini jeu - Code secret</Text>

      <Text style={styles.label}>Votre proposition :</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez une combinaison à 3 chiffres"
        keyboardType="numeric"
        maxLength={3}
        value={proposition}
        onChangeText={setProposition}
      />

      <Button
        title="Valider"
        onPress={validerProposition}
        disabled={proposition.length !== 3 || !/^\d{3}$/.test(proposition)}
      />

      <View style={styles.historyBox}>
        <Text style={styles.historyTitle}>Historique des tentatives ({tentatives})</Text>
        {historique.length === 0 ? (
          <Text style={styles.historyText}>Aucune tentative pour le moment.</Text>
        ) : (
          historique.map((item, index) => (
            <Text key={index} style={styles.historyText}>
              Tentative {index + 1} : {item.proposition} → {item.feedback.join(', ')}
            </Text>
          ))
        )}
      </View>

      <Button title="Rejouer" onPress={rejouer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  historyBox: {
    width: '100%',
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  historyTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyText: {
    color: 'gray',
    marginBottom: 5,
  },
});
