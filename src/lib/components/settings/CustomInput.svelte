<script module lang="ts">
    export interface Preset {
        value: string; // e.g. 'bright', 'transparent', 'off'
        label: string; // e.g. 'Bright', 'Transparent', 'Off'
        description?: string; // optional description for the preset
    }
</script>

<script lang="ts" generics="T">
    import type {Snippet} from "svelte";
    import Dropdown from "./Dropdown.svelte";
    import PillButtonGroup, {type PillOption} from "./PillButtons.svelte";

    interface Props {
        value: string; // serialized custom value, a preset value, or '' (unset)
        presets: Preset[]; // which special values this setting supports
        widget?: "dropdown" | "pills"; // default: pills if 2 or fewer presets, dropdown if more than 2
        parse: (value: string) => T; // turn a non-preset string value into a custom value
        fallback: T; // custom value to start from when the current value is a preset
        serialize: (value: T) => string; // turn a custom value back into the string value
        control: Snippet<[T, (next: T) => void]>; // renders the inner custom control
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), presets, widget, parse, fallback, serialize, control}: Props = $props();

    const isPreset = (v: string): boolean => presets.some(s => s.value === v);

    let mode = $derived(isPreset(value) ? value : "custom");

    // Use an iife because svelte linting
    let customValue = $state<T>((() => isPreset(value) ? fallback : parse(value))());

    const shouldUseDropdown = $derived.by(() => {
        if (widget === "dropdown") return true;
        if (widget === "pills") return false;
        return presets.length > 2;
    });

    const pillOptions = $derived<PillOption[]>([
        {label: "Custom", value: "custom", variant: "neutral"},
        ...presets.map(s => ({label: s.label, value: s.value, variant: "accent" as const})),
    ]);

    const dropdownOptions = $derived([
        {name: "Custom", value: "custom"},
        ...presets.map(s => ({name: s.label, value: s.value, description: s.description})),
    ]);


    function onModeChange(next: string) {
        if (next === "custom") value = serialize(customValue);
        else value = next;
    }

    // Track changes coming from the inner custom control
    function onCustomChange(next: T) {
        customValue = next;
        if (mode !== "custom") mode = "custom"; // switch to custom mode if not already there
        value = serialize(customValue);
    }
</script>

<div class="custom-input">
    {#if shouldUseDropdown}
        <Dropdown
            value={mode}
            options={dropdownOptions}
            change={onModeChange}
        />
    {/if}

    <div class="custom-wrapper" class:dimmed={mode !== "custom"}>
        {@render control(customValue, onCustomChange)}
    </div>

    {#if !shouldUseDropdown}
        <PillButtonGroup
            value={mode}
            options={pillOptions}
            onchange={onModeChange}
        />
    {/if}
</div>

<style>
.custom-input {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.custom-wrapper {
    display: inline-flex;
    align-items: center;
    transition: opacity 0.2s ease, filter 0.2s ease;
}

.dimmed {
    opacity: 0.5;
    filter: brightness(0.8);
}
</style>
