import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    SafeAreaView,
    FlatList,
    Alert,
} from 'react-native';
import { LoadSavedPlant_Storage, RemovePlant_Storage } from '../../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';

import Header from '../../components/header';
import Load from '../../components/load';
import PlantCardSecondary from '../../components/plantCardSecondary';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function MyPlants() {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextWater, setNextWater] = useState("");

    function handleRemove(plantId) {
        Alert.alert('Remover', `Deseja remover a ${plantId.data.name}?`, [
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        await RemovePlant_Storage(plantId);
                        setPlants((oldData) =>
                            oldData.filter((item) => item.data.id !== plantId.data.id)
                        );
                    } catch (error) {
                        Alert.alert('Não foi possível remover!');
                    }
                }
            }
        ]);
    }

    useEffect(() => {
        async function LoadStorageData() {
            const plantStoraged = await LoadSavedPlant_Storage();
            console.log(plantStoraged);
            if(plantStoraged !== []){
                const nextTime = formatDistance(new Date(plantStoraged[0].NotificationDateTime).getTime(), new Date().getTime(), { locale: pt });
                setNextWater(`Não esqueça de regar a ${plantStoraged[0].data.name} à ${nextTime}`);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                setPlants(plantStoraged);
            }
            else{
                setLoading(false);
                Alert.alert('Impossível de acessar');
            }
        }
        LoadStorageData();
    }, []);

    if (loading)
        return <Load />

    
    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.spotlight}>
                <Image source={require('../../assets/waterdrop.png')} style={styles.spotLightImage} />
                <Text style={styles.spotlightText}>{nextWater}</Text>
            </View>
            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                </Text>
                <FlatList data={plants} keyExtractor={(item) => String(item.data.id)} renderItem={({ item }) => (
                    <PlantCardSecondary items={item} handleRemove={() => { handleRemove(item) }} />
                )} showsVerticalScrollIndicator={false} />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 15,
        borderRadius: 20,
        height: 110,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    },
    spotLightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        marginLeft: 5
    },
    plants: {
        flex: 1,
        width: "100%"
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
});
