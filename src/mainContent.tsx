import { XMLBuilder } from 'fast-xml-parser';
import { createSignal, For, onMount, Show } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import {
    DEFAULT_LOADOUT_NAME,
    type T_Loadout,
    type T_LoadoutWeapon,
    type T_Weapon,
} from './consts';
import Loadout from './loadout';
import './mainContent.css';

export default (props: {
    weapons_list: T_Weapon[];
    loadout: T_Loadout;
    setLoadout: SetStoreFunction<T_Loadout>;
}) => {
    const [xmlOutput, setXmlOutput] = createSignal('');
    const [showXmlOutput, setShowXmlOutput] = createSignal(false);

    onMount(() => {
        if (props.loadout.weapons.length === 0) {
            props.setLoadout('name', DEFAULT_LOADOUT_NAME);
            props.setLoadout('weapons', [
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
                    components: [
                        'COMPONENT_AT_AR_AFGRIP',
                        'COMPONENT_AT_AR_FLSH',
                    ],
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
                    tint: null,
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
                    tint: null,
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
            ]);
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
                <div class='main-content-navbar-buttons'>
                    <button
                        onClick={() => props.setLoadout('weapons', [])}
                        disabled={props.loadout.weapons.length === 0}
                    >
                        Clear loadout
                    </button>
                    <button disabled={true}>Load loadout</button>
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
