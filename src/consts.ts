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

export const WEAPON_LOCATIONS = ["FrontDoors" | "Trunk" | "Any"];

export interface LoadoutWeapon {
	name: string;
	hash: string;
	model_hash_key: string;
	group: string;
	display_name: string | null;
	starting_ammo_count: number | null;
	is_vehicle_weapon: boolean | null;
	use_racking_animation: boolean | null;
	weapon_location: (typeof WEAPON_LOCATIONS)[number] | null;
	components: { title: string; hash: string }[];
	tints: number;
}

export interface Loadout {
	name: string;
	weapons: LoadoutWeapon[];
}
