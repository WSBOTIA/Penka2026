import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

/*
  ********************************************************************************
  * NOTA IMPORTANTE PARA EL DESARROLLADOR:
  ********************************************************************************
  *
  * La funcionalidad para mostrar todos los partidos de las ligas de un usuario
  * requiere un índice compuesto en Firestore que no puede ser creado
  * mediante programación.
  *
  * Para habilitar esta pantalla, por favor, crea manualmente el siguiente
  * índice en tu consola de Firebase:
  *
  * 1. Colección: `matches` (habilita la consulta de grupo de colecciones).
  * 2. Campos a indexar:
  *    - `leagueId`: Ascendente
  *    - `createdAt`: Descendente (o el campo que uses para ordenar los partidos)
  * 3. Habilita la consulta.
  *
  * Una vez creado el índice, puedes reemplazar el contenido de esta pantalla con
  * la lógica de consulta que se encontraba aquí anteriormente.
  *
  ********************************************************************************
*/

const PartidosScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StyledView className="flex-row items-center p-4 border-b border-neutral-dark">
        <StyledText className="text-lg font-bold text-white text-center flex-1">Partidos</StyledText>
      </StyledView>
      <StyledView className="flex-1 justify-center items-center p-4">
        <StyledText className="text-white text-center mb-4">
          Esta funcionalidad requiere una configuración adicional en la base de datos.
        </StyledText>
        <StyledText className="text-slate-400 text-center text-sm">
          (Ver nota en el código de PartidosScreen.js para más detalles sobre cómo crear el índice de Firestore necesario).
        </StyledText>
      </StyledView>
    </SafeAreaView>
  );
};

export default PartidosScreen;
