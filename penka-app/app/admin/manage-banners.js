import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { db, storage } from '../../src/services/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);

const ManageBannersScreen = () => {
    const [banners, setBanners] = useState([]);
    const [form, setForm] = useState({ title: '', imageUrl: '', link: '' });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'banners'), (snapshot) => {
            const bannersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBanners(bannersData);
        });
        return () => unsubscribe();
    }, []);

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
        const storageRef = ref(storage, `banners/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setLoading(false);
        return downloadURL;
    };

    const handleSaveBanner = async () => {
        let imageUrl = form.imageUrl;
        if (image) {
            imageUrl = await handleUpload();
        }

        if (!form.title || !imageUrl) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            if (editingBanner) {
                const bannerRef = doc(db, 'banners', editingBanner.id);
                await updateDoc(bannerRef, { ...form, imageUrl });
            } else {
                await addDoc(collection(db, 'banners'), {
                    ...form,
                    imageUrl,
                    createdAt: serverTimestamp(),
                });
            }
            setForm({ title: '', imageUrl: '', link: '' });
            setImage(null);
            setEditingBanner(null);
            Alert.alert('Success', 'Banner saved successfully.');
        } catch (error) {
            console.error("Error saving banner: ", error);
            Alert.alert('Error', 'Failed to save banner.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBanner = async (id) => {
        try {
            await deleteDoc(doc(db, 'banners', id));
            Alert.alert('Success', 'Banner deleted successfully.');
        } catch (error) {
            console.error("Error deleting banner: ", error);
            Alert.alert('Error', 'Failed to delete banner.');
        }
    };

    const startEditing = (banner) => {
        setEditingBanner(banner);
        setForm({ title: banner.title, imageUrl: banner.imageUrl, link: banner.link });
        setImage(null);
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StyledView className="p-4 border-b border-neutral-dark">
                <StyledText className="text-lg font-bold text-white text-center">Manage Banners</StyledText>
            </StyledView>

            <StyledScrollView className="flex-1 p-4">
                <StyledView className="space-y-4">
                    <StyledTextInput
                        className="w-full bg-input-dark text-white h-14 px-4 rounded-lg"
                        placeholder="Banner Title"
                        value={form.title}
                        onChangeText={(value) => setForm({ ...form, title: value })}
                    />
                    <StyledTextInput
                        className="w-full bg-input-dark text-white h-14 px-4 rounded-lg"
                        placeholder="Link URL"
                        value={form.link}
                        onChangeText={(value) => setForm({ ...form, link: value })}
                    />
                    <StyledTouchableOpacity
                        className="w-full bg-secondary h-12 rounded-lg justify-center items-center"
                        onPress={pickImage}
                    >
                        <StyledText className="text-white font-bold">Pick an Image</StyledText>
                    </StyledTouchableOpacity>
                    {image && <StyledImage source={{ uri: image }} className="w-full h-32 rounded-lg" />}
                    <StyledTouchableOpacity
                        className="w-full bg-primary h-12 rounded-lg justify-center items-center"
                        onPress={handleSaveBanner}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <StyledText className="text-white font-bold">{editingBanner ? 'Update Banner' : 'Add Banner'}</StyledText>}
                    </StyledTouchableOpacity>
                </StyledView>

                <StyledView className="mt-8">
                    <StyledText className="text-xl font-bold text-white mb-4">Existing Banners</StyledText>
                    {banners.map(banner => (
                        <StyledView key={banner.id} className="p-4 bg-neutral-dark/50 rounded-lg mb-4">
                            <StyledText className="text-white font-bold">{banner.title}</StyledText>
                            <StyledImage source={{ uri: banner.imageUrl }} className="w-full h-32 rounded-lg my-2" />
                            <StyledView className="flex-row justify-end">
                                <StyledTouchableOpacity onPress={() => startEditing(banner)} className="mr-4">
                                    <StyledText className="text-primary">Edit</StyledText>
                                </StyledTouchableOpacity>
                                <StyledTouchableOpacity onPress={() => handleDeleteBanner(banner.id)}>
                                    <StyledText className="text-red-500">Delete</StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>
                        </StyledView>
                    ))}
                </StyledView>
            </StyledScrollView>
        </SafeAreaView>
    );
};

export default ManageBannersScreen;
