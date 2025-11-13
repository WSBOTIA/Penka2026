import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TermsAndConditionsModal from '../../src/components/TermsAndConditionsModal';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGlobalContext } from '../../src/context/GlobalProvider';
import { db } from '../../src/services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

const partidos = [
  {
    id: 1,
    teams: 'Real Madrid vs. Barcelona',
    dateTime: '15 de mayo, 20:00',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZAQqfzd9BCDW0qIr4aiJID5bAlbyMm0kcuG8mpNtlGlmDHpw6KZ4x7tvIjFTDjbF0z_YWhlm4dDHsDYWeMozNY0vkpr0Rzpz8BkYH9jL3HUINfHq6gAcMxlHfwf0Nq_MHFmKU4a6nO9JP4Cz1gWGNsGT3MiuaDl_0LiR9MzvFflrtUNHP6Gru9gapFuYhdNpB3itPvFswCNmawWoZhP0w3zRZYm0KBaTvgxWmB5Bvw94M_i3BURw7KhxjF95Jm7wWWggpIACiBo0',
  },
  {
    id: 2,
    teams: 'América vs. Chivas',
    dateTime: '16 de mayo, 19:00',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkiVB9vJUDO7jBpOvYYgdpu0AhPCpXx_zmXVhGxJ7wm3xnyvtDNeS-k4Bpi772Pu4i_lE0Rimo_7rZ94xUlMvPf4eRDFFezCSUczS4wrZVnG4ila0KGDb8e-4JWAiDtEmKmIc-b6OdjkaheASUmCb6bAr736kKR5XeD5E4nRwi4VuBxgTktofjuMUIljmLfZy3t-RRc6vsyptw3-JXuoYPNtsWXDN8y7aAsC3uMcXYmGxuT2iD6EwT_DiajrUz531vrIBnmhJQSQ0',
  },
];

const InicioScreen = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [leagues, setLeagues] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribeBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
        const bannersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBanners(bannersData);
    });

    if (user) {
      const q = query(collection(db, "leagues"), where("participants", "array-contains", user.uid));
      getDocs(q)
        .then((querySnapshot) => {
          const leaguesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLeagues(leaguesData);
        })
        .catch((error) => {
          console.error("Error fetching leagues: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => unsubscribeBanners();
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StyledView className="h-16 flex-row items-center justify-between px-4 border-b border-white/10 bg-background-dark/80">
        <StyledTouchableOpacity onPress={() => router.push('/crear-liga')} className="w-12 items-start">
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </StyledTouchableOpacity>
        <StyledText className="text-lg font-bold text-white">Inicio</StyledText>
        <StyledTouchableOpacity onPress={() => router.push('/perfil')} className="w-12 items-end">
          <MaterialCommunityIcons name="cog" size={28} color="white" />
        </StyledTouchableOpacity>
      </StyledView>

      <StyledScrollView>
        <StyledView className="py-6">
            <StyledScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
                {banners.map(banner => (
                    <StyledTouchableOpacity key={banner.id} className="w-80 h-40 mr-4 rounded-lg overflow-hidden" onPress={() => banner.link && Linking.openURL(banner.link)}>
                        <StyledImage source={{ uri: banner.imageUrl }} className="w-full h-full" />
                    </StyledTouchableOpacity>
                ))}
            </StyledScrollView>
        </StyledView>
        <StyledView className="py-6">
          <StyledText className="px-4 pb-4 text-2xl font-bold text-white">Mis Penkas</StyledText>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <StyledScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {leagues.map((penka) => (
                <StyledTouchableOpacity
                    key={penka.id}
                    className="w-64 mr-4"
                    onPress={() => router.push(`/liga/${penka.id}`)}
                >
                  {/* Using a placeholder image for now as imageUrl is not in the data */}
                  <StyledView className="aspect-video w-full rounded-lg bg-cover bg-center bg-neutral-dark" />
                  <StyledView className="mt-2">
                    <StyledText className="font-semibold text-white">{penka.name}</StyledText>
                    {/* Placeholder for year */}
                    <StyledText className="text-sm text-white/60">2024</StyledText>
                  </StyledView>
                </StyledTouchableOpacity>
              ))}
            </StyledScrollView>
          )}
        </StyledView>

        <StyledView className="py-6">
          <StyledText className="px-4 pb-4 text-2xl font-bold text-white">Partidos</StyledText>
          <StyledView>
            {partidos.map((partido) => (
              <StyledTouchableOpacity
                key={partido.id}
                className="flex-row items-center gap-4 px-4 py-3"
                onPress={() => router.push('/partido')}
              >
                <StyledImage source={{ uri: partido.imageUrl }} className="h-12 w-12 shrink-0 rounded-lg bg-cover bg-center" />
                <StyledView className="flex-1">
                  <StyledText className="font-semibold text-white">{partido.teams}</StyledText>
                  <StyledText className="text-sm text-white/60">{partido.dateTime}</StyledText>
                </StyledView>
                <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        </StyledView>

         <StyledView className="py-6">
            <StyledText className="px-4 pb-4 text-2xl font-bold text-white">Clasificación</StyledText>
            <StyledTouchableOpacity className="flex-row items-center gap-4 px-4 py-3">
                <StyledView className="h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                     <MaterialCommunityIcons name="trophy" size={28} color="#1173d4" />
                </StyledView>
                <StyledText className="flex-1 font-semibold text-white">Tabla de Posiciones</StyledText>
                <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </StyledTouchableOpacity>
        </StyledView>
        <StyledView className="py-6">
            <StyledTouchableOpacity onPress={() => setModalVisible(true)} className="flex-row items-center gap-4 px-4 py-3">
                <StyledView className="h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                     <MaterialCommunityIcons name="file-document-outline" size={28} color="#1173d4" />
                </StyledView>
                <StyledText className="flex-1 font-semibold text-white">Términos y Condiciones</StyledText>
                <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </StyledTouchableOpacity>
        </StyledView>
        {user && user.uid === 'C52A774E-379E-4B9F-831B-E6D829B89A9A' && (
            <StyledView className="py-6">
                <StyledTouchableOpacity onPress={() => router.push('/admin/manage-banners')} className="flex-row items-center gap-4 px-4 py-3">
                    <StyledView className="h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                        <MaterialCommunityIcons name="image" size={28} color="#1173d4" />
                    </StyledView>
                    <StyledText className="flex-1 font-semibold text-white">Manage Banners</StyledText>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
                </StyledTouchableOpacity>
            </StyledView>
        )}
      </StyledScrollView>
      <TermsAndConditionsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default InicioScreen;
