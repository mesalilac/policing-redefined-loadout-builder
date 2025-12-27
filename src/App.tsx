import { Component, createSignal } from 'solid-js';
import type { Loadout, Weapon } from './consts';
import './app.css';

import weapons_list_json from './weapons.json';

const weapons_list = weapons_list_json as Weapon[];

const App: Component = () => {
    // const [loadout, setLoadout] = createSignal<Loadout | null>(null);

    return (
        <div class='container'>
            <div class='sidebar'>
                <h1>Weapons list</h1>
                {weapons_list.map((weapon) => {
                    return <div class='weapon-list-item'>{weapon.name}</div>;
                })}
            </div>
            <div class='main-content'>
                <h1>Loadout builder</h1>
            </div>
        </div>
    );
};

export default App;
