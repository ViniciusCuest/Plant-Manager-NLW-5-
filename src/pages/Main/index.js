import React, { useEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import api from '../../service/api';
import { useNavigation } from '@react-navigation/core';

import Load from '../../components/load';
import Header from '../../components/header';
import EnviromentButton from '../../components/enviromentButtom'
import PlantCardPrimary from '../../components/plantCardPrimary';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default function Main(){
    const [environments, setEnvironments] = useState([]);
    const [plants, setPlants] = useState([]);
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [SelectFilter, setSelectFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigation = useNavigation();

    //======= Filtra Plantas(){} ======
    function handleSelectFilter(filteredOption){
        setSelectFilter(filteredOption);

        if(filteredOption === 'all')
            return setFilteredPlants(plants);
        
        const filtered = plants.filter(plant => 
            plant.environments.includes(filteredOption)            
        );
        setFilteredPlants(filtered);
    }

    function handleFetchMore(distance){
        if(distance < 1){
            return;
        }
        else{
            setLoadingMore(true);
            setPage(oldValue => oldValue + 1);
            FetchPlants();
        }
    }

    function handlePlantSelect(item){
        navigation.navigate('plantSaved',{item});
    }

    //======= async GET Ambientes(){} via api ======
    async function FetchEnviroment(){
        const {data} = await api.get('plants_environments?_sort=title&order=asc');
        setEnvironments([{
            key: 'all',
            title: 'Todos',
        }, ...data]);
    }

    //======= async GET Plantas(){} via api ======
    async function FetchPlants(){
        const {data} = await api.get(`plants?_sort=name&order=asc&_page=${page}&_limit=8`);
        if(!data){
            return setLoading(true);
        }
        if(page > 1){
            setPlants(oldValue => [...oldValue, ...data]);
            setFilteredPlants(oldValue => [...oldValue, ...data]);
        }else{
            setPlants(data);
            setFilteredPlants(data);
        }
        setLoadingMore(false);
    }

    //======= Cria os Elementos quando a interface é aberta, fazendo a requisição via API ======
    useEffect(()=>{
        FetchEnviroment();
        FetchPlants();
            setTimeout(() => {
                setLoading(false);
            }, 4500);
    },[]);

    if(loading)
        return <Load/>
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Header/>
                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
                </Text>
            </View>
            <View>
                <FlatList data={environments} keyExtractor={(item) => String(item.key)}
                renderItem={({item})=>(
                    <EnviromentButton title={item.title} active={item.key === SelectFilter} onClick={()=>handleSelectFilter(item.key)}/>
                )}  horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.enviromentList} />
            </View>

            <View style={styles.plants}>
                <FlatList data={filteredPlants} keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) =>( 
                    <PlantCardPrimary data={item} onClick={()=> handlePlantSelect(item)} /> )} 
                        showsVerticalScrollIndicator={false} 
                        numColumns={2} 
                        onEndReachedThreshold={0.1} 
                        onEndReached={({ distanceFromEnd }) => 
                            handleFetchMore(distanceFromEnd) } 
                        ListFooterComponent={
                            loadingMore ? <ActivityIndicator color={colors.green} size="large" /> : <></> 
                }/>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.background
    },
    header:{
        paddingHorizontal: 30
    },
    title:{
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle:{
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    enviromentList:{
        justifyContent: "center",
        paddingLeft: 32,
        paddingBottom: 5,
        marginTop: 30
    },
    plants:{
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: "center"
    },
});
