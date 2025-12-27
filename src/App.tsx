import { Component, createSignal } from 'solid-js';
import type { Loadout, Weapon } from './consts';
import './app.css';

import weapons_list_json from './weapons.json';

const weapons_list = weapons_list_json as Weapon[];

const App: Component = () => {
    const [loadout, setLoadout] = createSignal<Loadout | null>(null);

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
            weapons: [...loadout()!.weapons, new_weapon],
        });
    }

    return (
        <div class='container'>
            <div class='sidebar'>
                <h1>Weapons list</h1>
                {weapons_list.map((weapon) => {
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
