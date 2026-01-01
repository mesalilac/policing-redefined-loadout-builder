import { XMLBuilder } from 'fast-xml-parser';
import { createSignal, For, onMount, Show } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import {
    DEFAULT_LOADOUT_NAME,
    DEFAULT_LOADOUT_WEAPONS,
    type T_Loadout,
    type T_LoadoutWeapon,
    type T_Weapon,
} from './consts';
import Loadout from './loadout';
import './mainContent.css';

const LOADOUT_KEY = 'Loadout';

export default (props: {
    weapons_list: T_Weapon[];
    loadout: T_Loadout;
    setLoadout: SetStoreFunction<T_Loadout>;
}) => {
    const [xmlOutput, setXmlOutput] = createSignal('');
    const [showXmlOutput, setShowXmlOutput] = createSignal(false);

    function saveCurrentloadout() {
        localStorage.setItem(LOADOUT_KEY, JSON.stringify(props.loadout));
    }

    function loadSavedloadout() {
        const savedLoadout = localStorage.getItem(LOADOUT_KEY);
        if (savedLoadout) {
            props.setLoadout(JSON.parse(savedLoadout));
        }
    }

    function clearSavedloadout() {
        localStorage.removeItem(LOADOUT_KEY);
    }

    onMount(() => {
        if (localStorage.getItem(LOADOUT_KEY)) {
            loadSavedloadout();
        } else {
            props.setLoadout('name', DEFAULT_LOADOUT_NAME);
            props.setLoadout('weapons', DEFAULT_LOADOUT_WEAPONS);
        }
    });

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

        setXmlOutput(xml);
        setShowXmlOutput(true);
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
                <div class='main-content-navbar-saved-loadout-buttons'>
                    <button onClick={() => saveCurrentloadout()}>
                        Save current loadout
                    </button>
                    <button onClick={() => loadSavedloadout()}>
                        Load saved loadout
                    </button>
                    <button onClick={() => clearSavedloadout()}>
                        Clear saved loadout
                    </button>
                </div>
                <div class='main-content-navbar-buttons'>
                    <button
                        onClick={() => props.setLoadout('weapons', [])}
                        disabled={props.loadout.weapons.length === 0}
                    >
                        Clear loadout
                    </button>
                    <Show when={showXmlOutput()}>
                        <div class='main-content-xml-output-dialog'>
                            <h1>XML output</h1>
                            <textarea
                                class='main-content-xml-textarea'
                                value={xmlOutput()}
                                wrap='soft'
                                spellcheck={false}
                            />
                            <button onClick={() => setShowXmlOutput(false)}>
                                Close
                            </button>
                        </div>
                    </Show>
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
