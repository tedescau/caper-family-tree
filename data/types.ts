export interface Person {
  id: string;
  name: string;
  title: string;
  bio: string;
  tags: string[];
  active_since?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  opened: number;
  closed?: number;
  status: "active" | "closed";
  group: string;
}

export interface Group {
  id: string;
  name: string;
  type: string;
  founded: number;
  description: string;
}

export interface Relationship {
  source: string;
  target: string;
  type:
    | "alumni"
    | "founded"
    | "current_staff"
    | "opened_new"
    | "belongs_to"
    | "family"
    | "same_space";
  label: string;
}

export interface FamilyData {
  people: Person[];
  restaurants: Restaurant[];
  groups: Group[];
  relationships: Relationship[];
}
