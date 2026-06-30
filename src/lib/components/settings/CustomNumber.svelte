<script lang="ts">
    import CustomInput, {type Preset} from "./CustomInput.svelte";
    import Number from "./Number.svelte";

    interface Props {
        value: string; // number, special string, or '' (unset)
        presets: Preset[]; // which special values this setting supports
        min?: number;
        max?: number;
        step?: number;
        size?: number;
        placeholder?: string;
        integer?: boolean;
        widget?: "dropdown" | "pills"; // default: pills if 2 or fewer presets, dropdown if more than 2
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), presets, min, max, step, size, placeholder, integer, widget}: Props = $props();
</script>

<CustomInput
    bind:value
    {presets}
    {widget}
    customDefault="0"
>
    {#snippet control(customNumber: string, setCustom: (next: string) => void)}
        <Number
            value={customNumber === "" ? undefined : (integer ? parseInt(customNumber, 10) : parseFloat(customNumber))}
            onchange={(n: number | undefined) => setCustom(n === undefined ? "" : n.toString())}
            {min} {max} {step} {size} {placeholder} {integer}
        />
    {/snippet}
</CustomInput>
