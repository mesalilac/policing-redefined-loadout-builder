import { createMemo, createSignal, For, Show } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import type { Loadout, LoadoutWeapon, Weapon } from './consts';
import './sidebar.css';

export default (props: {
    weapons_list: Weapon[];
    loadout: Loadout;
    setLoadout: SetStoreFunction<Loadout>;
}) => {
    const [query, setQuery] = createSignal('');
    const [selectedGroup, setSelectedGroup] = createSignal('All');

    const groups = [
        'All',
        ...new Set(
            props.weapons_list.map((w) => w.group).filter((g) => g !== ''),
        ),
    ];

    const filteredWeapons = createMemo(() => {
        const group = selectedGroup();

        return props.weapons_list.filter((w) => {
            const matchesText = w.name
                .toLowerCase()
                .includes(query().toLowerCase());

            const matchesGroup = !group || group === 'All' || w.group === group;

            return matchesText && matchesGroup;
        });
    });

    function addWeapon(hash: string) {
        const weapon = props.weapons_list.find((w) => w.hash === hash);

        if (
            weapon === undefined ||
            props.loadout.weapons.some((w) => w.hash === hash)
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

        props.setLoadout('weapons', (prevWeapons) => [
            ...prevWeapons,
            new_weapon,
        ]);
    }

    return (
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
                            disabled={props.loadout.weapons.some(
                                (w) => w.hash === weapon.hash,
                            )}
                            class='weapon-list-item-add-btn'
                        >
                            Add
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
