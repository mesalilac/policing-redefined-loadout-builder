import { For, Show } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import type {
    T_Loadout,
    T_LoadoutWeapon,
    T_Weapon,
    T_WeaponLocation,
} from './consts';
import {
    CAN_HAVE_AMMO_GROUPS,
    DEFAULT_STARTING_AMMO_COUNT,
    WEAPON_LOCATIONS,
} from './consts';
import './loadout.css';

export default (props: {
    currentIndex: number;
    weapon: T_LoadoutWeapon;
    weapons_list: T_Weapon[];
    loadout: T_Loadout;
    setLoadout: SetStoreFunction<T_Loadout>;
}) => {
    if (CAN_HAVE_AMMO_GROUPS.includes(props.weapon.group.toLowerCase())) {
        props.setLoadout(
            'weapons',
            (x) =>
                x.hash === props.weapon.hash && x.starting_ammo_count === null,
            'starting_ammo_count',
            DEFAULT_STARTING_AMMO_COUNT,
        );
    }

    const moveWeapon = (
        index: number,
        direction: 'start' | 'up' | 'end' | 'down',
    ) => {
        props.setLoadout('weapons', (prevWeapons) => {
            if (prevWeapons.length < 2) return prevWeapons;

            const newWeapons = [...prevWeapons];

            if (direction === 'start' || direction === 'end') {
                const [movedItem] = newWeapons.splice(index, 1);

                if (direction === 'start') {
                    newWeapons.unshift(movedItem);
                } else {
                    newWeapons.push(movedItem);
                }

                return newWeapons;
            }

            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            if (targetIndex < 0 || targetIndex >= newWeapons.length)
                return prevWeapons;

            [newWeapons[index], newWeapons[targetIndex]] = [
                newWeapons[targetIndex],
                newWeapons[index],
            ];

            return newWeapons;
        });
    };

    return (
        <div class='loadout-weapon-list-item'>
            <div class='loadout-weapon-reorder-buttons'>
                <button
                    onClick={(e) =>
                        e.shiftKey
                            ? moveWeapon(props.currentIndex, 'start')
                            : moveWeapon(props.currentIndex, 'up')
                    }
                    disabled={props.currentIndex === 0}
                    title='Move weapon backward (Shift + Click to send to start)'
                >
                    {'<'}
                </button>
                <button
                    onClick={(e) =>
                        e.shiftKey
                            ? moveWeapon(props.currentIndex, 'end')
                            : moveWeapon(props.currentIndex, 'down')
                    }
                    disabled={
                        props.currentIndex === props.loadout.weapons.length - 1
                    }
                    title='Move weapon forward (Shift + Click to send to end)'
                >
                    {'>'}
                </button>
            </div>
            <img
                class='loadout-weapon-list-item-img'
                src={`./weapons/${props.weapon.hash}.png`}
                alt='no image!'
            />
            <div class='loadout-weapon-list-item-info'>
                <div class='loadout-weapon-list-item-info-text'>
                    <span>
                        <strong>Name: </strong>
                        {props.weapon.name}
                    </span>
                    <span>
                        <strong>Hash: </strong>
                        {props.weapon.hash}
                    </span>
                    <span>
                        <strong>Group: </strong>
                        {props.weapon.group}
                    </span>
                    <div class='loadout-weapon-list-item-settings-list'>
                        <input
                            placeholder='Display name...'
                            title='The name that should be displayed in the patrol vehicle menu'
                            value={props.weapon.display_name || ''}
                            onChange={(e) =>
                                props.setLoadout(
                                    'weapons',
                                    (x) => x.hash === props.weapon.hash,
                                    'display_name',
                                    e.target.value,
                                )
                            }
                            disabled={props.weapon.is_vehicle_weapon !== true}
                        />
                        <div class='loadout-weapon-list-item-setting-input-lable'>
                            <span title='How much ammo this weapon should get when the loadout is equipped'>
                                Starting ammo count
                            </span>
                            <input
                                class='loadout-weapon-ammo-count-input'
                                type='number'
                                max={9999}
                                value={props.weapon.starting_ammo_count || 0}
                                disabled={
                                    !CAN_HAVE_AMMO_GROUPS.includes(
                                        props.weapon.group.toLowerCase(),
                                    )
                                }
                                onChange={(e) =>
                                    props.setLoadout(
                                        'weapons',
                                        (x) => x.hash === props.weapon.hash,
                                        'starting_ammo_count',
                                        parseInt(e.target.value) || null,
                                    )
                                }
                            />
                        </div>
                        <div class='loadout-weapon-list-item-setting-input-lable'>
                            <span title='Whether this weapon has to be retrieved from a patrol vehicle first'>
                                is vehicle weapon
                            </span>
                            <input
                                type='checkbox'
                                checked={
                                    props.weapon.is_vehicle_weapon || false
                                }
                                onChange={(e) => {
                                    props.setLoadout(
                                        'weapons',
                                        (x) => x.hash === props.weapon.hash,
                                        'is_vehicle_weapon',
                                        e.target.checked || null,
                                    );
                                    if (props.weapon.display_name === null)
                                        props.setLoadout(
                                            'weapons',
                                            (x) => x.hash === props.weapon.hash,
                                            'display_name',
                                            props.weapon.name,
                                        );

                                    if (e.target.checked === false) {
                                        props.setLoadout(
                                            'weapons',
                                            (x) => x.hash === props.weapon.hash,
                                            [
                                                'display_name',
                                                'use_racking_animation',
                                                'weapon_location',
                                            ],
                                            null,
                                        );
                                    }
                                }}
                            />
                        </div>
                        <div class='loadout-weapon-list-item-setting-input-lable'>
                            <span title='Whether a small animation should be played when you retrieve the weapon from a patrol vehicle'>
                                use racking animation
                            </span>
                            <input
                                type='checkbox'
                                checked={
                                    props.weapon.use_racking_animation || false
                                }
                                disabled={
                                    props.weapon.is_vehicle_weapon !== true
                                }
                                onChange={(e) =>
                                    props.setLoadout(
                                        'weapons',
                                        (x) => x.hash === props.weapon.hash,
                                        'use_racking_animation',
                                        e.target.checked || null,
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div class='loadout-weapon-list-item-setting-input-lable'>
                        <span title='Where the weapon is located in the vehicle (FrontDoors, Trunk, Any)'>
                            weapon location
                        </span>
                        <select
                            disabled={props.weapon.is_vehicle_weapon !== true}
                            onChange={(e) => {
                                props.setLoadout(
                                    'weapons',
                                    (x) => x.hash === props.weapon.hash,
                                    'weapon_location',
                                    (e.target.value ||
                                        null) as T_WeaponLocation,
                                );
                            }}
                        >
                            <option></option>
                            <For each={WEAPON_LOCATIONS}>
                                {(location) => (
                                    <option
                                        selected={
                                            props.weapon.weapon_location ===
                                            location
                                        }
                                    >
                                        {location}
                                    </option>
                                )}
                            </For>
                        </select>
                    </div>
                    <div class='loadout-weapon-list-item-setting-input-lable'>
                        <span title='Weapon attachments'>
                            components ({props.weapon.components.length}/
                            {props.weapons_list.find(
                                (x) => x.hash === props.weapon.hash,
                            )?.components.length || 0}
                            )
                        </span>
                        <Show
                            when={
                                props.weapons_list.find(
                                    (x) => x.hash === props.weapon.hash,
                                )?.components.length || 0 > 0
                            }
                        >
                            <select
                                role='listbox'
                                onChange={(e) => {
                                    const selected = Array.from(
                                        e.target.selectedOptions,
                                    ).map((x) => x.value);

                                    props.setLoadout(
                                        'weapons',
                                        (x) => x.hash === props.weapon.hash,
                                        'components',
                                        selected,
                                    );
                                }}
                                multiple
                            >
                                <For
                                    each={
                                        props.weapons_list.find(
                                            (x) => x.hash === props.weapon.hash,
                                        )?.components
                                    }
                                >
                                    {(component) => (
                                        <option
                                            title={component.hash}
                                            value={component.hash}
                                            selected={props.weapon.components.includes(
                                                component.hash,
                                            )}
                                            class='loadout-weapon-list-item-component-option'
                                        >
                                            <img
                                                src={`./components/${component.hash}.png`}
                                                alt=''
                                                class='loadout-weapon-list-item-component-image'
                                            />
                                            {component.title}
                                        </option>
                                    )}
                                </For>
                            </select>
                        </Show>
                    </div>
                    <div class='loadout-weapon-list-item-setting-input-lable'>
                        <span title='The tint of the weapon'>tint</span>
                        <select
                            onChange={(e) => {
                                props.setLoadout(
                                    'weapons',
                                    (x) => x.hash === props.weapon.hash,
                                    'tint',
                                    parseInt(e.target.value) || null,
                                );
                            }}
                        >
                            <option></option>
                            <For
                                each={
                                    props.weapons_list.find(
                                        (x) => x.hash === props.weapon.hash,
                                    )?.tints
                                }
                            >
                                {(tint, index) => (
                                    <option
                                        value={index()}
                                        selected={props.weapon.tint === index()}
                                    >
                                        {tint}
                                    </option>
                                )}
                            </For>
                        </select>
                    </div>
                </div>
            </div>
            <button
                onClick={() => {
                    props.setLoadout(
                        'weapons',
                        (x) => x.hash === props.weapon.hash,
                        [
                            'display_name',
                            'starting_ammo_count',
                            'is_vehicle_weapon',
                            'use_racking_animation',
                            'weapon_location',
                            'tint',
                        ],
                        null,
                    );
                    props.setLoadout(
                        'weapons',
                        (x) => x.hash === props.weapon.hash,
                        'components',
                        [],
                    );
                }}
                class='weapon-list-item-remove-btn'
                title='Clear weapon properties'
            >
                clear
            </button>
            <button
                onClick={() =>
                    props.setLoadout('weapons', (weapons) =>
                        weapons.filter((x) => x.hash !== props.weapon.hash),
                    )
                }
                class='weapon-list-item-remove-btn'
                title='Remove weapon from loadout'
            >
                Remove
            </button>
        </div>
    );
};
