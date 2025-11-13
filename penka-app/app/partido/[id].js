import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../src/services/firebase';
import { useGlobalContext } from '../../../src/context/GlobalProvider';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledTextInput = styled(TextInput);

const PartidoScreen = () => {
    const { leagueId, matchId } = useLocalSearchParams();
    const { user } = useGlobalContext();
    const router = useRouter();
    const [match, setMatch] = useState(null);
    const [league, setLeague] = useState(null);
    const [prediction, setPrediction] = useState({ scoreA: '', scoreB: '' });
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userPrediction, setUserPrediction] = useState(null);

    useEffect(() => {
        if (leagueId && matchId) {
            const leagueRef = doc(db, 'leagues', leagueId);
            const matchRef = doc(db, 'leagues', leagueId, 'matches', matchId);

            const unsubscribeLeague = onSnapshot(leagueRef, (docSnap) => {
                if (docSnap.exists()) {
                    setLeague({ id: docSnap.id, ...docSnap.data() });
                }
            });

            const unsubscribeMatch = onSnapshot(matchRef, (docSnap) => {
                if (docSnap.exists()) {
                    setMatch({ id: docSnap.id, ...docSnap.data() });
                }
                setLoading(false);
            });

            const predictionsQuery = query(collection(db, 'leagues', leagueId, 'matches', matchId, 'predictions'));
            const unsubscribePredictions = onSnapshot(predictionsQuery, (querySnapshot) => {
                const predictionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPredictions(predictionsData);
                const userPred = predictionsData.find(p => p.userId === user.uid);
                if (userPred) {
                    setUserPrediction(userPred);
                    setPrediction({ scoreA: userPred.scoreA.toString(), scoreB: userPred.scoreB.toString() });
                }
            });

            return () => {
                unsubscribeLeague();
                unsubscribeMatch();
                unsubscribePredictions();
            };
        }
    }, [leagueId, matchId, user.uid]);

    const handleSavePrediction = async () => {
        if (!prediction.scoreA || !prediction.scoreB) {
            Alert.alert('Error', 'Por favor, ingresa tu predicción para ambos equipos.');
            return;
        }

        setIsSubmitting(true);
        try {
            const predictionRef = doc(db, 'leagues', leagueId, 'matches', matchId, 'predictions', user.uid);
            await setDoc(predictionRef, {
                userId: user.uid,
                userName: user.displayName || user.email, // Assumes user has displayName
                scoreA: parseInt(prediction.scoreA),
                scoreB: parseInt(prediction.scoreB),
                predictedAt: serverTimestamp(),
            }, { merge: true });

            Alert.alert('Éxito', 'Tu predicción ha sido guardada.');
        } catch (error) {
            console.error("Error saving prediction: ", error);
            Alert.alert('Error', 'No se pudo guardar tu predicción.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <SafeAreaView className="flex-1 bg-background-dark justify-center items-center"><ActivityIndicator size="large" color="#fff" /></SafeAreaView>;
    }

    if (!match) {
        return <SafeAreaView className="flex-1 bg-background-dark justify-center items-center"><StyledText className="text-white">Partido no encontrado.</StyledText></SafeAreaView>;
    }

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StyledView className="flex-row items-center p-4 border-b border-neutral-dark">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <StyledText className="text-lg font-bold text-white text-center flex-1">{match.teamA} vs {match.teamB}</StyledText>
            </StyledView>

            <StyledScrollView className="flex-1 p-4 space-y-6">
                <StyledView className="items-center">
                    <StyledText className="text-2xl font-bold text-white">{match.teamA} vs {match.teamB}</StyledText>
                    <StyledText className="text-base text-subtle-dark">{new Date(match.dateTime).toLocaleString()}</StyledText>
                    {match.scoreA !== undefined && (
                         <StyledText className="text-4xl font-bold text-white mt-2">{match.scoreA} - {match.scoreB}</StyledText>
                    )}
                </StyledView>

                <StyledView className="p-4 bg-neutral-dark/50 rounded-lg space-y-4">
                    <StyledText className="text-lg font-bold text-white text-center">
                        {userPrediction ? 'Actualiza tu Predicción' : 'Haz tu Predicción'}
                    </StyledText>
                    <StyledView className="flex-row justify-around items-center">
                        <StyledTextInput
                            className="w-20 bg-input-dark text-white text-center text-xl h-14 rounded-lg"
                            keyboardType="numeric"
                            maxLength={2}
                            value={prediction.scoreA}
                            onChangeText={(text) => setPrediction(prev => ({ ...prev, scoreA: text }))}
                        />
                        <StyledText className="text-2xl font-bold text-white">-</StyledText>
                        <StyledTextInput
                            className="w-20 bg-input-dark text-white text-center text-xl h-14 rounded-lg"
                            keyboardType="numeric"
                            maxLength={2}
                            value={prediction.scoreB}
                            onChangeText={(text) => setPrediction(prev => ({ ...prev, scoreB: text }))}
                        />
                    </StyledView>
                    <StyledTouchableOpacity
                        className="w-full bg-primary h-12 rounded-lg flex items-center justify-center"
                        onPress={handleSavePrediction}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <ActivityIndicator color="#fff" /> : <StyledText className="text-white font-bold text-base">{userPrediction ? 'Actualizar' : 'Guardar'}</StyledText>}
                    </StyledTouchableOpacity>
                </StyledView>

                <StyledView className="space-y-4">
                    <StyledText className="text-lg font-bold text-white">Predicciones de Otros</StyledText>
                    <StyledView className="space-y-3">
                        {predictions.map((p) => (
                            <StyledView key={p.id} className="flex-row items-center justify-between rounded-lg bg-slate-800/50 p-4">
                                <StyledText className="font-medium text-slate-200">{p.userName}</StyledText>
                                <StyledText className="font-bold text-white">{p.scoreA} - {p.scoreB}</StyledText>
                            </StyledView>
                        ))}
                    </StyledView>
                </StyledView>
            </StyledScrollView>

            {league && user && league.creatorId === user.uid && (
                <StyledView className="p-4">
                    <StyledTouchableOpacity
                        className="w-full bg-secondary h-12 rounded-lg flex items-center justify-center"
                        onPress={() => router.push({ pathname: `/partido/add-score`, params: { leagueId, matchId } })}
                    >
                        <StyledText className="text-white font-bold text-base">Añadir Resultado</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            )}
        </SafeAreaView>
    );
};

export default PartidoScreen;
