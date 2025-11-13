import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useGlobalContext } from '../../src/context/GlobalProvider';
import { db } from '../../src/services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

const ClasificacionScreen = () => {
  const { user } = useGlobalContext();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (user) {
        // 1. Get the user's first league
        const leaguesQuery = query(collection(db, "leagues"), where("participants", "array-contains", user.uid));
        const leaguesSnapshot = await getDocs(leaguesQuery);

        if (!leaguesSnapshot.empty) {
          const firstLeague = leaguesSnapshot.docs[0].data();
          const participantUids = firstLeague.participants;

          // 2. Fetch profile data for each participant
          const participantsData = await Promise.all(
            participantUids.map(async (uid) => {
              const userRef = doc(db, 'users', uid);
              const userSnap = await getDoc(userRef);
              return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
            })
          );
          setParticipants(participantsData.filter(p => p !== null));
        }
      }
      setLoading(false);
    };

    fetchParticipants();
  }, [user]);

  if (loading) {
      return <SafeAreaView className="flex-1 bg-background-dark justify-center items-center"><ActivityIndicator size="large" color="#fff" /></SafeAreaView>
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* ... (Header and Tabs) */}
      <StyledScrollView className="flex-1">
        <StyledView className="divide-y divide-neutral-dark/50">
          {participants.map((player, index) => (
            <StyledView key={player.id} className="flex-row items-center gap-4 p-4">
              <StyledText className="text-base font-medium text-neutral-light">{index + 1}</StyledText>
              <StyledImage source={{ uri: player.photoURL }} className="h-12 w-12 rounded-full" />
              <StyledView className="flex-1">
                <StyledText className="font-semibold text-white">{player.displayName}</StyledText>
                {/* Points are not yet calculated, so display a placeholder */}
                <StyledText className="text-sm text-neutral-light">0 puntos</StyledText>
              </StyledView>
            </StyledView>
          ))}
        </StyledView>
      </StyledScrollView>
    </SafeAreaView>
  );
};

export default ClasificacionScreen;
