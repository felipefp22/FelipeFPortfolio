

export default function SystemPage() {

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '100%' }}>
                    <button style={{ backgroundColor: '#333', border: "2px solid white", color: "white", padding: "10px 20px", marginBottom: '20px', height: '40px' }} onClick={() => window.location.reload()}>Recarregar</button>
                </div>
            </div>
        </>
    );
}