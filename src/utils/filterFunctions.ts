import type {Session} from "../../types/program.ts";
import {dayAndMonthFormat} from "@/utils/dateformat.ts";

export function groupSessionsByTimeslot(sessions: Session[]): Record<string, Session[]> {
    return sessions.reduce((acc: Record<string, Session[]>, session: Session) => {
        const timeslot = session.startSlot ?? "00:00";
        if (!acc[timeslot]) {
            acc[timeslot] = [];
        }
        acc[timeslot].push(session);
        return acc;
    }, {});
}

export function filterSessionTerms(
    session: Session,
    currentDayFilter: string,
    currentLanguageFilter: string,
    liveMode: boolean,
    now: Date,
    futureTime: Date
): boolean {
    const startTime = session.startTime ? new Date(session.startTime) : undefined;
    if (startTime === undefined) {
        return false;
    }
    const matchesDay =
        currentDayFilter === "" ||
        dayAndMonthFormat.format(startTime).includes(currentDayFilter);
    const matchesLanguage =
        currentLanguageFilter === "" ||
        session.language.includes(currentLanguageFilter);

    const isLive = liveMode && startTime >= now && startTime <= futureTime;

    return matchesDay && matchesLanguage && (!liveMode || isLive);
}
