import React, { useEffect } from 'react';
import { useFonts, Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading';

import * as Notifications from 'expo-notifications';

import Routes from './routes';


export default function App(){
    const [fontsLoaded] = useFonts({Jost_400Regular, Jost_600SemiBold});

    useEffect(()=>{
      //const subscriptions = Notifications.addNotificationReceivedListener(
        //async notification => {
         // const data = notification.request.content.data.plant
          
        //});
        //return () => subscriptions.remove(); 

        async function notification(){
          await Notifications.cancelAllScheduledNotificationsAsync();
          const data = await Notifications.getAllScheduledNotificationsAsync();
         console.log("NOTIFICAÇÕES AGENDADAS ############");
         console.log(data);
        }
        notification();
    },[])

    if(!fontsLoaded){
      return(
        <AppLoading/>
      );
    }

    return(
      <Routes/>
    );
}

