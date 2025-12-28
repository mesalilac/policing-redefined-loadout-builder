import { For } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import type { Loadout, LoadoutWeapon, Weapon } from './consts';
import LoadOut from './loadout';
import './mainContent.css';

export default (props: {
    weapons_list: Weapon[];
    loadout: Loadout;
    setLoadout: SetStoreFunction<Loadout>;
}) => {
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
                        onClick={() => props.setLoadout('weapons', [])}
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
                        <LoadOut
                            weapon={weapon}
                            weapons_list={props.weapons_list}
                            loadout={props.loadout}
                            setLoadout={props.setLoadout}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};
