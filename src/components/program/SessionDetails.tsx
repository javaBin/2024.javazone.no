'use client';

import { dayAndTimeFormatWithMonth } from "../../utils/dateformat.ts";
import type { Session } from "../../types/program.ts";
import {useEffect, useState} from "react";

interface Props {
    session: Session;
}

export const SessionDetails = ({ session }: Props) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favoriteIds.includes(session.id));
    }, [session.id]);

    const handleFavoriteClick = () => {
        const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
        const index = favoriteIds.indexOf(session.id);
        if (index === -1) {
            favoriteIds.push(session.id);
            setIsFavorite(true);
        } else {
            favoriteIds.splice(index, 1);
            setIsFavorite(false);
        }
        localStorage.setItem("favorites", JSON.stringify(favoriteIds));
    };

    return (
        <>
            <div className="pb-4">
                <h1 className="text-3xl md:text-6xl">{session.title}</h1>
                <p className="p-0">
                    Time and room:{" "}
                    {session.startTime
                        ? `${session.room} - ${dayAndTimeFormatWithMonth.format(new Date(session.startTime))}`
                        : "TBA"}
                </p>
                {session.registerLoc && (
                    <a href={session.registerLoc}>
                        Click this link to register on this workshop
                    </a>
                )}
            </div>

            <div className="grid md:grid-cols-4 md:gap-12">
                <div className="md:col-span-3">
                    <p>{session.abstract}</p>
                    <h2 className="font-bold mt-10 text-xl md:text-3xl">
                        Intended audience:{" "}
                    </h2>
                    <p>{session.intendedAudience}</p>
                    {session.workshopPrerequisites && (
                        <>
                            <h2 className="font-bold mt-10 text-xl md:text-3xl">
                                Prerequisites
                            </h2>
                            <p className="whitespace-pre-line">
                                {session.workshopPrerequisites}
                            </p>
                        </>
                    )}
                </div>
                <div className="mt-3 font-bold gap-4">
                    <p>Type: {session.format}</p>
                    <p>
                        Language:{" "}
                        {session.language === "no" ? "Norwegian" : "English"}
                    </p>
                    <button
                        className="favorite-btn text-4xl hover:opacity-60"
                        data-session-id={session.id}
                        title="Add/remove favorite"
                        onClick={handleFavoriteClick}
                    >
                        {isFavorite ? "★" : "☆"}
                    </button>
                </div>
            </div>
        </>
    );
};
