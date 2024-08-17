import { fetchProgram } from "./fetchProgram.ts";
import type { Session } from "../../../types/program.ts";

const programs = (await fetchProgram()).sessions;

const sessionsById = Object.values(programs).flat().reduce((acc: Record<string, Session>, session: Session) => {
    acc[session.id] = session;
    return acc;
}, {}); 

function getFavoriteSessions(): Session[] {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favoriteIds.map((id: string) => sessionsById[id]).filter((session: Session | undefined): session is Session => !!session);
}

function updateFavoriteButtonText() {
    const favoriteBtn = document.getElementById("favoriteBtn");
    if (favoriteBtn) {
        const favoriteSessions = getFavoriteSessions();
        favoriteBtn.innerHTML = `My favorites (${favoriteSessions.length})`;
    }
}

function renderFavoriteSessions() {
    const favoriteSessionsContainer = document.getElementById("filteredSessions");
    const favoriteSessions = getFavoriteSessions();

    if (favoriteSessionsContainer) {
        const sessionsHtml = favoriteSessions.map((session) => `
            <a href="/program/${session.id}" style="text-decoration: none; color: inherit;" class="bg-white relative p-3 my-2 border-black border-2 rounded-xl hover:scale-105 transition ease-in-out delay-150 duration-200">
                ${session.room && session.startTime ? `
                    <div class="flex justify-between pb-1 md:pb-2">
                        <p class="my-0 md:my-1 text-sm md:text-base">${session.room} - ${new Date(session.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</p>
                    <button class="favorite-btn text-4xl hover:opacity-60" data-session-id="${session.id}" title="Add/remove favorite">
                    Loading...
                    </button>
                    </div>` : ''}
                <div style="text-decoration: none; color: inherit;">
                    <p class="my-0 md:my-1 text-base md:text-lg font-bold">${session.title} (${session.language})</p>
                </div>
                <div class="text-sm md:text-base">
                    ${session.speakers.map((speaker) => `<p class="m-0">${speaker.name}</p>`).join('')}
                </div>
                <p class="text-lg text-end absolute bottom-0 right-1">${session.length} min</p>
                <!-- Favorite Button -->
            </a>
        `).join('');

        favoriteSessionsContainer.innerHTML = `<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">${sessionsHtml}</div>`;

        initializeFavoriteButtons();
    }
}

function initializeFavoriteButtons() {
    document.querySelectorAll('button.favorite-btn').forEach(button => {
        const sessionId = button.getAttribute('data-session-id');

        function updateButtonText() {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            button.innerHTML = favorites.includes(sessionId) ? "&#9733;" : "&#9734;";
        }

        updateButtonText();

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();

            let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

            if (favorites.includes(sessionId)) {
                favorites = favorites.filter((id:string) => id !== sessionId);
                button.innerHTML = "&#9734;";
            } else {
                favorites.push(sessionId);
                button.innerHTML = "&#9733;";
            }

            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });
}



if (typeof window !== "undefined") {
    const favoriteBtn = document.getElementById("favoriteBtn");

    if (favoriteBtn) {
        updateFavoriteButtonText();

        favoriteBtn.addEventListener("click", () => {
            renderFavoriteSessions();
        });

        window.addEventListener('storage', () => {
            updateFavoriteButtonText();
            renderFavoriteSessions();
        });
    }
}
