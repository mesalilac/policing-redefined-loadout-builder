import { Component, createSignal, For, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { T_Loadout, T_LoadoutWeapon, T_Weapon } from './consts';
import { DEFAULT_LOADOUT_NAME } from './consts';
import MainContent from './mainContent';
import Sidebar from './sidebar';
import './app.css';
import weapons_list_json from './weapons.json';

const App: Component = () => {
    const weapons_list: T_Weapon[] = weapons_list_json;

    const [loadout, setLoadout] = createStore<T_Loadout>({
        name: DEFAULT_LOADOUT_NAME,
        weapons: [],
    });

    return (
        <div class='container'>
            <Sidebar
                weapons_list={weapons_list}
                loadout={loadout}
                setLoadout={setLoadout}
            />
            <MainContent
                weapons_list={weapons_list}
                loadout={loadout}
                setLoadout={setLoadout}
            />
        </div>
    );
};

export default App;
