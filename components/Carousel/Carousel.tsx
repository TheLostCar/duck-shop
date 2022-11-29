import React, { useEffect, useRef, useState, ReactNode, } from "react";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import styles from './Carousel.module.scss'

type Props = {
    children: ReactNode[],
    className: string,

}
const Carousel = ({ children, className }: Props) => {
    const [width, setWidth] = useState<number | null>(null);
    const [index, setIndex] = useState(0);
    const [transition, setTransition] = useState(false);


    const timeoutRef = useRef<NodeJS.Timer | null>(null)
    const resizeTimeoutRef = useRef<NodeJS.Timer | null>(null)
    const contentWrapperRef = useRef<HTMLDivElement | null>(null);


    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    function incrementIndex(inc: number) {
        const content = contentWrapperRef.current
        if (content === null) return
        setIndex((prevIndex) => {
            const max = content.childElementCount - 1; // 1 due to the count starting at zero
            const min = 0;

            if (prevIndex + inc > max) return min;
            if (prevIndex + inc < min) return max;
            return prevIndex + inc
        })
    }

    useEffect(() => {
        const content = contentWrapperRef.current;
        if (content === null) return;
        setWidth(content.clientWidth);
    }, [])

    useEffect(() => {
        resetTimeout();
        if (contentWrapperRef.current === null) return;
        const indexToCheck = contentWrapperRef.current.childElementCount - 1;

        console.log(index, indexToCheck)
        timeoutRef.current = setTimeout(() => {
            if (index === indexToCheck) {
                setTransition(false);
            } else {
                setTransition(true)
            }

            incrementIndex(1);

        }, 5000)

        return () => resetTimeout()
    });

    useEffect(() => {
        const content = contentWrapperRef.current
        if (content === null) return;

        const observer = new ResizeObserver((entries) => {
            if (resizeTimeoutRef.current !== null) clearTimeout(resizeTimeoutRef.current);

            for (const entry of entries) setWidth(entry.target.clientWidth);
            resizeTimeoutRef.current = setTimeout(() => {
                resizeTimeoutRef.current = null;
            }, 500)
        })

        observer.observe(content)
        return () => observer.unobserve(content);
    }, [])

    const handleMouseDown = (indexToCheck: number, newIndex: number) => {
        if (index !== indexToCheck) return;
        setTransition(false);
        setIndex(newIndex);
    }

    const handleClick = (inc: number) => {
        const content = contentWrapperRef.current;
        if (content === null) return;

        setTransition(true);
        incrementIndex(inc);
    }

    const contentWrapperInlineStyles: React.CSSProperties = {
        right: width && width * index || 0,
        transitionDuration: (transition && resizeTimeoutRef.current === null) && '.1s' || '0s',
    }

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.contentWrapper} ref={contentWrapperRef}>
                {children.map((child, index) => {
                    if (children.length === 0) return;
                    return <React.Fragment key={index}>
                        <div className={styles.imageWrapper} style={contentWrapperInlineStyles}>
                            {child}
                        </div>
                        {// adds copy of first element to end of carousel
                            index === children.length - 1 &&
                            <div className={styles.imageWrapper} style={contentWrapperInlineStyles}>
                                {children[0]}
                            </div>
                        }
                    </React.Fragment>
                })}
            </div>

            <button
                className={styles.leftArrow}
                onMouseDown={() => {
                    if (contentWrapperRef.current === null) return;
                    handleMouseDown(0, contentWrapperRef.current.childElementCount - 1)
                }}
                onClick={() => handleClick(-1)}
            >
                <SlArrowLeft />
            </button>

            <button
                type="button"
                className={styles.rightArrow}
                onMouseDown={() => {
                    if (contentWrapperRef.current === null) return;
                    handleMouseDown(contentWrapperRef.current.childElementCount - 1, 0);
                }}
                onClick={() => handleClick(1)}
            >
                <SlArrowRight />
            </button>
        </div>
    );
}

export default Carousel;