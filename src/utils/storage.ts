export type ItemType = {
    name: string
    value: string
    instruction: string[]
}

export type SettingType = {
    textboxId: string
}

export type ExportType = {
    items: ItemType[]
    setting: SettingType
}

const ITEM_STORAGE_KEY = 'AUTO_SEARCH_STORAGE_ITEMS'
const SETTING_STORAGE_KEY = 'AUTO_SEARCH_STORAGE_SETTINGS'

export const setItem = (key: string, value: string) => {
    const item: {
        [key: string]: string
    } = {}
    item[key] = value
    chrome.storage.local.set(item)
}

export const getItem = (key: string): Promise<string> => {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (item) => {
            resolve(item[key])
        })
    })
}

export const getItemList = async (): Promise<ItemType[]> => {
    const itemList = await getItem(ITEM_STORAGE_KEY)
    try {
        const items: ItemType[] = JSON.parse(itemList)
        return items
    } catch (error) {
        console.error(error)
        return []
    }
}

export const setItemList = async (items: ItemType[]) => {
    setItem(ITEM_STORAGE_KEY, JSON.stringify(items))
}

export const getSetting = async (): Promise<SettingType> => {
    const settingStr = await getItem(SETTING_STORAGE_KEY)
    try {
        const setting: SettingType = JSON.parse(settingStr)
        return setting
    } catch (error) {
        console.error(error)
        return { textboxId: '' }
    }
}

export const setSetting = async (setting: SettingType) => {
    const settingStr = JSON.stringify(setting)
    setItem(SETTING_STORAGE_KEY, settingStr)
}

export const addItem = async (item: ItemType) => {
    const itemList = await getItemList()
    itemList.push(item)
    setItem(ITEM_STORAGE_KEY, JSON.stringify(itemList))
}

export const removeItem = async (index: number) => {
    const itemList = await getItemList()
    itemList.splice(index, 1)
    setItem(ITEM_STORAGE_KEY, JSON.stringify(itemList))
}

export async function updateItem(
    index: number,
    updatedItem: ItemType
): Promise<void> {
    const items = await getItemList()
    items[index] = updatedItem
    await setItem(ITEM_STORAGE_KEY, JSON.stringify(items))
}
