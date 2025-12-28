import { XMLBuilder } from 'fast-xml-parser';
import { For } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import type { T_Loadout, T_LoadoutWeapon, T_Weapon } from './consts';
import Loadout from './loadout';
import './mainContent.css';

export default (props: {
    weapons_list: T_Weapon[];
    loadout: T_Loadout;
    setLoadout: SetStoreFunction<T_Loadout>;
}) => {
    function exportLoadout() {
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

        console.log(props.loadout.weapons);
        console.log(xml);
    }

    return (
        <div class='main-content'>
            <h1>Loadout builder</h1>

            <div class='main-content-navbar'>
                <input
                    class='loadout-name-input'
                    placeholder='Default Loadout'
                    value={props.loadout.name}
                    onChange={(e) => props.setLoadout('name', e.target.value)}
                />
                <div class='main-content-navbar-buttons'>
                    <button
                        onClick={() => props.setLoadout('weapons', [])}
                        disabled={props.loadout.weapons.length === 0}
                    >
                        Clear loadout
                    </button>
                    <button disabled={true}>Load loadout</button>
                    <button onClick={() => exportLoadout()}>
                        Export loadout
                    </button>
                </div>
            </div>

            <div class='loadout-weapons-list'>
                <For each={props.loadout.weapons}>
                    {(weapon) => (
                        <Loadout
                            weapon={weapon}
                            weapons_list={props.weapons_list}
                            loadout={props.loadout}
                            setLoadout={props.setLoadout}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};
