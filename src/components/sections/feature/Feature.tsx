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

export function Feature({ name, description, icon }: FeatureProps) {
  const IconComponent = iconMap[icon];

  return (
    <div className="flex w-64 flex-col items-center rounded-2xl border bg-primary/10 border-none transition-all">
      <div className="flex w-22 flex-col items-center gap-4 rounded-lg p-6 text-center">
        <div className="mt-2 mb-2 flex h-22 w-22 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
          <IconComponent className="h-16 w-16" />
        </div>
        <p className="mb-2 font-semibold text-foreground">{name}</p>
      </div>
      <p className="m-2 p-4 text-sm text-foreground/80">{description}</p>
    </div>
  );
}
