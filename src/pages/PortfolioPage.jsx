import AboutMe from './Portifolio/AboutMe';

export default function PortfolioPage() {

    return (
        <div>
            <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '6px' }} >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'left' }} >
                    <AboutMe />
                </div>
            </div>
        </div>
    );
}