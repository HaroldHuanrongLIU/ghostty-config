<script lang="ts">
    import CustomInput, {type Preset} from "./CustomInput.svelte";
    import Duration from "./Duration.svelte";

    interface Props {
        value: string; // duration string, special string, or '' (unset)
        presets: Preset[]; // which special values this setting supports
        nullable?: boolean; // if true, empty custom input is valid (means "unset")
        placeholder?: string; // overrides the inner Duration placeholder
        widget?: "dropdown" | "pills"; // default: pills if 2 or fewer presets, dropdown if more than 2
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), presets, nullable, placeholder, widget}: Props = $props();
</script>

<CustomInput
    bind:value
    {presets}
    {widget}
>
    {#snippet control(customDuration: string, setCustom: (next: string) => void)}
        <Duration bind:value={() => customDuration, setCustom} {nullable} {placeholder} />
    {/snippet}
</CustomInput>
