<script lang="ts">
    import type {HexColor} from "$lib/utils/colors";
    import Color from "./Color.svelte";
    import Dropdown from "./Dropdown.svelte";
    import PillButtonGroup, {type PillOption} from "./PillButtons.svelte";

    export interface Preset {
        value: string; // e.g. 'bright', 'cell-foreground', 'cell-background'
        label: string; // e.g. 'Bright', 'Cell FG', 'Cell BG'
        description?: string; // optional description for the preset
    }

    interface Props {
        value: string; // hex color, special string, or '' (unset)
        presets: Preset[]; // which special values this setting supports
        default?: HexColor; // passed through to Color for reset
        widget?: "dropdown" | "pills"; // default: pills if 2 or fewer presets, dropdown if more than 2
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), presets: specials, default: defaultValue, widget}: Props = $props();

    const isPreset = (v: string): boolean => specials.some(s => s.value === v);

    let mode = $derived(isPreset(value) ? value : "custom");

    // Use an iife because svelte linting
    let customColor = $state<HexColor>((() => isPreset(value) ? defaultValue ?? "#ffffff" : value as HexColor)());

    const shouldUseDropdown = $derived.by(() => {
        if (widget === "dropdown") return true;
        if (widget === "pills") return false;
        return specials.length > 2;
    });

    const pillOptions = $derived<PillOption[]>([
        {label: "Custom", value: "custom", variant: "neutral"},
        ...specials.map(s => ({label: s.label, value: s.value, variant: "accent" as const})),
    ]);

    const dropdownOptions = $derived([
        {name: "Custom", value: "custom"},
        ...specials.map(s => ({name: s.label, value: s.value, description: s.description})),
    ]);


    function onModeChange(next: string) {
        if (next === "custom") value = customColor;
        else value = next;
    }

    // Track hex changes from the color picker
    function onColorChange(hex: HexColor) {
        customColor = hex;
        if (mode !== "custom") mode = "custom"; // switch to custom mode if not already there
        value = customColor;
    }
</script>

<div class="custom-color">
    {#if shouldUseDropdown}
        <Dropdown
            value={mode}
            options={dropdownOptions}
            change={onModeChange}
        />
    {/if}

    <div class="custom-wrapper" class:dimmed={mode !== "custom"}>
        <Color
            bind:value={() => customColor, onColorChange} // TODO: use functional binds like this more often instead of onchange
            {defaultValue}
        />
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
.custom-color {
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
