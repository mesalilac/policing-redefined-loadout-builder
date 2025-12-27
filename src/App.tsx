import { Component, createSignal } from 'solid-js';
import type { Loadout, Weapon } from './consts';
import './app.css';

import weapons_list_json from './weapons.json';

const weapons_list = weapons_list_json as Weapon[];

const App: Component = () => {
    // const [loadout, setLoadout] = createSignal<Loadout | null>(null);

    function addWeapon(hash: string) {
        console.log(hash);
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
