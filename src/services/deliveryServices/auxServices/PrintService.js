import { markOrderPrintSyncPrinted } from '../OrderService';

export function verifyNewOrderPrints(printData) {
    printData?.forEach(x => {
        if (x.printSyncs?.length > 0) x.printSyncs?.forEach(y => {
            if (!y.alreadyPrinted) {
                callLocalPrinters(y);
            }
        });
    });

}



// Call Printers
async function callLocalPrinters(orderToPrint) {

    const printersAreOn = true;

    if (printersAreOn) {
        const backendResponse = await markOrderPrintSyncPrinted("no-ID-onBackendLogic", orderToPrint.id);

        if (backendResponse.status === 200) {
            console.log("Marked as printed on backend:", orderToPrint);
        } else {
            console.log("Error to comunicate printed to backend");
        }
    }
}