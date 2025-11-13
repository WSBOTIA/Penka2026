import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../src/context/GlobalProvider';
import { db } from '../../src/services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const MisPenkasScreen = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "leagues"), where("participants", "array-contains", user.uid));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const leaguesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeagues(leaguesData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching leagues: ", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
      return <SafeAreaView className="flex-1 bg-background-dark justify-center items-center"><ActivityIndicator size="large" color="#fff" /></SafeAreaView>
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StyledView className="flex-row items-center p-4 border-b border-neutral-dark">
        <StyledText className="text-lg font-bold text-white text-center flex-1">Mis Penkas</StyledText>
      </StyledView>
      <FlatList
        data={leagues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StyledTouchableOpacity
            className="p-4 border-b border-neutral-dark flex-row items-center"
            onPress={() => router.push(`/liga/${item.id}`)}
          >
            <StyledView className="w-16 h-16 bg-neutral-dark rounded-lg mr-4" />
            <StyledView>
                <StyledText className="text-white font-semibold text-lg">{item.name}</StyledText>
                <StyledText className="text-sm text-slate-400">{item.participants.length} participante(s)</StyledText>
            </StyledView>
          </StyledTouchableOpacity>
        )}
        ListEmptyComponent={<StyledText className="text-white text-center p-4">No estás en ninguna liga.</StyledText>}
      />
    </SafeAreaView>
  );
};

export default MisPenkasScreen;
