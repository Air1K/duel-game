import React, {useCallback, useState} from 'react';
import DuelCanvas from '../DuelCanvas/DuelCanvas';
import styles from "./DuelGameStyle.module.scss"

interface HitState {
    hero1: number;
    hero2: number;
}
const DuelGame: React.FC = () => {
    const [hero1Speed, setHero1Speed] = useState<number>(2);
    const [hero1FireRate, setHero1FireRate] = useState<number>(1000);
    const [hero2Speed, setHero2Speed] = useState<number>(2);
    const [hero2FireRate, setHero2FireRate] = useState<number>(1000);
    const [hit, setHit] = useState<HitState>({ hero1: 0, hero2: 0 });

    const setHitHandler = useCallback((hitId: number) => {
        setHit((prevHit: HitState) => ({
            ...prevHit,
            [hitId === 0 ? 'hero1' : 'hero2']: prevHit[hitId === 0 ? 'hero1' : 'hero2'] + 1,
        }));
    }, []);

    return (
        <div>
            <DuelCanvas
                hero1Speed={hero1Speed}
                hero1FireRate={hero1FireRate}
                hero2Speed={hero2Speed}
                hero2FireRate={hero2FireRate}
                setHitHandler={setHitHandler}
            />
            <div>
                <h2>Hit</h2>
                <div className={styles.hit}>
                    <label>Hero 1:</label>
                    <span>{hit.hero1}</span>

                    <label>Hero 2:</label>
                    <span>{hit.hero2}</span>
                </div>
            </div>
            <div>
                <h2>Hero 1 Controls</h2>
                <label>Speed</label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={hero1Speed}
                    onChange={(e) => setHero1Speed(parseInt(e.target.value))}
                />
                <label style={{marginLeft: "10px"}}>Fire Rate</label>
                <input
                    type="range"
                    min="100"
                    max="2000"
                    value={hero1FireRate}
                    onChange={(e) => setHero1FireRate(parseInt(e.target.value))}
                />
            </div>
            <div>
                <h2>Hero 2 Controls</h2>
                <label>Speed</label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={hero2Speed}
                    onChange={(e) => setHero2Speed(parseInt(e.target.value))}
                />
                <label style={{marginLeft: "10px"}}>Fire Rate</label>
                <input
                    type="range"
                    min="100"
                    max="2000"
                    value={hero2FireRate}
                    onChange={(e) => setHero2FireRate(parseInt(e.target.value))}
                />
            </div>
        </div>
    );
};

export default DuelGame;