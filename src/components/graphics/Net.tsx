export function Net() {
    return (
        <svg
            width="360"
            height="240"
            viewBox="0 0 360 240"
            fill="none"
            className="text-indigo-700 dark:text-indigo-600"
        >
            <defs>
                <pattern id="net" x="20" y="40" patternUnits="userSpaceOnUse" width="32" height="32">
                    <path
                        d="M0 0 L32 0 M0 16 L32 16 M0 32 L32 32 M0 0 L0 32 M16 0 L16 32 M32 0 M32 32"
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.6"
                    />
                </pattern>
            </defs>
            
            <rect
                x="10"
                y="40"
                width="340"
                height="80"
                fill="url(#net)"
                stroke="currentColor"
                strokeWidth="2"
            />
            
            <line x1="10" y1="10" x2="10" y2="180" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="350" y1="10" x2="350" y2="180" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            <circle
                cx="60"
                cy="20"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="2,1"
            />
        </svg>
    );
}