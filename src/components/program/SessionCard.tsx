import type { Session } from "../../types/program.ts";
import {dayAndTimeFormat} from "../../utils/dateformat.ts";

export const SessionCard = ({ session }: { session: Session }) => (
    <div className="bg-white relative p-3 border-black border-2 rounded-xl hover:scale-105 transition ease-in-out delay-150 duration-200">
        {session.room && session.startTime && (
            <div className="flex justify-between pb-1 md:pb-2">
                <p className="my-0 md:my-1 text-sm md:text-base">
                    {session.room} -{" "}
                    {dayAndTimeFormat.format(new Date(session.startTime))}
                </p>
            </div>
        )}
        <a href={`/program/${session.id}`}>
            <p className="my-0 md:my-1 text-base md:text-lg font-bold">
                {session.title} ({session.language})
            </p>
        </a>
        <div className="text-sm md:text-base">
            {session.speakers.map((speaker) => (
                <p className="m-0" key={speaker.name}>{speaker.name}</p>
            ))}
        </div>
        <p className="text-lg text-end absolute bottom-0 right-1">
            {session.length} min
        </p>
    </div>
);
