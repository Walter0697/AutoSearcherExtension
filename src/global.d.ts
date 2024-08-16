type tabInfo = {
    id: number
    url: string
}

type executeScriptDetails = {
    target: { tabId: number }
    func: (...args: any[]) => void
    args: any[]
}

type queryInfo = {
    currentWindow: boolean
    active: boolean
}

declare namespace chrome {
    export namespace storage {
        export const local: {
            set(items: { [key: string]: any }, callback?: () => void): void
            get(
                keys: string | string[] | Object | null,
                callback: (items: { [key: string]: any }) => void
            ): void
        }
    }
    export namespace scripting {
        export function executeScript(details: executeScriptDetails): void
    }
    export namespace tabs {
        export function query(
            queryInfo: queryInfo,
            callback: (tabs: tabInfo[]) => void
        ): void
    }
}

type ExtendedEventInit = {
    bubbles?: boolean
    cancelable?: boolean
    composed?: boolean
    target?: EventTarget
}

interface Event {
    constructor(type: string, eventInitDict?: ExtendedEventInit)
    simulated?: boolean
}

interface HTMLInputElement {
    _valueTracker?: {
        setValue: (value: string) => void
    }
}
