import { fetchProgram } from "./fetchProgram";
import type { Session } from "../../../types/program.ts";
import { dayAndMonthFormat } from "@/utils/dateformat.ts";

// Fetch and group sessions by timeslot
const programs = (await fetchProgram()).sessions;

function groupSessionsByTimeslot(sessions: Session[]): Record<string, Session[]> {
    return sessions.reduce((acc: Record<string, Session[]>, session: Session) => {
        const timeslot = session.startSlot ?? "00:00";
        if (!acc[timeslot]) {
            acc[timeslot] = [];
        }
        acc[timeslot].push(session);
        return acc;
    }, {});
}

const groupedSessions = groupSessionsByTimeslot(Object.values(programs).flat());
const sortedTimeslots = Object.keys(groupedSessions).sort((a, b) => a.localeCompare(b));

if (typeof window !== "undefined") {
    // DOM elements
    const bothDaysButton = document.getElementById("bothBtn");
    const tuesDayButton = document.getElementById("tuesdayBtn");
    const wdnsDayButton = document.getElementById("wednesdayBtn");
    const thrsDayButton = document.getElementById("thursdayBtn");
    const filteredSessionsContainer = document.getElementById("filteredSessions");

    // Update sessions based on selected day
    const updateSessions = (filterTerm: string) => {
        const filteredTimeslots = sortedTimeslots.filter((time) =>
            dayAndMonthFormat.format(new Date(time)).includes(filterTerm)
        );

        filteredSessionsContainer!!.innerHTML = filteredTimeslots.map((time) => `
            <section>
                ${time ? `<h2>${new Date(time).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</h2>` : ''}
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${groupedSessions[time]
            .sort((a, b) =>
                a.room?.localeCompare(b.room ?? "") ||
                a.startTime?.localeCompare(b.startTime ?? "") || 0)
            .map((session) => `
                            <div class="bg-white relative p-3 border-black border-2 rounded-xl hover:scale-105 transition ease-in-out delay-150 duration-200">
                                ${session.room && session.startTime ? `
                                    <div class="flex justify-between pb-1 md:pb-2">
                                        <p class="my-0 md:my-1 text-sm md:text-base">${session.room} - ${new Date(session.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</p>
                                    </div>` : ''}
                                <a href="/program/${session.id}" style="text-decoration: none; color: inherit;">
                                    <p class="my-0 md:my-1 text-base md:text-lg font-bold">${session.title} (${session.language})</p>
                                </a>
                                <div class="text-sm md:text-base">
                                    ${session.speakers.map((speaker) => `<p class="m-0">${speaker.name}</p>`).join('')}
                                </div>
                                <p class="text-lg text-end absolute bottom-0 right-1">${session.length} min</p>
                            </div>`).join('')}
                </div>
            </section>`).join('');
    };

    // Event listeners for the buttons
    bothDaysButton?.addEventListener("click", () => updateSessions(""));
    tuesDayButton?.addEventListener("click", () => updateSessions("September 3"));
    wdnsDayButton?.addEventListener("click", () => updateSessions("September 4"));
    thrsDayButton?.addEventListener("click", () => updateSessions("September 5"));
}
