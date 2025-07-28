import { 
    BiTargetLock, 
    BiData, 
    BiBarChart, 
    BiSolidShareAlt 
} from "react-icons/bi";

import { IconType } from "react-icons";

const iconMap: { [key: string]: IconType } = {
    gather: BiTargetLock,
    store: BiData,
    analyze: BiBarChart,
    share: BiSolidShareAlt,
};

type FeatureProps = {
    name: string;
    description: string;
    icon: keyof typeof iconMap;
};

export function Feature({
    name,
    description,
    icon,
}: FeatureProps) {
    const IconComponent = iconMap[icon];

    return (
        <div className="flex flex-col items-center rounded-2xl w-64 transition-all bg-indigo-950 border-2 border-indigo-950">
            <div className="flex flex-col items-center text-background w-22 gap-4 rounded-lg p-6 text-center">
                <div className="flex h-22 w-22 mt-2 mb-2 items-center justify-center rounded-full bg-indigo-700 transition-colors hover:bg-indigo-500 hover:text-background">
                    <IconComponent className="h-16 w-16" />
                </div>
                <p className="font-semibold mb-2">{name}</p>
            </div>
            <p className="p-4 text-sm text-background m-2">{description}</p>
        </div>
    );
}
