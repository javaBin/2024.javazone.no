'use client';

import type { Session } from "../../types/program.ts";
import {dayAndTimeFormatWithMonth} from "../../utils/dateformat.ts";
import {SessionCard} from "./SessionCard.tsx";
import {useState} from "react";

interface Props {
    timeSlots: string[];
    sessions: Record<string, Session[]>;
    filter: string;
}

function filterSessionTerms(
    session: Session,
    liveMode: boolean,
    now: Date,
    futureTime: Date,
): boolean {
    const startTime = session.startSlot ? new Date(session.startSlot) : undefined;
    if (startTime === undefined) {
        return false;
    }

    const isLive = liveMode && startTime >= now && startTime <= futureTime;

    return (!liveMode || isLive);
}

export const Program = ({ timeSlots, sessions, filter}: Props) => {
    const [clicked, setClicked] = useState(false)

    const sessionsById = Object.values(sessions).flat().reduce((acc: Record<string, Session>, session: Session) => {
        acc[session.id] = session;
        return acc;
    }, {});

    function getFavoriteSessions(): Session[] {
        const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
        return favoriteIds.map((id: string) => sessionsById[id]).filter((session: Session | undefined): session is Session => !!session);
    }

    if (filter == "LIVE"){
        const now = new Date();
        now.setMinutes(0, 0, 0);
        const futureTime = new Date(now);
        futureTime.setHours(now.getHours() + 2);
        timeSlots = timeSlots.filter((time) => {
            return sessions[time].some((session) => filterSessionTerms(session, true, now, futureTime));
        });
    }

    return (
        <div className="flex-grow">
            {filter == "FAVORITES" ? (
                <section className="mt-3">
                    <h2>My favorites</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                        {getFavoriteSessions()
                            .sort(
                                (a, b) =>
                                    a.room?.localeCompare(b.room ?? "") ||
                                    a.startTime?.localeCompare(b.startTime ?? "") ||
                                    0,
                            )
                            .map((session, index) => (
                                <SessionCard session={session} key={index} clicked={clicked} setClicked={setClicked} />
                            ))}
                    </div>
                </section>
            )
            :
            timeSlots.map((time, key) => (
                <section key={`${time}-${key}`} className="mt-3">
                    {time && (
                        <h2>{dayAndTimeFormatWithMonth.format(new Date(time))}</h2>
                    )}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                        {sessions[time]
                            .sort(
                                (a, b) =>
                                    a.room?.localeCompare(b.room ?? "") ||
                                    a.startTime?.localeCompare(b.startTime ?? "") ||
                                    0,
                            )
                            .map((session, index) => (
                                <SessionCard session={session} clicked={clicked} setClicked={setClicked} key={session.id} />
                            ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
