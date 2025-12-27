import { Component, createMemo, createSignal, For } from 'solid-js';
import type { Loadout, LoadoutWeapon, Weapon } from './consts';
import './app.css';

import weapons_list_json from './weapons.json';

const weapons_list: Weapon[] = weapons_list_json;

const App: Component = () => {
    const [loadout, setLoadout] = createSignal<Loadout | null>(null);
    const [query, setQuery] = createSignal('');
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
            </div>
        </div>
    );
};

export default App;
