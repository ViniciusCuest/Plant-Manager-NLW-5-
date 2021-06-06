import React from 'react';
import{
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/core';

import Button from '../../components/button';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';


export default function Confirmation(){
    const navigation = useNavigation();

    const routes = useRoute();
    const Params = routes.params;

    const Parametros = {
        title: Params.title,
        subtitle: Params.subtitle,
        buttonTitle: Params.buttonTitle,
        icon: Params.icon,
        nextScreen: Params.nextScreen
    };
    const emojis = {
        hug: '🤗',
        smile: '😄'
    };

    function PreviousPage(){
        navigation.navigate(Parametros.nextScreen);
    }
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>
                    {emojis[Parametros.icon]}
                </Text>
                <Text style={styles.title}>
                    {Parametros.title}
                </Text>
                <Text style={styles.subtitle}>
                    {Parametros.subtitle}
                </Text>
                <View style={styles.footer}>
                    <Button title={Parametros.buttonTitle}Pressed={PreviousPage}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
    },
    content:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: 30,
    },
    title: {
        fontSize: 22,
        fontFamily: fonts.heading,
        textAlign: "center",
        color: colors.heading,
        lineHeight: 38,
        marginTop: 15,
    },
    subtitle: {
        fontFamily: fonts.text,
        textAlign: "center",
        fontSize: 17,
        paddingVertical: 10,
        color: colors.heading
    },
    footer:{
        width: "100%",
        paddingHorizontal: 50,
        marginTop: 20,
    },
    emoji:{
        fontSize:78
    }
});
