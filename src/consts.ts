export interface Weapon {
    name: string;
    hash: string;
    model_hash_key: string;
    group: string;
    dlc: string;
    description: string;
    components: { title: string; hash: string }[];
    tints: string[];
}

export interface LoadoutWeapon {
    name: string;
    hash: string;
    model_hash_key: string;
    group: string;
    display_name: string | null;
    starting_ammo_count: number | null;
    is_vehicle_weapon: boolean | null;
    use_racking_animation: boolean | null;
    weapon_location: 'FrontDoors' | 'Trunk' | 'Any' | null;
    components: { title: string; hash: string }[];
    tint: number | null;
}

export interface Loadout {
    name: string;
    weapons: LoadoutWeapon[];
}
