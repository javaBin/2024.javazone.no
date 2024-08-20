import { dayAndTimeFormatWithMonth } from "@/utils/dateformat.ts";
import type { Session } from "../../../types/program.ts";
import { SessionCard } from "@/components/program/SessionCard.tsx";

interface Props {
    timeSlots: string[];
    sessions: Record<string, Session[]>;
}

export const Program = ({ timeSlots, sessions }: Props) => (
    <div>
        {timeSlots.map((time, key) => (
            <section key={`${time}-${key}`}>
                {time && (
                    <h2>{dayAndTimeFormatWithMonth.format(new Date(time))}</h2>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sessions[time]
                        .sort(
                            (a, b) =>
                                a.room?.localeCompare(b.room ?? "") ||
                                a.startTime?.localeCompare(b.startTime ?? "") ||
                                0,
                        )
                        .map((session, index) => (
                            <SessionCard session={session} key={index} />
                        ))}
                </div>
            </section>
        ))}
    </div>
);
