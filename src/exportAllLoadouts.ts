import { XMLBuilder } from 'fast-xml-parser';
import { Accessor, Setter } from 'solid-js';
import type { T_SavedLoadout } from './consts';

export function exportAllLoadouts(props: {
    setXmlOutput: Setter<string>;
    setShowXmlOutput: Setter<boolean>;
    selectedSavedLoadoutID: Accessor<number>;
    savedLoadouts: Accessor<T_SavedLoadout[]>;
}) {
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        suppressBooleanAttributes: false,
        format: true,
        indentBy: '\t',
        suppressEmptyNode: true,
    });

    const obj = {
        LoadoutsRoot: {
            '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
            AllLoadouts: {
                Loadout: props.savedLoadouts().map((s, index) => {
                    const isDefaultLoadout =
                        s.id === props.selectedSavedLoadoutID() ||
                        (index === 0 && props.selectedSavedLoadoutID() === -1);

                    const loadoutNode = {
                        '@_LoadoutName': s.name,
                        ...(isDefaultLoadout && {
                            '@_IsDefaultLoadout': 'true',
                        }),
                        LoadoutWeapons: {
                            LoadoutWeapon: s.weapons.map((w) => {
                                const weaponNode = {
                                    '@_WeaponHash': w.hash,
                                    ...(w.starting_ammo_count !== null && {
                                        '@_StartingAmmoCount':
                                            w.starting_ammo_count,
                                    }),
                                    ...(w.is_vehicle_weapon !== null && {
                                        '@_IsVehicleWeapon':
                                            w.is_vehicle_weapon,
                                    }),
                                    ...(w.use_racking_animation !== null && {
                                        '@_UseRackingAnimation':
                                            w.use_racking_animation,
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
                                        WeaponComponent: w.components.map(
                                            (c) => ({
                                                '@_ComponentHash': c,
                                            }),
                                        ),
                                    },
                                };

                                return weaponNode;
                            }),
                        },
                    };

                    return loadoutNode;
                }),
            },
        },
    };

    const xml = `<?xml version="1.0" encoding="utf-8"?>\n${builder.build(obj)}`;

    props.setXmlOutput(xml);
    props.setShowXmlOutput(true);
}
