import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import type { Loadout, LoadoutWeapon, Weapon } from './consts';
import './app.css';

import weapons_list_json from './weapons.json';

const weapons_list: Weapon[] = weapons_list_json;

const App: Component = () => {
    const [loadout, setLoadout] = createSignal<Loadout | null>(null);
    const [query, setQuery] = createSignal('');
    const [loadoutName, setLoadoutName] = createSignal('');
    const [selectedGroup, setSelectedGroup] = createSignal('All');

    const groups = [
        'All',
        ...new Set(weapons_list.map((w) => w.group).filter((g) => g !== '')),
    ];

    const filteredWeapons = createMemo(() => {
        const group = selectedGroup();

        return weapons_list.filter((w) => {
            const matchesText = w.name
                .toLowerCase()
                .includes(query().toLowerCase());

            const matchesGroup = !group || group === 'All' || w.group === group;

            return matchesText && matchesGroup;
        });
    });

    function clearLoadout() {
        setLoadout(null);
    }

    function changeWeaponDisplayname(value: string, hash: string) {
        if (loadout() === null) return;

        const index = loadout()!.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout()!.weapons[index].display_name = value;
        }
    }

    function changeWeaponStartingAmmoCount(value: string, hash: string) {
        if (loadout() === null) return;

        const index = loadout()!.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout()!.weapons[index].starting_ammo_count = parseInt(value);
        }
    }

    function changeWeaponIsVehicleWeapon(value: boolean, hash: string) {
        if (loadout() === null) return;

        const index = loadout()!.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout()!.weapons[index].is_vehicle_weapon = value;
        }
    }

    function changeWeaponUseRackingAnimation(value: boolean, hash: string) {
        if (loadout() === null) return;

        const index = loadout()!.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout()!.weapons[index].use_racking_animation = value;
        }
    }

    function clearWeapon(hash: string) {
        if (loadout() === null) return;

        const index = loadout()!.weapons.findIndex((w) => w.hash === hash);

        if (index !== -1) {
            loadout()!.weapons[index].display_name = null;
            loadout()!.weapons[index].starting_ammo_count = null;
            loadout()!.weapons[index].is_vehicle_weapon = null;
            loadout()!.weapons[index].use_racking_animation = null;
            loadout()!.weapons[index].weapon_location = null;
            loadout()!.weapons[index].components = [];
            loadout()!.weapons[index].tint = null;
        }
    }

    function removeWeapon(hash: string) {
        if (loadout() === null) return;

        setLoadout({
            name: loadout()!.name,
            weapons: loadout()!.weapons.filter((w) => w.hash !== hash),
        });
    }

    function addWeapon(hash: string) {
        if (loadout() === null) {
            setLoadout({
                name: 'New Loadout',
                weapons: [],
            });
        }

        const weapon = weapons_list.find((w) => w.hash === hash);

        if (
            weapon === undefined ||
            loadout()!.weapons.some((w) => w.hash === hash)
        ) {
            return;
        }

        const new_weapon: LoadoutWeapon = {
            name: weapon.name,
            hash: weapon.hash,
            model_hash_key: weapon.model_hash_key,
            group: weapon.group,
            display_name: null,
            starting_ammo_count: null,
            is_vehicle_weapon: null,
            use_racking_animation: null,
            weapon_location: null,
            components: [],
            tint: null,
        };

        setLoadout({
            name: loadout()!.name,
            weapons: [...loadout()!.weapons, new_weapon],
        });
    }

    return (
        <div class='container'>
            <div class='sidebar'>
                <h1>Weapons list</h1>
                <div class='weapons-list-search-container'>
                    <input
                        class='weapons-list-search-input'
                        placeholder='Search...'
                        onChange={(e) => setQuery(e.target.value)}
                        value={query()}
                    />
                    <select onChange={(e) => setSelectedGroup(e.target.value)}>
                        <For each={groups}>
                            {(group) => (
                                <option
                                    value={group}
                                    selected={group === selectedGroup()}
                                >
                                    {group}
                                </option>
                            )}
                        </For>
                    </select>
                </div>
                {filteredWeapons().map((weapon) => {
                    return (
                        <div class='weapon-list-item'>
                            <img
                                class='weapon-list-item-img'
                                src={`/weapons/${weapon.hash}.png`}
                                alt='no image!'
                            />
                            <div class='weapon-list-item-info'>
                                <div class='weapon-list-item-info-text'>
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
                                    <span>
                                        <strong>DLC: </strong>
                                        {weapon.dlc}
                                    </span>
                                    <span>
                                        <strong>Description: </strong>
                                        {weapon.description}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => addWeapon(weapon.hash)}
                                disabled={
                                    (loadout() &&
                                        loadout()!.weapons.some(
                                            (w) => w.hash === weapon.hash,
                                        )) ||
                                    false
                                }
                                class='weapon-list-item-add-btn'
                            >
                                Add
                            </button>
                        </div>
                    );
                })}
            </div>
            <div class='main-content'>
                <h1>Loadout builder</h1>

                <div class='main-content-navbar'>
                    <input
                        class='loadout-name-input'
                        placeholder='Default Loadout'
                        onChange={(e) => setLoadoutName(e.target.value)}
                        disabled={loadout() === null}
                    />
                    <div class='main-content-navbar-buttons'>
                        <button
                            onClick={() => clearLoadout()}
                            disabled={loadout() === null}
                        >
                            Clear loadout
                        </button>
                        <button disabled={true}>Load loadout</button>
                        <button disabled={true}>Export loadout</button>
                    </div>
                </div>

                <Show when={loadout() !== null}>
                    <div class='loadout-weapons-list'>
                        <For each={loadout()?.weapons}>
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
