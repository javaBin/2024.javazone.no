"use client";

import {
    dayAndTimeFormat,
    dayAndTimeFormatWithMonth,
} from "../../utils/dateformat.ts";
import type { Session } from "../../types/program.ts";
import { useState } from "react";

interface Props {
    session: Session;
}

export const SessionDetails = ({ session }: Props) => {
    const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    const [isFavorite, setIsFavorite] = useState(
        favoriteIds.includes(session.id),
    );

    const handleFavoriteClick = () => {
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
                        ? `${session.room} - ${dayAndTimeFormatWithMonth.format(
                              new Date(session.startTime),
                          )}`
                        : "TBA"}
                </p>
                <p className="p-0">
                    Finishes at{" "}
                    {session.endTime
                        ? `${dayAndTimeFormat.format(
                              new Date(session.endTime),
                          )}`
                        : "TBA"}
                </p>
                {session.registerLoc && (
                    <a href={session.registerLoc}>
                        Click this link to register on this workshop
                    </a>
                )}
            </div>

            {session.video && (
                <iframe
                    className="max-w-full max-h-52 md:max-h-full border-none"
                    src={`https://player.vimeo.com/video/${session.video}`}
                    width="640"
                    height="360"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )}

            <div className="grid md:grid-cols-4 md:gap-12">
                <div className="md:col-span-3">
                    <p className="whitespace-pre-line">{session.abstract}</p>
                    <h2 className="font-bold mt-10 text-xl md:text-3xl">
                        Intended audience:{" "}
                    </h2>
                    <p className="whitespace-pre-line">
                        {session.intendedAudience}
                    </p>
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
