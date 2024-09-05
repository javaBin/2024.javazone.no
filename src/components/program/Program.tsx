"use client";

import type { Session } from "../../types/program.ts";
import {
    dayAndTimeFormat,
    dayAndTimeFormatWithMonth,
} from "../../utils/dateformat.ts";
import { SessionCard } from "./SessionCard.tsx";
import { useEffect, useState } from "react";
import type { FilterType } from "../filter/Filter.tsx";

interface Props {
    timeSlots: string[];
    sessions: Record<string, Session[]>;
    filter: FilterType;
}

function getLiveData(timeSlots: string[], currentTime: Date) {
    const nextRunningSlot = timeSlots
        .filter((time) => {
            const date = new Date(time);
            return (
                date.getDate() === currentTime.getDate() &&
                date.getTime() >= currentTime.getTime()
            );
        })
        .at(0);
    const nowRunningSlot = timeSlots
        .filter((time) => {
            const date = new Date(time);
            return (
                date.getDate() === currentTime.getDate() &&
                date.getTime() <= currentTime.getTime()
            );
        })
        .at(-1);

    return { now: nowRunningSlot, next: nextRunningSlot };
}

function getFavoriteSessions(sessions: Record<string, Session>): Session[] {
    const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favoriteIds
        .map((id: string) => sessions[id])
        .filter(
            (session: Session | undefined): session is Session => !!session,
        );
}

export const Program = ({ timeSlots, sessions, filter }: Props) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date());
        };

        const intervalId = setInterval(updateTime, 60000); // 60000ms = 1 minute

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const [clicked, setClicked] = useState(false);

    const liveData = getLiveData(timeSlots, currentTime);

    const sessionsById = Object.values(sessions)
        .flat()
        .reduce((acc: Record<string, Session>, session: Session) => {
            acc[session.id] = session;
            return acc;
        }, {});

    return (
        <div className="flex-grow">
            {filter === "FAVORITES" && (
                <section className="mt-3">
                    <h2>My favorites</h2>
                    <p>
                        Press the ☆ icon on any talk or workshop to add it to
                        your favorite list
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                        {getFavoriteSessions(sessionsById)
                            .sort(
                                (a, b) =>
                                    a.startTime?.localeCompare(
                                        b.startTime ?? "",
                                    ) ||
                                    a.room?.localeCompare(b.room ?? "") ||
                                    0,
                            )
                            .map((session, index) => (
                                <SessionCard
                                    session={session}
                                    key={index}
                                    clicked={clicked}
                                    setClicked={setClicked}
                                />
                            ))}
                    </div>
                </section>
            )}
            {filter === "FULL_PROGRAM" &&
                timeSlots.map((time, key) => (
                    <section key={`${time}-${key}`} className="mt-3">
                        {time && (
                            <h2>
                                {dayAndTimeFormatWithMonth.format(
                                    new Date(time),
                                )}
                            </h2>
                        )}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                            {sessions[time]
                                .sort(
                                    (a, b) =>
                                        a.room?.localeCompare(b.room ?? "") ||
                                        a.startTime?.localeCompare(
                                            b.startTime ?? "",
                                        ) ||
                                        0,
                                )
                                .map((session) => (
                                    <SessionCard
                                        session={session}
                                        clicked={clicked}
                                        setClicked={setClicked}
                                        key={session.id}
                                    />
                                ))}
                        </div>
                    </section>
                ))}
            {filter === "TODAY" &&
                timeSlots
                    .filter((time) => time.split("T")[0] === currentTime.toISOString().split("T")[0])
                    .map((time, key) => (
                        <section key={`${time}-${key}`} className="mt-3">
                            {time && (
                                <h2>
                                    {dayAndTimeFormatWithMonth.format(
                                        new Date(time),
                                    )}
                                </h2>
                            )}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                                {sessions[time]
                                    .sort(
                                        (a, b) =>
                                            a.room?.localeCompare(b.room ?? "") ||
                                            a.startTime?.localeCompare(
                                                b.startTime ?? "",
                                            ) ||
                                            0,
                                    )
                                    .map((session) => (
                                        <SessionCard
                                            session={session}
                                            clicked={clicked}
                                            setClicked={setClicked}
                                            key={session.id}
                                        />
                                    ))}
                            </div>
                        </section>
                    ))}
            {filter === "LIVE" && (
                <section className="mt-3">
                    {liveData.next ? (
                        <>
                            <h2>
                                Coming up next:{" "}
                                {dayAndTimeFormat.format(
                                    new Date(liveData.next),
                                )}
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                                {sessions[liveData.next].map((session) => (
                                    <SessionCard
                                        session={session}
                                        clicked={clicked}
                                        setClicked={setClicked}
                                        key={session.id}
                                    />
                                ))}
                            </div>
                        </>
                    ) : currentTime.getDate() === 4 ? (
                        <>
                            <h2>Coming up next: 7:20 PM 🎉🕺💃</h2>

                            <a href="/awezone">
                                <img
                                    src={`/images/AweZone2024-logo.svg`}
                                    alt="AweZone"
                                />
                            </a>
                        </>
                    ) : null}
                    {liveData.now && (
                        <>
                            <h2>
                                Currently running:{" "}
                                {dayAndTimeFormat.format(
                                    new Date(liveData.now),
                                )}
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                                {sessions[liveData.now].map((session) => (
                                    <SessionCard
                                        session={session}
                                        clicked={clicked}
                                        setClicked={setClicked}
                                        key={session.id}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    {!liveData.next && !liveData.now && (
                        <h2>
                            Nothing relevant here yet, wait till JavaZone begins
                            😉
                        </h2>
                    )}
                </section>
            )}
        </div>
    );
};
