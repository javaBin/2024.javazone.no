import type { Program } from "types/program"

export async function fetchProgram() {
  return await fetch('https://sleepingpill.javazone.no/public/allSessions/javazone_2023')
    .then<Program>((res) => res.json());
}


export const fetchIndividualProgram = (
  id?: string,
) =>
  fetchProgram().then((program) =>
    program.sessions.find((session) => session.id === id),
  )
