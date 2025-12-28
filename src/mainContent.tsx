import { For } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import type { Loadout, LoadoutWeapon, Weapon } from './consts';
import './mainContent.css';

export default (props: {
    weapons_list: Weapon[];
    loadout: Loadout;
    setLoadout: SetStoreFunction<Loadout>;
}) => {
    function clearLoadout() {}

    function changeWeaponDisplayname(value: string, hash: string) {}

    function changeWeaponStartingAmmoCount(value: string, hash: string) {}

    function changeWeaponIsVehicleWeapon(value: boolean, hash: string) {}

    function changeWeaponUseRackingAnimation(value: boolean, hash: string) {}

    function clearWeapon(hash: string) {}

    function removeWeapon(hash: string) {}

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
                        onClick={() => clearLoadout()}
                        disabled={props.loadout.weapons.length === 0}
                    >
                        Clear loadout
                    </button>
                    <button disabled={true}>Load loadout</button>
                    <button disabled={true}>Export loadout</button>
                </div>
            </div>

            <div class='loadout-weapons-list'>
                <For each={props.loadout.weapons}>
                    {(weapon) => (
                        <div class='loadout-weapon-list-item'>
                            <img
                                class='loadout-weapon-list-item-img'
                                src={`/weapons/${weapon.hash}.png`}
                                alt='no image!'
                            />
                            <div class='loadout-weapon-list-item-info'>
                                <div class='loadout-weapon-list-item-info-text'>
                                    <span>
                                        <strong>Name: </strong>
                                        {weapon.name}
                                    </span>
                                    <span>
                                        <strong>Hash: </strong>
                                        {weapon.hash}
                                    </span>
                                    <span>
                                        <strong>Group: </strong>
                                        {weapon.group}
                                    </span>
                                    <div class='loadout-weapon-list-item-settings-list'>
                                        <input
                                            placeholder='Display name'
                                            value={weapon.display_name || ''}
                                            onChange={(e) =>
                                                changeWeaponDisplayname(
                                                    e.target.value,
                                                    weapon.hash,
                                                )
                                            }
                                            disabled={
                                                weapon.is_vehicle_weapon !==
                                                true
                                            }
                                        />
                                        <div class='loadout-weapon-list-item-setting-input-lable'>
                                            <span>Starting ammo count</span>
                                            <input
                                                class='loadout-weapon-ammo-count-input'
                                                type='number'
                                                max={9999}
                                                value={
                                                    weapon.starting_ammo_count ||
                                                    0
                                                }
                                                onChange={(e) =>
                                                    changeWeaponStartingAmmoCount(
                                                        e.target.value,
                                                        weapon.hash,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div class='loadout-weapon-list-item-setting-input-lable'>
                                            <span>is vehicle weapon</span>
                                            <input
                                                type='checkbox'
                                                checked={
                                                    weapon.is_vehicle_weapon ||
                                                    false
                                                }
                                                onChange={(e) =>
                                                    changeWeaponIsVehicleWeapon(
                                                        e.target.checked,
                                                        weapon.hash,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div class='loadout-weapon-list-item-setting-input-lable'>
                                            <span>use racking animation</span>
                                            <input
                                                type='checkbox'
                                                checked={
                                                    weapon.use_racking_animation ||
                                                    false
                                                }
                                                onChange={(e) =>
                                                    changeWeaponUseRackingAnimation(
                                                        e.target.checked,
                                                        weapon.hash,
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
                                onClick={() => clearWeapon(weapon.hash)}
                                class='weapon-list-item-remove-btn'
                                title='Clear weapon properties'
                            >
                                clear
                            </button>
                            <button
                                onClick={() => removeWeapon(weapon.hash)}
                                class='weapon-list-item-remove-btn'
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};
