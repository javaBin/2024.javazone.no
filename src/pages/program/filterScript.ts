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
    const bothDaysButton = document.getElementById("bothDaysBtn");
    const wdnsDayButton = document.getElementById("wednesdayBtn");
    const thrsDayButton = document.getElementById("thursdayBtn");

    const allLanguageBtn = document.getElementById("allLanguageBtn");
    const norwegianBtn = document.getElementById("norwegianBtn");
    const englishBtn = document.getElementById("englishBtn");

    const allFormatBtn = document.getElementById("allFormatBtn");
    const presentationBtn = document.getElementById("presentationBtn");
    const lightningTalkBtn = document.getElementById("lightningTalkBtn");
    const workshopBtn = document.getElementById("workshopBtn");

    const favoriteBtn = document.getElementById("favoriteBtn");

    const filteredSessionsContainer = document.getElementById("filteredSessions");

    // Initial filters
    let currentDayFilter = "";
    let currentLanguageFilter = "";
    let currentFormatFilter = "";

    // Function to update sessions based on selected filters
    const updateSessions = () => {
        const filteredTimeslots = sortedTimeslots.filter((time) => {
            const sessions = groupedSessions[time];
            return sessions.some((session) => {
                const startTime = session.startTime;
                if (startTime === undefined) {
                    return false;
                }
                const matchesDay = currentDayFilter === "" || dayAndMonthFormat.format(new Date(startTime)).includes(currentDayFilter);
                const matchesLanguage = currentLanguageFilter === "" || session.language.includes(currentLanguageFilter);
                const matchesFormat = currentFormatFilter === "" || session.format.includes(currentFormatFilter);
                return matchesDay && matchesLanguage && matchesFormat;
            });
        });

        filteredSessionsContainer!!.innerHTML = filteredTimeslots.map((time) => `
            <section>
                ${time ? `<h2>${new Date(time).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</h2>` : ''}
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${groupedSessions[time]
            .filter(session => {
                const startTime = session.startTime;
                if (startTime === undefined) {
                    return false;
                }
                const matchesDay = currentDayFilter === "" || dayAndMonthFormat.format(new Date(startTime)).includes(currentDayFilter);
                const matchesLanguage = currentLanguageFilter === "" || session.language.includes(currentLanguageFilter);
                const matchesFormat = currentFormatFilter === "" || session.format.includes(currentFormatFilter);
                return matchesDay && matchesLanguage && matchesFormat;
            })
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

    // Event listeners for day buttons
    bothDaysButton?.addEventListener("click", () => {
        currentDayFilter = "";
        updateSessions();
    });

    wdnsDayButton?.addEventListener("click", () => {
        currentDayFilter = "September 4";
        updateSessions();
    });

    thrsDayButton?.addEventListener("click", () => {
        currentDayFilter = "September 5";
        updateSessions();
    });

    // Event listeners for language buttons
    allLanguageBtn?.addEventListener("click", () => {
        currentLanguageFilter = "";
        updateSessions();
    });

    norwegianBtn?.addEventListener("click", () => {
        currentLanguageFilter = "no";
        updateSessions();
    });

    englishBtn?.addEventListener("click", () => {
        currentLanguageFilter = "en";
        updateSessions();
    });

    // Event listeners for format buttons
    allFormatBtn?.addEventListener("click", () => {
        currentFormatFilter = "";
        updateSessions();
    });

    presentationBtn?.addEventListener("click", () => {
        currentFormatFilter = "presentation";
        updateSessions();
    });

    lightningTalkBtn?.addEventListener("click", () => {
        currentFormatFilter = "lightning-talk";
        updateSessions();
    });

    workshopBtn?.addEventListener("click", () => {
        currentFormatFilter = "workshop";
        updateSessions();
    });

}
