import { XMLBuilder } from 'fast-xml-parser';
import { Accessor, Setter } from 'solid-js';
import type { T_Loadout, T_SavedLoadout } from './consts';

export function exportAllLoadouts(props: {
    setXmlOutput: Setter<string>;
    setShowXmlOutput: Setter<boolean>;
    selectedSavedLoadoutID: Accessor<number>;
    loadout: T_Loadout; // TODO: remove after create the map over savedLoadouts
    savedLoadouts: Accessor<T_SavedLoadout[]>;
}) {
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        suppressBooleanAttributes: false,
        format: true,
    });

    const obj = {
        Loadout: {
            '@_LoadoutName': props.loadout.name,
            ...(true && { '@_IsDefaultLoadout': 'true' }), // TODO: check if loadout.id === selectedSavedLoadoutID
            LoadoutWeapons: {
                LoadoutWeapon: props.loadout.weapons.map((w) => {
                    const weaponNode = {
                        '@_WeaponHash': w.hash,
                        ...(w.starting_ammo_count !== null && {
                            '@_StartingAmmoCount': w.starting_ammo_count,
                        }),
                        ...(w.is_vehicle_weapon !== null && {
                            '@_IsVehicleWeapon': w.is_vehicle_weapon,
                        }),
                        ...(w.use_racking_animation !== null && {
                            '@_UseRackingAnimation': w.use_racking_animation,
                        }),
                        ...(w.weapon_location !== null && {
                            '@_WeaponLocation': w.weapon_location,
                        }),
                        ...(w.tint !== null && {
                            '@_WeaponTintIndex': w.tint,
                        }),
                        ...(w.display_name !== null && {
                            '@_WeaponDisplayName': w.display_name,
                        }),

                        WeaponComponents: {
                            WeaponComponent: w.components.map((c) => ({
                                '@_ComponentHash': c,
                            })),
                        },
                    };

                    return weaponNode;
                }),
            },
        },
    };

    const xml = builder.build(obj);

    props.setXmlOutput(xml);
    props.setShowXmlOutput(true);
}
