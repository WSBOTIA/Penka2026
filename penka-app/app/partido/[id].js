import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
// ... (other imports)
import { collection, onSnapshot } from 'firebase/firestore';


const PartidoScreen = () => {
    // ... (state and setup)
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        if (leagueId && matchId) {
            // ... (fetch match details)

            const predictionsQuery = query(collection(db, 'leagues', leagueId, 'matches', matchId, 'predictions'));
            const unsubscribe = onSnapshot(predictionsQuery, (querySnapshot) => {
                const predictionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // In a real app, you'd fetch user details for each prediction
                setPredictions(predictionsData);
            });

            return () => unsubscribe();
        }
    }, [leagueId, matchId]);

    // ... (handleSavePrediction)

    if (loading) { /* ... */ }
    if (!match) { /* ... */ }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* ... (header and match details) */}
      <StyledScrollView>
        {/* ... (prediction form) */}

          <StyledView className="space-y-4">
            <StyledText className="text-lg font-bold text-white">Predicciones de Otros</StyledText>
            <StyledView className="space-y-3">
              {predictions.map((p) => (
                <StyledView key={p.id} className="flex-row items-center justify-between rounded-lg bg-slate-800/50 p-4">
                  {/* In a real app, you'd show the user's name */}
                  <StyledText className="font-medium text-slate-200">Usuario {p.id.substring(0, 5)}</StyledText>
                  <StyledText className="font-bold text-white">{p.scoreA} - {p.scoreB}</StyledText>
                </StyledView>
              ))}
            </StyledView>
          </StyledView>
      </StyledScrollView>
    </SafeAreaView>
  );
};

export default PartidoScreen;
