import { use, useEffect, useRef } from 'react';
import axiosInstanceRestaurantSystem from '../axiosConfiguration/AxiosInstanceRestaurantSystem';
import * as signalR from "@microsoft/signalr";


export default function SignalRService({ companyOperation, setSignalRAlreadyCharged, updateShiftfData }) {
    const connectionRef = useRef(null);

    async function connectSignalR() {
        if (window.signalRConnection) {
            console.log("⚡ Already connected!");
            return window.signalRConnection;
        }
        window.signalRConnection = true;

        const res = await axiosInstanceRestaurantSystem.post(`/webs/negotiate`);
        const { url, accessToken } = res.data;

        const signalRConnection = new signalR.HubConnectionBuilder()
            .withUrl(url, { accessTokenFactory: () => accessToken })
            .withAutomaticReconnect()
            .build();

        signalRConnection.on("ReceiveMessage", (message) => {
            const messageObj = JSON.parse(message);
            console.log("📩 Received:", messageObj);
            updateShiftfData(messageObj);
        });

        await signalRConnection.start();

        await axiosInstanceRestaurantSystem.put(`/webs/addToGroup/${signalRConnection.connectionId}/${companyOperation?.companyOperationID}`);

        if (signalRConnection.state === signalR.HubConnectionState.Connected) setSignalRAlreadyCharged(true);
        console.log("✅ Connected to SignalR!");

        connectionRef.current = signalRConnection;
    }

    useEffect(() => {
        connectSignalR();

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop().then(() => console.log("🔌 SignalR disconnected"));
                connectionRef.current = null;
            }
        };
    }, []);

    return (
        <>

        </>
    )
}


// export let signalRConnection = null;

// export async function connectSignalR(companyID) {
//     const res = await axiosInstanceRestaurantSystem.post(`/webs/negotiate`);
//     const { url, accessToken } = res.data;

//     signalRConnection = new signalR.HubConnectionBuilder()
//         .withUrl(url, { accessTokenFactory: () => accessToken })
//         .withAutomaticReconnect()
//         .build();

//     signalRConnection.on("ReceiveMessage", (message) => {
//         const messageObj = JSON.parse(message);
//         console.log("📩 Received:", messageObj);
//     });

//     await signalRConnection.start();

//     await axiosInstanceRestaurantSystem.put(`/webs/addToGroup/${signalRConnection.connectionId}/${companyID}`);
//     console.log("✅ Connected to SignalR!");
// }

// export function isSignalRConnected() {
//     let boolSig = null;

//     // console.log("SignalR State:", signalRConnection);
//     if (signalRConnection !== null && signalRConnection.state === signalR.HubConnectionState.Connected) {
//         boolSig = true;
//     }

//     return boolSig;
// }