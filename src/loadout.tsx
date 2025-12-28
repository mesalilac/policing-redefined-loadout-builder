import { For, Show } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import type {
    T_Loadout,
    T_LoadoutWeapon,
    T_Weapon,
    T_WeaponLocation,
} from './consts';
import { WEAPON_LOCATIONS } from './consts';
import './loadout.css';

export default (props: {
    weapon: T_LoadoutWeapon;
    weapons_list: T_Weapon[];
    loadout: T_Loadout;
    setLoadout: SetStoreFunction<T_Loadout>;
}) => {
    return (
        <div class='loadout-weapon-list-item'>
            <img
                class='loadout-weapon-list-item-img'
                src={`/weapons/${props.weapon.hash}.png`}
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
                            <span>Starting ammo count</span>
                            <input
                                class='loadout-weapon-ammo-count-input'
                                type='number'
                                max={9999}
                                value={props.weapon.starting_ammo_count || 0}
                                onChange={(e) =>
                                    props.setLoadout(
                                        'weapons',
                                        (x) => x.hash === props.weapon.hash,
                                        'starting_ammo_count',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div class='loadout-weapon-list-item-setting-input-lable'>
                            <span>is vehicle weapon</span>
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
                                        e.target.checked,
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
                            <span>use racking animation</span>
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
                                        e.target.checked,
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div class='loadout-weapon-list-item-setting-input-lable'>
                        <span>weapon location</span>
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
                        <span>
                            components ({props.weapon.components.length}/
                            {props.weapons_list.find(
                                (x) => x.hash === props.weapon.hash,
                            )?.components.length || 0}
                            )
                        </span>
                        <Show when={props.weapon.components.length > 0}>
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
                                        >
                                            {component.title}
                                        </option>
                                    )}
                                </For>
                            </select>
                        </Show>
                    </div>
                    <div class='loadout-weapon-list-item-setting-input-lable'>
                        <span>tint</span>
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
                                    <option value={index()}>{tint}</option>
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
            >
                Remove
            </button>
        </div>
    );
};
