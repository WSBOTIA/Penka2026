import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../src/services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AddPartidoScreen = () => {
    const { leagueId } = useLocalSearchParams();
    const router = useRouter();
    const [form, setForm] = useState({
        teamA: '',
        teamB: '',
        dateTime: '',
    });
    const [loading, setLoading] = useState(false);

    const handleValueChange = (name, value) => {
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleAddMatch = async () => {
        if (!form.teamA || !form.teamB || !form.dateTime) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);
        try {
            const leagueMatchesRef = collection(db, 'leagues', leagueId, 'matches');
            await addDoc(leagueMatchesRef, {
                teamA: form.teamA,
                teamB: form.teamB,
                dateTime: form.dateTime, // Ideally, this would be a timestamp
                createdAt: serverTimestamp(),
            });
            Alert.alert('Éxito', 'El partido ha sido añadido.');
            router.back();
        } catch (error) {
            console.error("Error adding match: ", error);
            Alert.alert('Error', 'No se pudo añadir el partido.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StyledView className="flex-row items-center p-4 border-b border-neutral-dark">
        <StyledText className="text-lg font-bold text-white text-center flex-1">Añadir Partido</StyledText>
      </StyledView>

      <StyledView className="flex-1 p-4 space-y-4">
        <StyledTextInput
            className="w-full bg-input-dark text-white placeholder-subtle-dark h-14 px-4 rounded-lg"
            placeholder="Equipo A"
            value={form.teamA}
            onChangeText={(value) => handleValueChange('teamA', value)}
        />
        <StyledTextInput
            className="w-full bg-input-dark text-white placeholder-subtle-dark h-14 px-4 rounded-lg"
            placeholder="Equipo B"
            value={form.teamB}
            onChangeText={(value) => handleValueChange('teamB', value)}
        />
        <StyledTextInput
            className="w-full bg-input-dark text-white placeholder-subtle-dark h-14 px-4 rounded-lg"
            placeholder="Fecha y Hora (e.g., 2024-12-25 20:00)"
            value={form.dateTime}
            onChangeText={(value) => handleValueChange('dateTime', value)}
        />
        <StyledTouchableOpacity
            className="w-full bg-primary h-12 rounded-lg flex items-center justify-center"
            onPress={handleAddMatch}
            disabled={loading}
        >
            {loading ? <ActivityIndicator color="#fff" /> : <StyledText className="text-white font-bold text-base">Añadir Partido</StyledText>}
        </StyledTouchableOpacity>
      </StyledView>
    </SafeAreaView>
  );
};

export default AddPartidoScreen;
