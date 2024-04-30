"use client";

import React, { useEffect, useState, useRef } from 'react';
import { formatOrdinals } from '../utils/formatOrdinals'; // Ensure this utility is available

function EyeAnimation() {
    const [desktopScreen, setDesktopScreen] = useState(window.innerWidth >= 1085);
    const [illustrationHeight, setIllustrationHeight] = useState(500);

    const illustrationWrapperRef = useRef(null);
    const illustrationImageRef = useRef(null);
    const animationImageRef = useRef(null);
    const floppyEyeWrapperRef = useRef(null);
    const floppyEyeRef = useRef(null);

    useEffect(() => {
        function handleResize() {
            setDesktopScreen(window.innerWidth >= 1085);
            if (illustrationImageRef.current) {
                setIllustrationHeight(illustrationImageRef.current.getBoundingClientRect().height);
            }
        }

        function handleScroll() {
            const shouldListen = window.scrollY === 0;
            document[shouldListen ? 'addEventListener' : 'removeEventListener']('mousemove', floppyEyeAnimation);
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    function floppyEyeAnimation(e) {
        if (!illustrationHeight || !desktopScreen) return;
        if (!floppyEyeRef.current || !floppyEyeWrapperRef.current) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const wrapperRect = floppyEyeWrapperRef.current.getBoundingClientRect();
        const wrapperX = wrapperRect.left + (wrapperRect.width / 2);
        const wrapperY = wrapperRect.top + (wrapperRect.height / 2);
        const deltaX = mouseX - wrapperX;
        const deltaY = mouseY - wrapperY;
        const angle = Math.atan2(deltaY, deltaX);
        const maxDistance = Math.min(wrapperRect.width / 2, wrapperRect.height / 2) - (floppyEyeRef.current.offsetWidth / 2);
        const eyeX = wrapperX + Math.cos(angle) * maxDistance;
        const eyeY = wrapperY + Math.sin(angle) * maxDistance;

        floppyEyeRef.current.style.left = `${eyeX - (wrapperRect.left + window.scrollX) - (floppyEyeRef.current.offsetWidth / 2)}px`;
        floppyEyeRef.current.style.top = `${eyeY - (wrapperRect.top + window.scrollY) - (floppyEyeRef.current.offsetHeight / 2)}px`;
    }

    return (
        <>
            <div className="grid">
                <div className="grid place-items-center -mt-10 w-full" ref={illustrationWrapperRef}>
                    <img src="/images/JavaZone2024-comp-cropped-no-eye.svg"
                         alt="An illustration for 'JavaZone by JavaBin,' inspired by the 1920s Steamboat Willie theme..."
                         width="1000"
                         ref={illustrationImageRef}/>
                </div>

                <div className="absolute grid place-items-center -mt-10 w-full">
                    <div style={{width: '1000px', height: `${illustrationHeight}px`}} ref={animationImageRef}>
                        <div
                            className="absolute w-[23px] h-[22px] rounded-full translate-x-[23.8rem] translate-y-[24.8rem]"
                            ref={floppyEyeWrapperRef}>
                            <img src="/images/Eye.svg" alt="Decorative graphic eye" width="8" height="8"
                                 className="relative z-50 w-[8px] h-[8px] object-contain"
                                 ref={floppyEyeRef}/>
                        </div>
                    </div>
                </div>
                <section
                    className="shadow-2xl bg-turquoise grid justify-center gap-4 px-4 py-8 border-2 border-[#26454f]">
                    <h1 className="max-sm:text-3xl">Welcome to JavaZone 2024</h1>
                    <div>
                        <p>September {formatOrdinals(4)}-{formatOrdinals(5)} 2024 in Oslo Spektrum, Norway</p>
                        <p>Conference: September {formatOrdinals(4)}-{formatOrdinals(5)}</p>
                        <p>Workshops: September {formatOrdinals(3)}</p>
                    </div>

                    <div>
                        <p>Ticket sales starts on March {formatOrdinals(1)} at 10 AM</p>
                        <p>8 790,- + 120,- fee (ex MVA)</p>
                        <p>Late Bird from May {formatOrdinals(1)} 9 590,- + 120,- fee (ex MVA)</p>
                        <slot/>

                    </div>
                    <div>
                        <p>Registered partners will also be able to reserve tickets on March {formatOrdinals(1)}</p>
                       <slot/>
                    </div>

                </section>
            </div>
        </>

    )
        ;
}

export default EyeAnimation;
