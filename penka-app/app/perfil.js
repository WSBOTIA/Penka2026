import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { auth, db } from '../src/services/firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGlobalContext } from '../src/context/GlobalProvider';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-native-modal';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);

const PerfilScreen = () => {
  const { user } = useGlobalContext();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    // ... (fetch user data logic remains the same)
  }, [user]);

  const handleLogout = () => { auth.signOut(); };

  const toggleModal = () => {
    setNewName(userData?.displayName || '');
    setModalVisible(!isModalVisible);
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
        Alert.alert('Error', 'El nombre no puede estar vacío.');
        return;
    }
    const userRef = doc(db, 'users', user.uid);
    try {
        await updateDoc(userRef, { displayName: newName });
        setUserData(prev => ({ ...prev, displayName: newName }));
        toggleModal();
    } catch (error) {
        console.error("Error updating name: ", error);
        Alert.alert('Error', 'No se pudo actualizar el nombre.');
    }
  };

  if (loading) { /* ... */ }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* ... (header) */}
      <StyledScrollView>
        <StyledView className="p-4 items-center gap-4 text-center">
          <StyledView className="relative">
            <StyledImage source={{ uri: userData?.photoURL }} className="h-32 w-32 rounded-full" />
            <StyledTouchableOpacity onPress={toggleModal} className="absolute bottom-0 right-0 h-9 w-9 bg-primary items-center justify-center rounded-full">
              <MaterialCommunityIcons name="pencil" size={20} color="white" />
            </StyledTouchableOpacity>
          </StyledView>
          {/* ... (user info) */}
        </StyledView>
        {/* ... (account section and logout) */}
      </StyledScrollView>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <StyledView className="bg-neutral-dark p-6 rounded-lg space-y-4">
          <StyledText className="text-lg font-bold text-white">Cambiar Nombre</StyledText>
          <StyledTextInput
            className="w-full bg-input-dark text-white h-12 px-4 rounded-lg"
            value={newName}
            onChangeText={setNewName}
          />
          <StyledTouchableOpacity onPress={handleUpdateName} className="bg-primary py-3 rounded-lg">
            <StyledText className="text-white text-center font-bold">Guardar</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </Modal>
    </SafeAreaView>
  );
};

export default PerfilScreen;
