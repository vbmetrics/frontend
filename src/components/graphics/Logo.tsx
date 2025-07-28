
export function Logo() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-float-logo"
            >
            <circle cx="12" cy="12" r="10" strokeDasharray="2 2" />
            <line x1="12" y1="6" x2="12" y2="18" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="8" y1="8" x2="16" y2="16" />
            <line x1="8" y1="16" x2="16" y2="8" />
            </svg>
    );
}
