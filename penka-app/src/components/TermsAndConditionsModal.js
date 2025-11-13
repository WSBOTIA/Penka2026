import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const TermsAndConditionsModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <StyledView className="flex-1 justify-center items-center bg-black/50">
        <SafeAreaView className="w-11/12 h-5/6 bg-background-dark rounded-lg overflow-hidden">
          <StyledView className="p-4 border-b border-neutral-dark">
            <StyledText className="text-xl font-bold text-white text-center">Términos y Condiciones</StyledText>
          </StyledView>

          <StyledScrollView className="p-4">
            <StyledText className="text-lg font-bold text-white mb-2">Introducción</StyledText>
            <StyledText className="text-base text-gray-300 mb-4">
              En Urufile, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestros servicios.
            </StyledText>

            <StyledText className="text-lg font-bold text-white mb-2">Información que Recopilamos</StyledText>
            <StyledText className="text-md font-bold text-white mb-1">Información Personal</StyledText>
            <StyledText className="text-base text-gray-300 mb-2">
              Podemos recopilar la siguiente información personal: Nombre, Dirección de correo electrónico, Dirección postal, Número de teléfono, Información de pago.
            </StyledText>
            <StyledText className="text-md font-bold text-white mb-1">Información No Personal</StyledText>
            <StyledText className="text-base text-gray-300 mb-4">
              También podemos recopilar información no personal, como: Datos de uso de la aplicación, Información del dispositivo, Información de ubicación (si está habilitada).
            </StyledText>

            <StyledText className="text-lg font-bold text-white mb-2">Cómo Utilizamos tu Información</StyledText>
            <StyledText className="text-base text-gray-300 mb-4">
              Utilizamos la información recopilada para los siguientes fines: Proveer y mejorar nuestros servicios, Procesar transacciones, Comunicarnos contigo sobre actualizaciones y promociones, Cumplir con obligaciones legales.
            </StyledText>

            <StyledText className="text-lg font-bold text-white mb-2">Protección de tu Información</StyledText>
            <StyledText className="text-base text-gray-300 mb-4">
              Implementamos medidas de seguridad adecuadas para proteger tus datos personales contra acceso no autorizado, alteración, divulgación o destrucción.
            </StyledText>

            <StyledText className="text-lg font-bold text-white mb-2">Compartir tu Información</StyledText>
            <StyledText className="text-base text-gray-300 mb-4">
              No compartimos tus datos personales con terceros, excepto en los siguientes casos: Proveedores de servicios que nos ayudan a operar nuestro negocio, Cuando sea requerido por la ley, Con tu consentimiento expreso.
            </StyledText>

            <StyledText className="text-lg font-bold text-white mb-2">Tus Derechos</StyledText>
            <StyledText className="text-base text-gray-300 mb-4">
              Tienes derecho a: Acceder a tus datos personales, Solicitar la corrección de datos incorrectos, Solicitar la eliminación de tus datos, Oponerte al procesamiento de tus datos.
            </-StyledText>

            <StyledText className="text-lg font-bold text-white mb-2">Cambios en esta Política de Privacidad</StyledText>
            <StyledText className="text-base text-gray-300 mb-4">
              Podemos actualizar esta política de privacidad periódicamente. Notificaremos cualquier cambio a través de nuestro sitio web o por correo electrónico.
            </StyledText>

            <StyledText className="text-lg font-bold text-white mb-2">Contacto</StyledText>
            <StyledText className="text-base text-gray-300 mb-4">
              Si tienes preguntas o inquietudes sobre nuestra política de privacidad, contáctanos en: Urufile, Correo electrónico: [contacto@urufile.com], Teléfono: [+598 096223614].
            </StyledText>
          </StyledScrollView>

          <StyledView className="p-4 border-t border-neutral-dark">
            <StyledTouchableOpacity
              className="w-full bg-primary h-12 rounded-lg flex items-center justify-center"
              onPress={onClose}
            >
              <StyledText className="text-white font-bold text-base">Cerrar</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </SafeAreaView>
      </StyledView>
    </Modal>
  );
};

export default TermsAndConditionsModal;
