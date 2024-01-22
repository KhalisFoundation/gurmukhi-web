import { useSpring, animated } from '@react-spring/web';

export function Counter( { n, className }: { n: number, className: string } ) {
    const { number } = useSpring({
        from: { number: 0 },
        number: n,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });
    return <animated.p className={className}>{number.to((n) => n.toFixed(0))}</animated.p>;
}