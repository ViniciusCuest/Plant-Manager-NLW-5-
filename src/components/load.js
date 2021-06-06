import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import LottieView from 'lottie-react-native';

export default function Load(){
    return(
        <View style={styles.container}>
            <LottieView source={require('../assets/load.json')} autoPlay loop style={styles.animation}/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    animation:{
        backgroundColor: "transparent",
        width: 200,
        height: 200,
    }
});