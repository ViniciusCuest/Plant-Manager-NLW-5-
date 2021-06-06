import React, { useState, useEffect } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Platform
} from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker'
import { isBefore, format } from 'date-fns';

import Button from '../../components/button';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

import { SavePlant_Storage, LoadSavedPlant_Storage } from '../../libs/storage';

export default function PlantSaved() {

    const navigation = useNavigation();
    const route = useRoute();
    const plant = route.params;
    const data = plant.item;

    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDateTime, setShowDateTime] = useState(Platform.OS === 'ios');

    async function handleSavePlant() {
        try {
            await SavePlant_Storage({ selectedDateTime, data });
            navigation.navigate('Confirmation', {
                title: 'Tudo certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrá-lo de cuidar de sua plantinha com muito cuidado',
                buttonTitle: 'Muito Obrigado :D',
                icon: 'hug',
                nextScreen: 'MyPlants'
            });
        } catch{
            Alert.alert('Não foi possível salvar. 😭');
        }
    }

    function handleChangeTime(dateTime) {
        const ConvertedDateTime = dateTime.nativeEvent.timestamp;

        if (Platform.OS === 'android') {
            setShowDateTime(oldState => !oldState);
        }
        if (ConvertedDateTime && isBefore(ConvertedDateTime, new Date())) {
            setSelectedDateTime(new Date());
            return Alert.alert('Escolha um hora no futuro! ⌚');
        }
        if (ConvertedDateTime) {
            setSelectedDateTime(ConvertedDateTime);
        }
    }

    function handleOpenDatePickerAndroid() {
        setShowDateTime(oldState => !oldState);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri height={150} width={150} uri={data.photo} />
                    <Text style={styles.plantName}>
                        {data.name}
                    </Text>
                    <Text style={styles.plantAbout}>
                        {data.about}
                    </Text>
                </View>
                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image source={require('../../assets/waterdrop.png')} style={styles.tipImage} />
                        <Text style={styles.tipText}>
                            {data.water_tips}
                        </Text>
                    </View>
                    <Text style={styles.alertLabel}>Escolha o melhor horário para ser Lembrado</Text>
                    {showDateTime && (
                        <DateTimePicker value={selectedDateTime} mode="time" display="spinner" onChange={handleChangeTime} />
                    )
                    }
                    {Platform.OS === 'android' && (
                            <TouchableOpacity style={styles.dateTimeButton} onPress={handleOpenDatePickerAndroid}>
                                <Text style={styles.dateTimeText}>
                                    {`Mudar ${format(selectedDateTime, 'HH:mm')}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                    <Button title="Cadastrar Planta" Pressed={handleSavePlant} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.shape,
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.shape
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    plantName: {
        textAlign: "center",
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15,
    },
    plantAbout: {
        textAlign: "center",
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    tipContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: "relative",
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: "justify"
    },
    alertLabel: {
        textAlign: "center",
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimeButton: {
        width: "100%",
        alignItems: "center",
        paddingVertical: 40,
    },
    dateTimeText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    }
});

//            
