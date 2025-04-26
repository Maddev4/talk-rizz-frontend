import { PushNotifications } from '@capacitor/push-notifications';
import { useIonRouter } from "@ionic/react";

class PushNotificationService {    
    static init() {
        PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
                PushNotifications.register();
            } else {
                console.error('Push notification permission not granted');
            }
        });

        PushNotifications.addListener('registration', (token) => {
            console.log('Push registration success, token: ' + token.value);
            // Save the token to your server or use it for notifications
        });

        PushNotifications.addListener('registrationError', (error) => {
            console.error('Push registration error: ', error);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push notification received: ', notification);
            // Handle the received notification
            
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push notification action performed: ', notification);
            // Handle the action from the notification
        });
    }
}

export default PushNotificationService;