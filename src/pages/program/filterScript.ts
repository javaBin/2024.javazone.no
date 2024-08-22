import { fetchProgram } from "./fetchProgram";
import type { Session } from "../../../types/program.ts";
import { dayAndTimeFormat, dayAndTimeFormatWithMonth } from "@/utils/dateformat.ts";
import {filterSessionTerms, groupSessionsByTimeslot} from "@/utils/filterFunctions.ts";

// Fetch and group sessions by timeslot
const programs = (await fetchProgram()).sessions;

const groupedSessions = groupSessionsByTimeslot(Object.values(programs).flat());
const sortedTimeslots = Object.keys(groupedSessions).sort((a, b) => a.localeCompare(b));



if (typeof window !== "undefined") {
    // DOM elements
   const fullProgramBtn = document.getElementById("fullProgramBtn");
    const liveBtn = document.getElementById("liveBtn");

    const filteredSessionsContainer = document.getElementById("filteredSessions");

    // Initial filters
    let liveMode = false; // Variable to track if we're in "Live" mode

    fullProgramBtn?.classList.remove("bg-darkgreen", "text-white");
    fullProgramBtn?.classList.add("bg-white", "text-darkgray", "border-darkgray", "border-2");

    // Function to update sessions based on selected filters
    const updateSessions = () => {
        const now = new Date();
        const futureTime = new Date(now);
        futureTime.setHours(now.getHours() + 3); // Set to 3 hours in the future

        // Filter and map sessions directly within each timeslot
        filteredSessionsContainer!!.innerHTML = sortedTimeslots.map((time) => {
            const sessions = groupedSessions[time].filter((session) =>
                filterSessionTerms(session, liveMode, now, futureTime)
            );

            if (sessions.length > 0) {
                return `
                    <section>
                        ${time ? `<h2>${dayAndTimeFormatWithMonth.format(new Date(time))}</h2>` : ''}
                        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            ${sessions
                    .sort((a, b) =>
                        a.room?.localeCompare(b.room ?? "") ||
                        a.startTime?.localeCompare(b.startTime ?? "") || 0
                    )
                    .map((session) => `
                                    <div class="bg-white relative p-3 border-black border-2 rounded-xl hover:scale-105 transition ease-in-out delay-150 duration-200">
                                        ${session.room && session.startTime ? `
                                            <div class="flex justify-between pb-1 md:pb-2">
                                                <p class="my-0 md:my-1 text-sm md:text-base">${session.room} - ${dayAndTimeFormat.format(new Date(session.startTime))}</p>
                                            </div>` : ''}
                                        <a href="/program/${session.id}" style="text-decoration: none; color: inherit;">
                                            <p class="my-0 md:my-1 text-base md:text-lg font-bold">${session.title} (${session.language})</p>
                                        </a>
                                        <div class="text-sm md:text-base">
                                            ${session.speakers.map((speaker) => `<p class="m-0">${speaker.name}</p>`).join('')}
                                        </div>
                                        <p class="text-lg text-end absolute bottom-0 right-1">${session.length} min</p>
                                    </div>
                                `).join('')}
                        </div>
                    </section>
                `;
            }

            return '';
        }).join('');
    };

    /*function that tells the button element that it is active or not*/
    function setActiveButton(button: HTMLElement, active: boolean) {
        if (active) {
            button.classList.add("bg-white", "text-darkgray", "border-darkgray", "border-2");
            button.classList.remove("bg-darkgreen", "text-white");
        } else {
            button.classList.add("bg-darkgreen", "text-white");
            button.classList.remove("bg-white", "text-darkgray", "border-darkgray", "border-2");
        }
    }

    // Event listener for the Live button and full program button
    if (liveBtn && fullProgramBtn) {
        fullProgramBtn.addEventListener("click", () => {
            liveMode = false;
            setActiveButton(liveBtn, false);
            setActiveButton(fullProgramBtn, true);
            updateSessions();
        });

        liveBtn.addEventListener("click", () => {
            liveMode = true;
            setActiveButton(fullProgramBtn, false);
            setActiveButton(liveBtn, true);
            updateSessions();
        });
    }
}
