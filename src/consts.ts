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

export const DEFAULT_STARTING_AMMO_COUNT = 80;

export const CAN_HAVE_AMMO_GROUPS = [
    'heavy',
    'shotgun',
    'sniper',
    'thrown',
    'pistol',
    'smg',
    'rifle',
    'machine-gun',
];

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
    components: string[];
    tint: number | null;
}

export interface T_Loadout {
    name: string;
    weapons: T_LoadoutWeapon[];
}

export const DEFAULT_LOADOUT_NAME = 'Default Loadout';

export const DEFAULT_LOADOUT_WEAPONS = [
    {
        name: 'Pump Shotgun',
        hash: 'WEAPON_PUMPSHOTGUN',
        model_hash_key: 'w_sg_pumpshotgun',
        group: 'shotgun',
        display_name: 'Pump Shotgun',
        starting_ammo_count: 20,
        is_vehicle_weapon: true,
        use_racking_animation: null,
        weapon_location: 'FrontDoors',
        components: ['COMPONENT_AT_AR_FLSH'],
        tint: 5,
    },
    {
        name: 'Carbine Rifle',
        hash: 'WEAPON_CARBINERIFLE',
        model_hash_key: 'W_AR_CARBINERIFLE',
        group: 'rifle',
        display_name: 'Carbine Rifle',
        starting_ammo_count: 60,
        is_vehicle_weapon: true,
        use_racking_animation: true,
        weapon_location: 'FrontDoors',
        components: ['COMPONENT_AT_AR_AFGRIP', 'COMPONENT_AT_AR_FLSH'],
        tint: 5,
    },
    {
        name: 'Tear Gas Launcher',
        hash: 'WEAPON_GRENADELAUNCHER_SMOKE',
        model_hash_key: 'w_lr_grenadelauncher',
        group: 'heavy',
        display_name: 'Smoke Launcher',
        starting_ammo_count: 20,
        is_vehicle_weapon: true,
        use_racking_animation: null,
        weapon_location: 'Trunk',
        components: ['COMPONENT_AT_AR_FLSH'],
        tint: 5,
    },
    {
        name: 'Pistol',
        hash: 'WEAPON_PISTOL',
        model_hash_key: 'W_PI_PISTOL',
        group: 'pistol',
        display_name: null,
        starting_ammo_count: 90,
        is_vehicle_weapon: null,
        use_racking_animation: null,
        weapon_location: null,
        components: ['COMPONENT_AT_PI_FLSH'],
        tint: 5,
    },
    {
        name: 'Stun Gun',
        hash: 'WEAPON_STUNGUN',
        model_hash_key: 'w_pi_stungun',
        group: 'stun-gun',
        display_name: null,
        starting_ammo_count: null,
        is_vehicle_weapon: null,
        use_racking_animation: null,
        weapon_location: null,
        components: [],
        tint: 5,
    },
    {
        name: 'Nightstick',
        hash: 'WEAPON_NIGHTSTICK',
        model_hash_key: 'w_me_nightstick',
        group: 'melee',
        display_name: null,
        starting_ammo_count: null,
        is_vehicle_weapon: null,
        use_racking_animation: null,
        weapon_location: null,
        components: [],
        tint: null,
    },
];
