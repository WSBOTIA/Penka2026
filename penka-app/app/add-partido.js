import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db, storage } from '../../src/services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

const teamCountryMap = {
    'Uruguay': 'UY',
    'Argentina': 'AR',
    'Brazil': 'BR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Ecuador': 'EC',
    'Paraguay': 'PY',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'Bolivia': 'BO',
    'Mexico': 'MX',
    'United States': 'US',
    'Canada': 'CA',
};

const AddPartidoScreen = () => {
    const { leagueId } = useLocalSearchParams();
    const router = useRouter();
    const [form, setForm] = useState({
        teamA: '',
        teamB: '',
        teamACode: '',
        teamBCode: '',
        dateTime: '',
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleValueChange = (name, value) => {
        setForm(prevForm => ({ ...prevForm, [name]: value }));
        if (name === 'teamA') {
            setForm(prevForm => ({ ...prevForm, teamACode: teamCountryMap[value] || '' }));
        }
        if (name === 'teamB') {
            setForm(prevForm => ({ ...prevForm, teamBCode: teamCountryMap[value] || '' }));
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const handleUpload = async () => {
        if (!image) return null;
        setLoading(true);
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `mini-banners/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setLoading(false);
        return downloadURL;
    };

    const handleAddMatch = async () => {
        const miniBannerUrl = await handleUpload();

        if (!form.teamA || !form.teamB || !form.dateTime) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);
        try {
            const leagueMatchesRef = collection(db, 'leagues', leagueId, 'matches');
            await addDoc(leagueMatchesRef, {
                ...form,
                miniBannerUrl,
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
            className="w-full bg-input-dark text-white h-14 px-4 rounded-lg"
            placeholder="Equipo A"
            value={form.teamA}
            onChangeText={(value) => handleValueChange('teamA', value)}
        />
        <StyledTextInput
            className="w-full bg-input-dark text-white h-14 px-4 rounded-lg"
            placeholder="Equipo B"
            value={form.teamB}
            onChangeText={(value) => handleValueChange('teamB', value)}
        />
        <StyledTextInput
            className="w-full bg-input-dark text-white h-14 px-4 rounded-lg"
            placeholder="Fecha y Hora (e.g., 2024-12-25 20:00)"
            value={form.dateTime}
            onChangeText={(value) => handleValueChange('dateTime', value)}
        />
        <StyledTouchableOpacity
            className="w-full bg-secondary h-12 rounded-lg justify-center items-center"
            onPress={pickImage}
        >
            <StyledText className="text-white font-bold">Pick a Mini-Banner</StyledText>
        </StyledTouchableOpacity>
        {image && <StyledImage source={{ uri: image }} className="w-full h-32 rounded-lg" />}
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
