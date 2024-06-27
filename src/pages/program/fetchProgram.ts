import type { Program } from "types/program"

interface NextRevalidateConfig {
  revalidate?: false | number
  tags: string[] | undefined
}

export async function fetchProgram(
  {
    revalidateConfig,
  }: {
    revalidateConfig?: NextRevalidateConfig
  } = {
    revalidateConfig: {
      tags: undefined,
      revalidate: CACHE_TIME,
    },
  },
) {
  return await fetch('https://sleepingpill.javazone.no/public/allSessions/javazone_2024', {
  }).then<Program>((res) => res.json())
}

const CACHE_TIME = 60 * 15 

export const fetchIndividualProgram = (
  id?: string,
  config: NextRevalidateConfig = { revalidate: CACHE_TIME, tags: undefined },
) =>
  fetchProgram({ revalidateConfig: config }).then((program) =>
    program.sessions.find((session) => session.id === id),
  )
