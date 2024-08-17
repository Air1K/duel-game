import React, {useRef, useEffect, useState, memo} from 'react';
import Modal from "../Modal/Modal";

interface Hero {
    id: number;
    x: number;
    y: number;
    radius: number;
    color: string;
    direction: number;
    speed: number;
    bullets: Bullet[];
    fireRate: number;
    bulletColor: string;
}

interface Bullet {
    x: number;
    y: number;
    radius: number;
    color: string;
    direction: number;
    speed: number;
}

interface DuelCanvasProps {
    hero1Speed: number;
    hero1FireRate: number;
    hero2Speed: number;
    hero2FireRate: number;
    setHitHandler: (hitId: number) => void
}

const DuelCanvas: React.FC<DuelCanvasProps> = ({ hero1Speed, hero1FireRate, hero2Speed, hero2FireRate, setHitHandler }) => {
    console.log( hero1Speed, hero1FireRate, hero2Speed, hero2FireRate, setHitHandler );
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const hero1Ref = useRef<Hero>({
        id: 0,
        x: 50,
        y: 150,
        radius: 20,
        color: 'blue',
        direction: 1,
        speed: 0,
        bullets: [],
        fireRate: hero1FireRate,
        bulletColor: "#0000ff"
    });

    const hero2Ref = useRef<Hero>({
        id: 1,
        x: 550,
        y: 150,
        radius: 20,
        color: 'red',
        direction: 1,
        speed: 0,
        bullets: [],
        fireRate: hero2FireRate,
        bulletColor: "#ff0000"
    });
    const heroes: Hero[] = [hero1Ref.current, hero2Ref.current];

    const updateHero = () => {
        hero1Ref.current.speed = hero1Speed;
        hero2Ref.current.speed = hero2Speed;
        hero1Ref.current.fireRate = hero1FireRate;
        hero2Ref.current.fireRate = hero2FireRate;
    }

    const getContextCanvas = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                setContext(ctx);
            }
        }
    }

    const drawHeroes = (ctx: CanvasRenderingContext2D) => {
        heroes.forEach(hero => {
            ctx.beginPath();
            ctx.arc(hero.x, hero.y, hero.radius, 0, 2 * Math.PI);
            ctx.fillStyle = hero.color;
            ctx.fill();
            ctx.closePath();
        });
    }

    const moveHeroes = () => {
        heroes.forEach(hero => {
            hero.y += hero.speed * hero.direction;

            if (hero.y - hero.radius < 0 || hero.y + hero.radius > 300) {
                hero.direction *= -1;
            }

            const dx = hero.x - mousePosition.current.x;
            const dy = hero.y - mousePosition.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < hero.radius) {
                if (hero.y - 20 + hero.speed * hero.direction < hero.radius) {
                    hero.y = hero.radius;
                } else if (hero.y + 20 + hero.speed * hero.direction > 300 - hero.radius) {
                    hero.y = 300 - hero.radius;
                } else {
                    hero.direction = dy / Math.abs(dy);
                }
            }
        });
    };

    const drawBullets = (ctx: CanvasRenderingContext2D) => {
        heroes.forEach(hero => {
            hero.bullets.forEach(bullet => {
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
                ctx.fillStyle = bullet.color;
                ctx.fill();
                ctx.closePath();
            });
        });
    };

    const moveBullets = () => {
        heroes.forEach(hero => {
            hero.bullets = hero.bullets.map(bullet => ({
                ...bullet,
                x: bullet.x + bullet.speed * bullet.direction,
            })).filter(bullet => bullet.x > 0 && bullet.x < 600);
        });
    };

    const fireBullet = (hero: Hero) => {
        hero.bullets.push({
            x: hero.x,
            y: hero.y,
            radius: 5,
            color: hero.bulletColor,
            direction: hero === hero1Ref.current ? 1 : -1,
            speed: 5,
        });
    };

    const checkCollisions = () => {
        heroes.forEach(hero => {
            hero.bullets.forEach((bullet, bulletIndex) => {
                const otherHero = heroes.find(h => h !== hero);
                if (otherHero) {
                    const dx = bullet.x - otherHero.x;
                    const dy = bullet.y - otherHero.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < bullet.radius + otherHero.radius) {
                        hero.bullets.splice(bulletIndex, 1);
                        setHitHandler(hero.id);
                    }
                }
            });
        });
    };

    const gameLoop = () => {
        if (context) {
            context.clearRect(0, 0, 600, 300);
            drawHeroes(context);
            moveHeroes();
            drawBullets(context);
            moveBullets();
            checkCollisions();
        }
        animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }

    const handleCanvasClick = (event: MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            const clickedHero = heroes.find(hero => {
                const dx = hero.x - clickX;
                const dy = hero.y - clickY;
                return Math.sqrt(dx * dx + dy * dy) < hero.radius;
            });

            if (clickedHero) {
                setColor(clickedHero.bulletColor);
                setSelectedHero(clickedHero);
            }
        }
    };

    const closeModal = () => {
        setSelectedHero(null);
    };

    const changeBulletColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
        if (selectedHero) {
            selectedHero.bulletColor = e.currentTarget.value;
            setSelectedHero(selectedHero);
        }
    };

    useEffect(() => {
        getContextCanvas();
    }, []);

    useEffect(() => {
        if (context && animationFrameIdRef.current === null) {
            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            if (animationFrameIdRef.current !== null) {
                cancelAnimationFrame(animationFrameIdRef.current);
                animationFrameIdRef.current = null;
            }
        };
    }, [context]);

    useEffect(() => {
        updateHero();
    }, [hero1Speed, hero2Speed, hero1FireRate, hero2FireRate]);

    useEffect(() => {
        if (context) {
            const interval1 = setInterval(() => fireBullet(hero1Ref.current), 2100 - hero1Ref.current.fireRate);
            const interval2 = setInterval(() => fireBullet(hero2Ref.current), 2100 - hero2Ref.current.fireRate);

            return () => {
                clearInterval(interval1);
                clearInterval(interval2);
            };
        }
    }, [context, hero1FireRate, hero2FireRate]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                mousePosition.current = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                };
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        canvasRef.current?.addEventListener('click', handleCanvasClick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            canvasRef.current?.removeEventListener('click', handleCanvasClick);
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} width={600} height={300} style={{border: '1px solid black'}}/>
            <Modal closeModal={closeModal} isOpen={!!selectedHero}>
                <h3>Change Bullet Color</h3>
                <input type="color" value={color ?? ""} onChange={(e)=>{changeBulletColor(e)}}/>
            </Modal>
        </div>
    );
};

export default memo(DuelCanvas);