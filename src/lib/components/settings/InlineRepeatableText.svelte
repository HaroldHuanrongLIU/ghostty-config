<script lang="ts">
    interface Props {
        value: string[];
        placeholder?: string;
        size?: number;
        change?: (value: string[]) => void;
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable([]), placeholder = "Add value…", size, change}: Props = $props();

    let draft = $state("");


    // Drag-and-drop reordering state
    let dragIndex: number | null = $state(null);
    let overIndex: number | null = $state(null);

    function onDragStart(e: DragEvent, i: number) {
        dragIndex = i;
        e.dataTransfer!.effectAllowed = "move";
        // Transparent drag image so the row itself shows through
        const ghost = document.createElement("div");
        ghost.style.position = "fixed";
        ghost.style.top = "-9999px";
        document.body.appendChild(ghost);
        e.dataTransfer!.setDragImage(ghost, 0, 0);
        requestAnimationFrame(() => document.body.removeChild(ghost));
    }

    function onDragOver(e: DragEvent, i: number) {
        e.preventDefault();
        e.dataTransfer!.dropEffect = "move";
        overIndex = i;
    }

    function onDrop(e: DragEvent, i: number) {
        e.preventDefault();
        if (dragIndex === null || dragIndex === i) return;
        const next = [...value];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(i, 0, moved);
        value = next;
        change?.(value);
        dragIndex = null;
        overIndex = null;
    }

    function onDragEnd() {
        dragIndex = null;
        overIndex = null;
    }


    // Add/remove items
    function commit() {
        const trimmed = draft.trim();
        if (!trimmed) return;
        value = [...value, trimmed];
        draft = "";
        change?.(value);
    }

    function remove(i: number) {
        value = value.filter((_, idx) => idx !== i);
        change?.(value);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            commit();
        }
    }
</script>

<div class="repeatable">
    {#if value.length > 0}
        <ul class="list">
            {#each value as entry, i (entry + i)}
                <li
                    class="item"
                    class:dragging={dragIndex === i}
                    class:over={overIndex === i && dragIndex !== i}
                    draggable="true"
                    ondragstart={(e) => onDragStart(e, i)}
                    ondragover={(e) => onDragOver(e, i)}
                    ondrop={(e) => onDrop(e, i)}
                    ondragend={onDragEnd}
                >
                    <span class="grip" aria-hidden="true">⠿</span>
                    <span class="entry-text">{entry}</span>
                    <button
                        class="remove"
                        type="button"
                        aria-label="Remove {entry}"
                        onclick={() => remove(i)}
                    >×</button>
                </li>
            {/each}
        </ul>
    {/if}

    <div class="add-row">
        <span class="grip-spacer" aria-hidden="true"></span>
        <input
            bind:value={draft}
            {placeholder}
            style:width={size ? `${size}ch` : undefined}
            onkeydown={handleKeydown}
            onblur={commit}
            onclick={(e) => e.stopPropagation()}
        />
    </div>
</div>

<style>
.repeatable {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 200px;
    max-width: 175px;
    gap: 5px;
}

.list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 175px;
}

.item {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 4px 2px 0;
    max-width: 175px;
    background: var(--bg-level-2);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-level-5);
    transition: background 0.1s, border-color 0.1s, opacity 0.1s;
    cursor: grab;
    user-select: none;
}

.item:active {
    cursor: grabbing;
}

.item.dragging {
    opacity: 0.35;
}

.item.over {
    border-color: rgba(160, 120, 255, 0.55);
    background: var(--bg-level-3, rgba(255,255,255,0.1));
}

.grip {
    opacity: 0.3;
    font-size: 1em;
    line-height: 1;
    padding: 0 2px;
    flex-shrink: 0;
    transition: opacity 0.1s;
    cursor: grab;
}

.item:hover .grip {
    opacity: 0.65;
}

.entry-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9em;
}

.remove {
    flex-shrink: 0;
    background: none;
    border: none;
    color: inherit;
    opacity: 0.35;
    cursor: pointer;
    padding: 0 2px;
    font-size: 1em;
    line-height: 1;
    border-radius: 3px;
    transition: opacity 0.1s, background 0.1s;
}

.remove:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
}

.add-row {
    display: flex;
    align-items: center;
    gap: 5px;
    /* padding: 2px 4px 2px 2px; */
    /* border-radius: var(--radius-level-5, 6px);
    border: 1px solid var(--border-input, rgba(255,255,255,0.12));
    background: var(--bg-level-2, rgba(255,255,255,0.06)); */
}

/* .add-row:focus-within {
    background: var(--bg-input-focus, rgba(255,255,255,0.09));
    outline: var(--border-input-focus, 1px solid rgba(160,120,255,0.55));
} */

/* spacer to align input with entry-text (matching grip width) */
.grip-spacer {
    display: inline-block;
    width: 20px;
    flex-shrink: 0;
}

input {
    background: var(--bg-level-2);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-level-5);
    outline: none;
    color: inherit;
    text-align: right;
    max-width: 175px;
    padding: 0 4px 2px 0;
}

input:focus {
    background:var(--bg-input-focus);
    outline: var(--border-input-focus);
}
</style>
