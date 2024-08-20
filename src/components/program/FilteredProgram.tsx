import type { Session } from "../../../types/program.ts";
import { Filter, type FilterType } from "@/components/filter/Filter.tsx";
import { Program } from "@/components/program/Program.tsx";
import { useState } from "react";

interface Props {
    timeSlots: string[];
    sessions: Record<string, Session[]>;
}

export const FilteredProgram = ({ timeSlots, sessions }: Props) => {
    const [filter, setFilter] = useState<FilterType>("LIVE");



    return (
        <>
            <Filter filter={filter} onChange={setFilter} />
            <Program timeSlots={timeSlots} sessions={sessions} />
        </>
    );
};
