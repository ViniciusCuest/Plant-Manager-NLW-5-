import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet, 
    Text,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export default function Header(){
    const [userName, setUserName] = useState("");

    useEffect(()=>{

        async function CatchName(){
            const user = await AsyncStorage.getItem('@plantmanager:user');
            setUserName(user || '');
        }
        CatchName();
        
    },[]);
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.userName}>{userName}</Text>
            </View>
            <Image source={require('../assets/profile.png')} style={styles.image}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        backgroundColor: colors.background,
        marginTop: Constants.statusBarHeight,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    greeting:{
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text
    },
    userName:{
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading
    }
});