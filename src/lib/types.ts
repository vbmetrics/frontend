export type SeasonType = "club" | "national";

export type Country = {
    code: string;
    name: string;
};

export type Season = {
    id: string;
    name: string;
    season_type: SeasonType;
    start_date: string;
    end_date: string;
};

export type Arena = {
    id: string;
    name: string;
    country_code: string;
    city: string | null;
    address: string | null;
    capacity: number | null;
};
