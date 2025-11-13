import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { styled } from 'nativewind';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CustomSelect = ({ label, options, selectedValue, onValueChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSelect = (value) => {
    onValueChange(value);
    toggleModal();
  };

  const selectedLabel = options.find(option => option.value === selectedValue)?.label || 'Seleccionar...';


  return (
    <StyledView>
      <StyledText className="text-base font-medium text-white mb-2">{label}</StyledText>
      <StyledTouchableOpacity
        onPress={toggleModal}
        className="w-full bg-input-dark h-14 px-4 rounded-lg justify-between items-center flex-row border-2 border-transparent focus:border-primary"
      >
        <StyledText className="text-white">{selectedLabel}</StyledText>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#92adc9" />
      </StyledTouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <StyledView className="bg-background-dark p-4 rounded-lg">
          <StyledText className="text-lg font-bold text-white mb-4">{label}</StyledText>
          {options.map((option) => (
            <StyledTouchableOpacity
              key={option.value}
              onPress={() => handleSelect(option.value)}
              className="py-3"
            >
              <StyledText className="text-white text-base">{option.label}</StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      </Modal>
    </StyledView>
  );
};

export default CustomSelect;
