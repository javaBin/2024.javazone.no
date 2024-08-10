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
                const matchesDay = currentDayFilter === "" || dayAndMonthFormat.format(new Date(session.startTime)).includes(currentDayFilter);
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
                const matchesDay = currentDayFilter === "" || dayAndMonthFormat.format(new Date(session.startTime)).includes(currentDayFilter);
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

    if (bothDaysButton && wdnsDayButton && thrsDayButton) {
        bothDaysButton?.addEventListener("click", () => {
            currentDayFilter = "";
            setActiveButton(bothDaysButton, true);
            setActiveButton(wdnsDayButton, false);
            setActiveButton(thrsDayButton, false);
            updateSessions();
        });

        wdnsDayButton?.addEventListener("click", () => {
            currentDayFilter = "September 4";
            setActiveButton(wdnsDayButton, true);
            setActiveButton(bothDaysButton, false);
            setActiveButton(thrsDayButton, false);
            updateSessions();
        });

        thrsDayButton?.addEventListener("click", () => {
            currentDayFilter = "September 5";
            setActiveButton(thrsDayButton, true);
            setActiveButton(bothDaysButton, false);
            setActiveButton(wdnsDayButton, false);
            updateSessions();
        });
    }
// language buttons
    if (allLanguageBtn && norwegianBtn && englishBtn) {
        allLanguageBtn?.addEventListener("click", () => {
            currentLanguageFilter = "";
            setActiveButton(allLanguageBtn, true);
            setActiveButton(norwegianBtn, false);
            setActiveButton(englishBtn, false);
            updateSessions();
        });

        norwegianBtn?.addEventListener("click", () => {
            currentLanguageFilter = "no";
            setActiveButton(norwegianBtn, true);
            setActiveButton(allLanguageBtn, false);
            setActiveButton(englishBtn, false);
            updateSessions();
        });

        englishBtn?.addEventListener("click", () => {
            currentLanguageFilter = "en";
            setActiveButton(englishBtn, true);
            setActiveButton(allLanguageBtn, false);
            setActiveButton(norwegianBtn, false);
            updateSessions();
        });
    }

    // format buttons
    allFormatBtn?.addEventListener("click", () => {
        currentFormatFilter = "";
        updateSessions();

        setActiveButton(allFormatBtn, true);
        setActiveButton(presentationBtn, false);
        setActiveButton(lightningTalkBtn, false);
        setActiveButton(workshopBtn, false);
    });

    presentationBtn?.addEventListener("click", () => {
        currentFormatFilter = "presentation";
        updateSessions();

        setActiveButton(presentationBtn, true);
        setActiveButton(allFormatBtn, false);
        setActiveButton(lightningTalkBtn, false);
        setActiveButton(workshopBtn, false);
    });

    lightningTalkBtn?.addEventListener("click", () => {
        currentFormatFilter = "lightning-talk";
        updateSessions();

        setActiveButton(lightningTalkBtn, true);
        setActiveButton(allFormatBtn, false);
        setActiveButton(presentationBtn, false);
        setActiveButton(workshopBtn, false);
    });

    workshopBtn?.addEventListener("click", () => {
        currentFormatFilter = "workshop";
        updateSessions();

        setActiveButton(workshopBtn, true);
        setActiveButton(allFormatBtn, false);
        setActiveButton(presentationBtn, false);
        setActiveButton(lightningTalkBtn, false);
    });
}
