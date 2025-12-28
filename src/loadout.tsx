import { For } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import type { T_Loadout, T_LoadoutWeapon, T_Weapon } from './consts';
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
                        <span>weapon_location</span>
                    </div>
                    <div class='loadout-weapon-list-item-setting-input-lable'>
                        <span>weapon_location</span>
                    </div>
                    <div class='loadout-weapon-list-item-setting-input-lable'>
                        <span>components</span>
                    </div>
                    <div class='loadout-weapon-list-item-setting-input-lable'>
                        <span>tint</span>
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
