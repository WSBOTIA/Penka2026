import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../../src/services/firebase';
import { doc, updateDoc, getDoc, collection, getDocs, writeBatch, FieldValue } from 'firebase/firestore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AddScoreScreen = () => {
    const { matchId, leagueId } = useLocalSearchParams();
    const router = useRouter();
    const [form, setForm] = useState({
        scoreA: '',
        scoreB: '',
    });
    const [loading, setLoading] = useState(false);

    const handleValueChange = (name, value) => {
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleAddScore = async () => {
        if (!form.scoreA || !form.scoreB) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);
        try {
            const leagueRef = doc(db, 'leagues', leagueId);
            const matchRef = doc(db, 'leagues', leagueId, 'matches', matchId);
            const predictionsRef = collection(db, 'leagues', leagueId, 'matches', matchId, 'predictions');

            const leagueSnap = await getDoc(leagueRef);
            if (!leagueSnap.exists()) {
                throw new Error("League not found");
            }
            const leagueData = leagueSnap.data();
            const scoringRules = leagueData.rules || { exactScorePoints: 5, winnerPoints: 2, drawPoints: 1 };


            const finalScoreA = parseInt(form.scoreA);
            const finalScoreB = parseInt(form.scoreB);

            await updateDoc(matchRef, {
                scoreA: finalScoreA,
                scoreB: finalScoreB,
            });

            const predictionsSnap = await getDocs(predictionsRef);
            const batch = writeBatch(db);

            predictionsSnap.forEach(predictionDoc => {
                const prediction = predictionDoc.data();
                let points = 0;
                if (prediction.scoreA === finalScoreA && prediction.scoreB === finalScoreB) {
                    points = scoringRules.exactScorePoints;
                } else if (finalScoreA === finalScoreB && prediction.scoreA === prediction.scoreB) {
                    points = scoringRules.drawPoints;
                } else if (Math.sign(prediction.scoreA - prediction.scoreB) === Math.sign(finalScoreA - finalScoreB)) {
                    points = scoringRules.winnerPoints;
                }

                if (points > 0) {
                    const userScoreRef = doc(db, 'leagues', leagueId, 'scores', prediction.userId);
                    batch.update(userScoreRef, { score: FieldValue.increment(points) });
                }
            });

            await batch.commit();

            Alert.alert('Éxito', 'El resultado ha sido añadido y las puntuaciones calculadas.');
            router.back();
        } catch (error) {
            console.error("Error adding score: ", error);
            Alert.alert('Error', 'No se pudo añadir el resultado.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StyledView className="flex-row items-center p-4 border-b border-neutral-dark">
        <StyledText className="text-lg font-bold text-white text-center flex-1">Añadir Resultado</StyledText>
      </StyledView>

      <StyledView className="flex-1 p-4 space-y-4">
        <StyledTextInput
            className="w-full bg-input-dark text-white placeholder-subtle-dark h-14 px-4 rounded-lg"
            placeholder="Resultado Equipo A"
            value={form.scoreA}
            onChangeText={(value) => handleValueChange('scoreA', value)}
            keyboardType="numeric"
        />
        <StyledTextInput
            className="w-full bg-input-dark text-white placeholder-subtle-dark h-14 px-4 rounded-lg"
            placeholder="Resultado Equipo B"
            value={form.scoreB}
            onChangeText={(value) => handleValueChange('scoreB', value)}
            keyboardType="numeric"
        />
        <StyledTouchableOpacity
            className="w-full bg-primary h-12 rounded-lg flex items-center justify-center"
            onPress={handleAddScore}
            disabled={loading}
        >
            {loading ? <ActivityIndicator color="#fff" /> : <StyledText className="text-white font-bold text-base">Añadir Resultado</StyledText>}
        </StyledTouchableOpacity>
      </StyledView>
    </SafeAreaView>
  );
};

export default AddScoreScreen;
