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
    parse={(v: string) => integer ? parseInt(v, 10) : parseFloat(v)}
    fallback={0}
    serialize={(v: number) => v.toString()}
>
    {#snippet control(customNumber: number, onNumberChange)}
        <Number bind:value={() => customNumber, onNumberChange} {min} {max} {step} {size} {placeholder} {integer} />
    {/snippet}
</CustomInput>
