import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';

export async function SavePlant_Storage(plant) {
    try {
        console.log(plant.selectedDateTime);
        const nextTime = new Date(plant.selectedDateTime);

        const now = new Date();

        const times = plant.data.frequency.times;
        const repeat_every = plant.data.frequency.repeat_every;

        if(repeat_every === 'week'){
            const interval = Math.trunc(7 / times);
            nextTime.setDate(now.getDate() + interval);
        }
        //else{ nextTime.setDate(nextTime.getDate() + 1) }

        const seconds = Math.abs(
            Math.ceil(now.getTime() - nextTime.getTime()) / 1000);

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Heeey, 🍃',
                body: `Está na hora de cuidar da sua ${plant.data.name}`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: {
                    plant
                },
            },
            trigger: {
                seconds: seconds < 60 ? 60 : seconds,
                repeats: true
            }
        }); 

        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const oldPlants = data ? (JSON.parse(data)) : {};

        const newPlant = {
            [plant.data.id]: {
                data: plant.data,
                NotificationDateTime: plant.selectedDateTime,
                notificationId
            }
        };
        await AsyncStorage.setItem('@plantmanager:plants', JSON.stringify({
            ...newPlant,
            ...oldPlants
        })); 
    } catch (error) {
        throw new Error(error);
    }
}

export async function LoadSavedPlant_Storage() {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const allPlants = data ? (JSON.parse(data)) : {};


    const plantSorted = Object.keys(allPlants).map((plant) => {
        return {
            ...allPlants[plant],
            hour: format(new Date(allPlants[plant].NotificationDateTime), 'HH:mm')
        }
    }).sort((a, b) =>
        Math.floor(
            new Date(a.NotificationDateTime).getTime() / 1000 - Math.floor(new Date(b.NotificationDateTime).getTime() / 1000)
        )
    );
    console.log(plantSorted);
    return plantSorted;
}

export async function RemovePlant_Storage(plantRemove) {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data)) : {};

    //await Notifications.cancelScheduledNotificationAsync(plants[plantRemove.notificationId]);

    delete plants[plantRemove.data.id];

    await AsyncStorage.setItem('@plantmanager:plants', JSON.stringify(plants));

}
