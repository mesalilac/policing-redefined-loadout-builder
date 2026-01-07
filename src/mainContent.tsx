import { trackStore } from '@solid-primitives/deep';
import { createMemo, createSignal, For, onMount, Show } from 'solid-js';
import { SetStoreFunction, unwrap } from 'solid-js/store';
import toast from 'solid-toast';
import {
    DEFAULT_LOADOUT_NAME,
    DEFAULT_LOADOUT_WEAPONS,
    type T_Loadout,
    type T_SavedLoadout,
    type T_Weapon,
} from './consts';
import { exportAllLoadouts, exportLoadout } from './exportLoadout';
import Loadout from './loadout';
import './mainContent.css';

const SAVED_LOADOUTS_KEY = 'SavedLoadouts';

export default (props: {
    weapons_list: T_Weapon[];
    loadout: T_Loadout;
    setLoadout: SetStoreFunction<T_Loadout>;
}) => {
    const [xmlOutput, setXmlOutput] = createSignal('');
    const [showXmlOutput, setShowXmlOutput] = createSignal(false);
    const [savedLoadouts, setSavedLoadouts] = createSignal<T_SavedLoadout[]>(
        [],
    );
    const [selectedSavedLoadoutID, setSelectedSavedLoadoutID] =
        createSignal<number>(-1);
    const [originalLoadout, setOriginalLoadout] =
        createSignal<T_Loadout | null>(null);

    const isDirty = createMemo(() => {
        trackStore(props.loadout);
        const original = originalLoadout();

        if (!original) return false;

        return (
            JSON.stringify(unwrap(props.loadout)) !== JSON.stringify(original)
        );
    });

    const loadDefultLoadout = () => {
        props.setLoadout('name', DEFAULT_LOADOUT_NAME);
        props.setLoadout('weapons', DEFAULT_LOADOUT_WEAPONS);
        toast.success('Default loadout loaded');
    };

    const syncSavedLoadouts = () => {
        localStorage.setItem(
            SAVED_LOADOUTS_KEY,
            JSON.stringify(savedLoadouts()),
        );
    };

    onMount(() => {
        loadDefultLoadout();

        const savedLoadouts = localStorage.getItem(SAVED_LOADOUTS_KEY);
        if (savedLoadouts) {
            setSavedLoadouts(JSON.parse(savedLoadouts));
        }
    });

    const saveLoadout = () => {
        if (selectedSavedLoadoutID() !== -1) {
            const newSavedLoadouts = savedLoadouts().map((s) => {
                if (s.id === selectedSavedLoadoutID()) {
                    return {
                        ...s,
                        ...props.loadout,
                    };
                }

                return s;
            });

            setSavedLoadouts(newSavedLoadouts);
            setOriginalLoadout({
                name: props.loadout.name,
                weapons: structuredClone(props.loadout.weapons),
            });
        } else {
            const id = Date.now();

            const newSavedLoadout: T_SavedLoadout = {
                id: id,
                ...props.loadout,
            };

            setSavedLoadouts([...savedLoadouts(), newSavedLoadout]);
            setSelectedSavedLoadoutID(id);
            setOriginalLoadout({
                name: newSavedLoadout.name,
                weapons: newSavedLoadout.weapons,
            });
        }

        syncSavedLoadouts();
    };

    const selectSavedLoadout = (id: number) => {
        setSelectedSavedLoadoutID(id);

        const loadout = savedLoadouts().find((s) => s.id === id);

        if (loadout) {
            props.setLoadout('name', loadout.name);
            props.setLoadout('weapons', structuredClone(loadout.weapons));
            setOriginalLoadout({
                name: loadout.name,
                weapons: loadout.weapons,
            });
        }
    };

    const deleteSavedLoadout = () => {
        const id = selectedSavedLoadoutID();

        // no loadout selected
        if (id === -1) return;

        const targetIndex = savedLoadouts().findIndex((s) => s.id === id);

        const newSavedLoadouts = savedLoadouts().filter((s) => s.id !== id);
        setSavedLoadouts(newSavedLoadouts);

        const prevLoadout = savedLoadouts().find(
            (_, index) => index === targetIndex - 1,
        );

        if (prevLoadout) {
            setSelectedSavedLoadoutID(prevLoadout.id);
        } else {
            setSelectedSavedLoadoutID(-1);
        }

        syncSavedLoadouts();
    };

    const copyToClipboard = async () => {
        if (!xmlOutput()) return;

        const cleanXml = xmlOutput().replace(
            /[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g,
            ' ',
        );

        try {
            await navigator.clipboard.writeText(cleanXml);
        } catch (err) {
            toast.error('Failed to copy: ' + err);
        }
    };

    return (
        <div class='main-content'>
            <div class='main-content-header'>
                <h1>Loadout builder</h1>
                <Show when={isDirty()}>
                    <span class='dirty-state-indicator'>* Unsaved</span>
                </Show>
            </div>

            <div class='main-content-navbar'>
                <input
                    class='loadout-name-input'
                    placeholder='Default Loadout'
                    value={props.loadout.name}
                    onChange={(e) => props.setLoadout('name', e.target.value)}
                />

                <div class='main-content-navbar-saved-loadout-buttons'>
                    <button
                        onClick={() =>
                            selectSavedLoadout(selectedSavedLoadoutID())
                        }
                        disabled={selectedSavedLoadoutID() === -1}
                        title='Reset to currently selected saved loadout'
                    >
                        Reset
                    </button>
                    <select
                        onChange={(e) =>
                            selectSavedLoadout(parseInt(e.target.value) || -1)
                        }
                        title='List of saved loadouts'
                    >
                        <option value={-1}>+ Create New Loadout</option>
                        <For each={savedLoadouts()}>
                            {(savedLoadout) => {
                                const date = new Date(savedLoadout.id);

                                const formattedDate = new Intl.DateTimeFormat(
                                    'en-ZA',
                                    {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                    },
                                ).format(date);

                                return (
                                    <option
                                        value={savedLoadout.id}
                                        selected={
                                            selectedSavedLoadoutID() ===
                                            savedLoadout.id
                                        }
                                    >
                                        {formattedDate} - {savedLoadout.name} (
                                        {savedLoadout.weapons.length})
                                    </option>
                                );
                            }}
                        </For>
                    </select>
                    <button
                        onClick={() => saveLoadout()}
                        title='Saves the current loadout'
                    >
                        Save loadout
                    </button>
                    <button
                        onClick={() => deleteSavedLoadout()}
                        disabled={selectedSavedLoadoutID() === -1}
                        title='Deletes the currently selected saved loadout'
                    >
                        Delete loadout
                    </button>
                </div>
                <div class='main-content-navbar-buttons'>
                    <button
                        onClick={() => {
                            loadDefultLoadout();
                            setSelectedSavedLoadoutID(-1);
                            setOriginalLoadout(null);
                        }}
                        title='Loads the default loadout'
                    >
                        Default loadout
                    </button>
                    <button
                        onClick={() => {
                            loadDefultLoadout();
                            props.setLoadout('weapons', []);
                            setSelectedSavedLoadoutID(-1);
                            setOriginalLoadout(null);
                        }}
                        disabled={props.loadout.weapons.length === 0}
                        title='Clears the current loadout'
                    >
                        Clear loadout
                    </button>
                    <Show when={showXmlOutput()}>
                        <div class='main-content-xml-output-dialog'>
                            <div class='main-content-xml-output-dialog-header'>
                                <h1>XML output</h1>
                                <button onClick={() => copyToClipboard()}>
                                    Copy to clipboard
                                </button>
                            </div>
                            <textarea
                                class='main-content-xml-textarea'
                                value={xmlOutput()}
                                wrap='soft'
                                spellcheck={false}
                            />
                            <button onClick={() => setShowXmlOutput(false)}>
                                Close
                            </button>
                        </div>
                    </Show>
                    <button
                        onClick={() =>
                            exportLoadout({
                                loadout: props.loadout,
                                setXmlOutput,
                                setShowXmlOutput,
                            })
                        }
                        title='Exports the current loadout as XML'
                    >
                        Export loadout
                    </button>
                    <button
                        onClick={() =>
                            exportAllLoadouts({
                                setXmlOutput,
                                setShowXmlOutput,
                                selectedSavedLoadoutID,
                                savedLoadouts,
                            })
                        }
                        title='Exports all saved loadouts as XML (Full file)'
                    >
                        Export all loadouts
                    </button>
                </div>
            </div>

            <div class='loadout-weapons-list'>
                <For each={props.loadout.weapons}>
                    {(weapon, index) => (
                        <Loadout
                            currentIndex={index()}
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
