import { XMLBuilder } from 'fast-xml-parser';
import { Setter } from 'solid-js';
import type { T_Loadout } from './consts';

export function exportLoadout(props: {
    setXmlOutput: Setter<string>;
    setShowXmlOutput: Setter<boolean>;
    loadout: T_Loadout;
}) {
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        suppressBooleanAttributes: false,
        format: true,
    });

    const obj = {
        Loadout: {
            '@_LoadoutName': props.loadout.name,
            '@_IsDefaultLoadout': 'true',
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
