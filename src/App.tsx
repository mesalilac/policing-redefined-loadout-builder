import { Component, createSignal, For, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Loadout, LoadoutWeapon } from './consts';
import { DEFAULT_LOADOUT_NAME } from './consts';
import Sidebar from './sidebar';
import './app.css';

const App: Component = () => {
    const [loadoutName, setLoadoutName] = createSignal('');
    const [loadout, setLoadout] = createStore<Loadout>({
        name: DEFAULT_LOADOUT_NAME,
        weapons: [],
    });

    function clearLoadout() {
        setLoadout({
            name: DEFAULT_LOADOUT_NAME,
            weapons: [],
        });
    }

    function changeWeaponDisplayname(value: string, hash: string) {
        const index = loadout.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout.weapons[index].display_name = value;
        }
    }

    function changeWeaponStartingAmmoCount(value: string, hash: string) {
        if (loadout === null) return;

        const index = loadout.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout.weapons[index].starting_ammo_count = parseInt(value);
        }
    }

    function changeWeaponIsVehicleWeapon(value: boolean, hash: string) {
        if (loadout === null) return;

        const index = loadout.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout.weapons[index].is_vehicle_weapon = value;
        }
    }

    function changeWeaponUseRackingAnimation(value: boolean, hash: string) {
        if (loadout === null) return;

        const index = loadout.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout.weapons[index].use_racking_animation = value;
        }
    }

    function clearWeapon(hash: string) {
        if (loadout === null) return;

        const index = loadout.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout.weapons[index].display_name = null;
            loadout.weapons[index].starting_ammo_count = null;
            loadout.weapons[index].is_vehicle_weapon = null;
            loadout.weapons[index].use_racking_animation = null;
            loadout.weapons[index].weapon_location = null;
            loadout.weapons[index].components = [];
            loadout.weapons[index].tint = null;
        }
    }

    function removeWeapon(hash: string) {
        if (loadout === null) return;

        setLoadout({
            name: loadout.name,
            weapons: loadout.weapons.filter((w) => w.hash !== hash),
        });
    }

    return (
        <div class='container'>
            <Sidebar loadout={loadout} setLoadout={setLoadout} />
            <div class='main-content'>
                <h1>Loadout builder</h1>

                <div class='main-content-navbar'>
                    <input
                        class='loadout-name-input'
                        placeholder='Default Loadout'
                        onChange={(e) => setLoadoutName(e.target.value)}
                        disabled={loadout === null}
                    />
                    <div class='main-content-navbar-buttons'>
                        <button
                            onClick={() => clearLoadout()}
                            disabled={loadout === null}
                        >
                            Clear loadout
                        </button>
                        <button disabled={true}>Load loadout</button>
                        <button disabled={true}>Export loadout</button>
                    </div>
                </div>

                <Show when={loadout !== null}>
                    <div class='loadout-weapons-list'>
                        <For each={loadout.weapons}>
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
                                                    value={
                                                        weapon.display_name ||
                                                        ''
                                                    }
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
                                                    <span>
                                                        Starting ammo count
                                                    </span>
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
                                                    <span>
                                                        is vehicle weapon
                                                    </span>
                                                    <input
                                                        type='checkbox'
                                                        checked={
                                                            weapon.is_vehicle_weapon ||
                                                            false
                                                        }
                                                        onChange={(e) =>
                                                            changeWeaponIsVehicleWeapon(
                                                                e.target
                                                                    .checked,
                                                                weapon.hash,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div class='loadout-weapon-list-item-setting-input-lable'>
                                                    <span>
                                                        use racking animation
                                                    </span>
                                                    <input
                                                        type='checkbox'
                                                        checked={
                                                            weapon.use_racking_animation ||
                                                            false
                                                        }
                                                        onChange={(e) =>
                                                            changeWeaponUseRackingAnimation(
                                                                e.target
                                                                    .checked,
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
                                        onClick={() =>
                                            removeWeapon(weapon.hash)
                                        }
                                        class='weapon-list-item-remove-btn'
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </div>
        </div>
    );
};

export default App;
