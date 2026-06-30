<script lang="ts">
    import type {HexColor} from "$lib/utils/colors";
    import Color from "./Color.svelte";
    import CustomInput, {type Preset} from "./CustomInput.svelte";

    interface Props {
        value: string; // hex color, special string, or '' (unset)
        presets: Preset[]; // which special values this setting supports
        default?: HexColor; // passed through to Color for reset
        widget?: "dropdown" | "pills"; // default: pills if 2 or fewer presets, dropdown if more than 2
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), presets, default: defaultValue, widget}: Props = $props();
</script>

<CustomInput
    bind:value
    {presets}
    {widget}
    parse={(v: string) => v as HexColor}
    fallback={defaultValue ?? "#ffffff"}
    serialize={(v: HexColor) => v}
>
    {#snippet control(customColor: HexColor, onColorChange)}
        <Color bind:value={() => customColor, onColorChange} {defaultValue} />
    {/snippet}
</CustomInput>
