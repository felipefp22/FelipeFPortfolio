import { use, useEffect, useState } from "react";
import { cancelOrder } from "../../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { blueOne, greenOne, orangeOne, redOne } from "../../../../../theme/Colors";
import { endShift, openNewShift } from "../../../../../services/deliveryServices/ShiftService";
import { useTranslation } from 'react-i18next';


export default function FinishShiftModal({ close, finishShift, companySelected, requesterAreOwnerOrManager }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const currentShiftData = useSelector((state) => state.companyOperation.currentShift);
    const { t } = useTranslation();

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    async function handleFinishShift() {
        setProcessing(true);

        const response = await endShift(companySelected, currentShiftData?.id, adminPassword);

        if (response.status === 200) {
            finishShift();
        } else {
            if (response.data === "invalidAdminPassword") {
                alert(t('rSys.alert.invalid_admin_password'));
            } else {
                alert(t('rSys.alert.server_error_close_shift'));
            }
        }

        setProcessing(false);
    }


    function formatDateToDayMonth(date) {
        const d = new Date(date);
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

        const day = String(local.getDate()).padStart(2, '0');
        const month = String(local.getMonth() + 1).padStart(2, '0');
        const hours = String(local.getHours()).padStart(2, '0');
        const minutes = String(local.getMinutes()).padStart(2, '0');
        return `${day}/${month} - ${hours}:${minutes}`;
    }

    return (
        <>
            <div className='modalInside' style={{ width: 'auto', padding: '10px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", fontSize: !isPcV ? '20px' : '26px', fontWeight: 'bold' }}>
                {requesterAreOwnerOrManager && <div className='flexColumn fullCenter'>
                    <div className='flexColumn fullCenter' style={{ marginBottom: '20px', lineHeight: 1.8 }}>
                        <span >{t('rSys.phrases.finishShift')}?</span>

                        <span style={{ fontSize: '15px' }}> {t('rSys.words.from')} - <span style={{ color: blueOne(theme) }}>{formatDateToDayMonth(currentShiftData?.startTimeUTC)}</span></span>
                        <span style={{ fontSize: '15px' }}> {t('rSys.words.till')} - <span style={{ color: blueOne(theme) }}>{formatDateToDayMonth(new Date(Date.now() + new Date().getTimezoneOffset() * 60000))}</span></span>
                    </div>

                    <div className='flexColumn fullCenter'>
                        <input className='inputStandart' style={{ textAlign: "center" }} type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); }}
                            placeholder={t('placeHolders.enterAdminPassword')} />
                        <span style={{ fontSize: '14px', color: 'rgba(200,200,200,0.7)' }}>{t('rSys.phrases.defaultPasswordMsg')}</span>
                    </div>

                    {!processing && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '10px' }}>
                        <button className='buttonStandart' style={{ background: 'none', border: "none", color: redOne(theme), fontSize: '16px' }}
                            onClick={() => { close(); }} disabled={processing}>{t('buttons.return')}</button>

                        <button className='buttonStandart' style={{ background: 'none', border: "none", color: greenOne(theme), fontSize: '16px' }}
                            onClick={() => { handleFinishShift() }} disabled={processing}>{t('buttons.finishShift')}</button>
                    </div>}

                    {processing && <div className='flexRow'>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>}

                {!requesterAreOwnerOrManager && <div>
                    <div className='flexColumn fullCenter'>
                        <span style={{ fontSize: '18px' }}>Only Manager can Finish Shift</span>

                        <button className='buttonStandart' style={{ background: 'none', border: "none", color: greenOne(theme), fontSize: '16px', marginTop: '30px' }}
                            onClick={() => { close(); }} disabled={processing}>Ok</button>
                    </div>
                </div>}
            </div>
        </>
    );
}