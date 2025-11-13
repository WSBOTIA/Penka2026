import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomSelect from '../../src/components/CustomSelect';
import { useGlobalContext } from '../../src/context/GlobalProvider';
import { db } from '../../src/services/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const scoringSystems = [
    { label: 'Estándar', value: 'standard' },
    { label: 'Personalizado', value: 'custom' },
];
const exactScorePoints = [ { label: '5 Puntos', value: 5 }, /* ... */ ];
const winnerPoints = [ { label: '1 Punto', value: 1 }, /* ... */ ];
const drawPoints = [ { label: '0 Puntos', value: 0 }, /* ... */ ];


const CrearLigaScreen = () => {
    const { user } = useGlobalContext();
    const router = useRouter();
    const [form, setForm] = useState({ /* ... */ });
    const [participantEmail, setParticipantEmail] = useState('');
    const [participants, setParticipants] = useState([user.email]);
    const [loading, setLoading] = useState(false);

    // ... (logic)

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StyledView className="flex-row items-center p-4 border-b border-neutral-dark">
        <StyledText className="text-lg font-bold text-white text-center flex-1">Crear Liga</StyledText>
      </StyledView>

      <StyledScrollView className="flex-1 px-4 py-6 space-y-8">
        <StyledView className="space-y-2">
          <StyledTextInput
            className="w-full bg-input-dark text-white placeholder-subtle-dark h-14 px-4 rounded-lg"
            placeholder="Nombre de la Liga"
            value={form.leagueName}
            onChangeText={(value) => handleValueChange('leagueName', value)}
          />
        </StyledView>

        <StyledView className="space-y-6">
          <StyledText className="text-xl font-bold text-white">Configuración de Reglas</StyledText>
          <StyledView className="space-y-4">
            <CustomSelect
                label="Sistema de Puntuación"
                options={scoringSystems}
                selectedValue={form.scoringSystem}
                onValueChange={(value) => handleValueChange('scoringSystem', value)}
            />
            {/* ... Other selects */}
          </StyledView>
        </StyledView>

        <StyledView className="space-y-4">
          <StyledText className="text-xl font-bold text-white">Participantes</StyledText>
          {/* ... Participants UI */}
        </StyledView>
      </StyledScrollView>

      <StyledView className="p-4 bg-background-dark/80">
        <StyledTouchableOpacity
            className="w-full bg-primary h-12 rounded-lg flex items-center justify-center"
            onPress={handleCreateLeague}
            disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <StyledText className="text-white font-bold text-base">Crear Liga</StyledText>}
        </StyledTouchableOpacity>
      </StyledView>
    </SafeAreaView>
  );
};

export default CrearLigaScreen;
