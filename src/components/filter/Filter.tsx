import './filter.css';
export type FilterType = "LIVE" | "FULL_PROGRAM" | "FAVORITES";

interface Props {
    filter: FilterType;
    onChange: (filter: FilterType) => void;
}

const Button = ({ children, onClick, current }: any) => (
    <button
        className={`${
            current ? "bg-white text-darkgray border-2 active:bg-white py-6 px-6 sm:px-10 no-underline rounded-md hover:bg-white border-darkgray hover:text-darkgray max-sm:text-lg whitespace-nowrap mb-2" : "bg-darkgreen active:bg-white py-6 px-6 sm:px-10 text-white no-underline rounded-md border-2 border-transparent hover:bg-white hover:border-darkgray hover:text-darkgray max-sm:text-lg whitespace-nowrap mb-2"
        } p-2 rounded-lg`}
        onClick={onClick}
    >
        {children}
    </button>
);

export const Filter = ({ filter, onChange }: Props) => (
    <div className="p-4 flex">
        <div className="mx-auto gap-10 flex flex-col md:flex-row">
            <img
                src="/images/characters/jz24-disc.svg"
                alt="Retro disc character"
                className="h-[80px] render-img"
            />
            <Button
                onClick={() => onChange("FULL_PROGRAM")}
                current={filter === "FULL_PROGRAM"}
            >
                Full program
            </Button>
            <Button
                onClick={() => onChange("LIVE")}
                current={filter === "LIVE"}
            >
                Live-mode
            </Button>
            <Button
                onClick={() => onChange("FAVORITES")}
                current={filter === "FAVORITES"}
            >
                My favorites
            </Button>
            <img
                src={`/images/characters/jz24-mc.svg`}
                alt="Retro disc character"
                className="h-[120px] -mt-[40px] render-img"
            />
        </div>
    </div>
);
