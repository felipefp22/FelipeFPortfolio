// import { useEffect, useState } from "react";
// import { Linking } from 'react-native';
// import * as AuthSession from "expo-auth-session";
// import { useNavigation } from "expo-router";
// import { IconButton } from "react-native-paper";
// import { getServer } from '../Services/FirebaseServices/FireBaseRemoteConfig';


// // const API_URL = process.env.EXPO_PUBLIC_API_URL;



// export default async function InstagramLogin() {
//     const [API_URL, setAPI_URL] = useState(null); 
    

//     const { navigate } = useNavigation();

//     const redirectUri = AuthSession.makeRedirectUri({
//         useProxy: false, // Use Expo proxy in development
//         native: "akitemtrampo://auth/callback", // Change to your app's scheme
//     });

//     const [request, response, promptAsync] = AuthSession.useAuthRequest({
//         redirectUri,
//         responseType: "code",
//         scopes: ["email"],
//         usePKCE: true,
//     }, {
//         authorizationEndpoint: `${API_URL}/oauth2/authorization/instagram`, // Your backend Google OAuth endpoint
//     });

//     async function handleInstagramLogin() {
//        setAPI_URL(await getServer()); 

//         const result = await promptAsync();
//     }


//     return (
//         <>
//             <IconButton
//                 icon="instagram"
//                 color="#C13584"
//                 size={30}
//                 onPress={handleInstagramLogin}
//             />
//         </>
//     );
// }