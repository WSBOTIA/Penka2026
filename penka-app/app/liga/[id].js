import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/services/firebase';
import { useGlobalContext } from '../../src/context/GlobalProvider';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const LigaDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useGlobalContext();
    const [league, setLeague] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const leagueRef = doc(db, 'leagues', id);
            const matchesQuery = query(collection(db, 'leagues', id, 'matches'));

            const unsubscribeLeague = onSnapshot(leagueRef, (docSnap) => {
                if (docSnap.exists()) {
                    setLeague({ id: docSnap.id, ...docSnap.data() });
                }
                setLoading(false);
            });

            const unsubscribeMatches = onSnapshot(matchesQuery, (querySnapshot) => {
                const matchesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMatches(matchesData);
            });

            return () => {
                unsubscribeLeague();
                unsubscribeMatches();
            };
        }
    }, [id]);

    const isUserAdmin = user && league && user.uid === league.admin;

    if (loading) {
        return <SafeAreaView className="flex-1 bg-background-dark justify-center items-center"><ActivityIndicator size="large" color="#fff" /></SafeAreaView>;
    }

    if (!league) {
        return <SafeAreaView className="flex-1 bg-background-dark justify-center items-center"><StyledText className="text-white">Liga no encontrada.</StyledText></SafeAreaView>;
    }

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StyledView className="flex-row items-center p-4 border-b border-neutral-dark">
                <StyledText className="text-lg font-bold text-white text-center flex-1">{league.name}</StyledText>
            </StyledView>

            <FlatList
                data={matches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <StyledTouchableOpacity
                        className="p-4 border-b border-neutral-dark"
                        onPress={() => router.push(`/partido/${item.id}?leagueId=${id}`)}
                    >
                        <StyledText className="text-white font-semibold">{item.teamA} vs. {item.teamB}</StyledText>
                        <StyledText className="text-sm text-slate-400">{item.dateTime}</StyledText>
                    </StyledTouchableOpacity>
                )}
                ListEmptyComponent={<StyledText className="text-white text-center p-4">No hay partidos en esta liga.</StyledText>}
            />

            {isUserAdmin && (
                <StyledView className="p-4">
                    <StyledTouchableOpacity
                        className="w-full bg-primary h-12 rounded-lg flex items-center justify-center"
                        onPress={() => router.push(`/add-partido?leagueId=${id}`)}
                    >
                        <StyledText className="text-white font-bold text-base">Añadir Partido</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>
            )}
        </SafeAreaView>
    );
};

export default LigaDetailScreen;
