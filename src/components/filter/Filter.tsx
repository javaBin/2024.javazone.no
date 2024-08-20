export type FilterType = "LIVE" | "FULL_PROGRAM" | "FAVORITES";

interface Props {
    filter: FilterType;
    onChange: (filter: FilterType) => void;
}

export const Filter = ({ filter, onChange }: Props) => (
    <div>
        <button
            aria-current={filter === "LIVE"}
            onClick={() => onChange("LIVE")}
        >
            Live-mode
        </button>
        <button
            aria-current={filter === "FULL_PROGRAM"}
            onClick={() => onChange("FULL_PROGRAM")}
        >
            Full program
        </button>
        <button
            aria-current={filter === "FAVORITES"}
            onClick={() => onChange("FAVORITES")}
        >
            My favorites
        </button>
    </div>
);
