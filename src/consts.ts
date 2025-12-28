export interface T_Weapon {
    name: string;
    hash: string;
    model_hash_key: string;
    group: string;
    dlc: string;
    description: string;
    components: { title: string; hash: string }[];
    tints: string[];
}

export const WEAPON_LOCATIONS = ['FrontDoors', 'Trunk', 'Any'];
export type T_WeaponLocation = (typeof WEAPON_LOCATIONS)[number];

export interface T_LoadoutWeapon {
    name: string;
    hash: string;
    model_hash_key: string;
    group: string;
    display_name: string | null;
    starting_ammo_count: number | null;
    is_vehicle_weapon: boolean | null;
    use_racking_animation: boolean | null;
    weapon_location: T_WeaponLocation | null;
    components: { title: string; hash: string }[];
    tint: number | null;
}

export interface T_Loadout {
    name: string;
    weapons: T_LoadoutWeapon[];
}

export const DEFAULT_LOADOUT_NAME = 'Default Loadout';
