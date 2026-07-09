import {registry, type SettingsSchema} from "./registry";


type AsyncInitializer = (registry: SettingsSchema) => Promise<void>;

const asyncInitializers: AsyncInitializer[] = [
    // Font list... web: skip or no-op; desktop: shell out to `ghostty +list-fonts`
    async (_: SettingsSchema) => {
        // The following TODO was written by a clanker.
        // TODO: implement this, ideally by shelling out to `ghostty +list-fonts`
        // and parsing the output, which would ensure the list is accurate and
        // includes any custom fonts the user has installed. This is a bit more
        // complex than the theme enrichment because it involves running a child
        // process and handling its output, but it would provide a much better
        // user experience. For now, we can leave this as a no-op or populate
        // it with a static list of common fonts as a placeholder.
    },
];

export async function runAsyncInitializers() {
    await Promise.allSettled(asyncInitializers.map(fn => fn(registry)));
}


// TODO: this belongs elsewhere surely
const getOS = () => {
    if (typeof navigator === "undefined") return "other";
    const platform = navigator.userAgent?.toLowerCase();
    if (platform.includes("linux")) return "linux";
    if (platform.includes("mac")) return "macos";
    return "other";
};

type Initializer = (registry: SettingsSchema) => void;

const syncInitializers: Initializer[] = [
    (_: SettingsSchema) => {
        // Leaving this here as an example for the future
        // Apparently Ghostty now sets this to "true" for both mac and linux
        // reg.copyOnSelect.default = getOS() === "linux" ? "true" : "false";
    },

    (reg: SettingsSchema) => reg.quitAfterLastWindowClosed.default = getOS() !== "macos",
];

export function runSyncInitializers() {
    syncInitializers.map(fn => fn(registry));
}


export async function runInitializers() {
    runSyncInitializers();
    if (typeof window !== "undefined") await runAsyncInitializers();
}