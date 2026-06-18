<script lang="ts">
    import {dev} from "$app/environment";
    import {error} from "@sveltejs/kit";
    import Group from "$lib/components/settings/Group.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";
    import Dropdown from "$lib/components/settings/Dropdown.svelte";
    import Page from "$lib/views/Page.svelte";
    import {basicOptions, richOptions} from "./dropdown";
    import Checkbox from "$lib/components/settings/Checkbox.svelte";
    import Switch from "$lib/components/settings/Switch.svelte";

    if (!dev) error(404, "Not found");

    interface Values {
        dropdownBasic: string;
        dropdownRich: string;
        booleanCheckbox: boolean;
        booleanSwitch: boolean;
    }

    const values = $state<Values>({
        dropdownBasic: "detect",
        dropdownRich: "nord",
        booleanCheckbox: true,
        booleanSwitch: false
    });
</script>

<Page title="Component Showcase">

    <Group title="Booleans">
        <Item name="Checkbox" note="This is a checkbox.">
            <Checkbox bind:checked={values.booleanCheckbox} />
        </Item>
        <Separator />
        <Item name="Switch" note="This is a switch.">
            <Switch bind:checked={values.booleanSwitch} />
        </Item>
    </Group>

    <Group title="Dropdowns">
         <Item name="Basic" note="Default behavior with string options.">
            <Dropdown bind:value={values.dropdownBasic} options={basicOptions} />
        </Item>
        <Separator />
        <Item name="Structured options" note="Supports labels and separators between logical sections.">
            <Dropdown bind:value={values.dropdownRich} groups={richOptions} searchable allowEmpty placeholder="Select grouped option" />
        </Item>
    </Group>

    <Group title="Live Values" borderless>
        <div class="preview">
            {#each Object.entries(values) as [k, v] (k)}
                <div><span>{k}</span><code>{v || "<empty>"}</code></div>
                <Separator />
            {/each}
        </div>
    </Group>
</Page>

<style>
    .preview {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        background: color-mix(in srgb, var(--bg-level-2) 85%, black);
        border-radius: var(--radius-level-3);
        padding: 12px;
        border: 1px solid var(--border-level-2);
    }

    .preview div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .preview span {
        color: var(--font-color-muted);
        font-size: 0.85rem;
    }

    .preview code {
        background: var(--bg-level-3);
        border: 1px solid var(--border-level-3);
        border-radius: var(--radius-level-5);
        padding: 3px 8px;
    }
</style>
