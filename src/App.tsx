import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import './App.css'

import TopButtonList from './components/TopButtonList'
import SearchBar from './components/SearchBar'
import DisplayList from './components/DisplayList'
import { getItemList, ItemType, getSetting } from './utils/storage'

function App() {
    const [items, setItems] = useState<ItemType[]>([])
    const [selectedItem, setSelectedItem] = useState<ItemType | null>(null)
    const [textboxId, setTextboxId] = useState<string>('')

    const fetchItems = async () => {
        const fetchedItems = await getItemList()
        setItems(fetchedItems)
    }

    const fetchSetting = async () => {
        const setting = await getSetting()
        setTextboxId(setting.textboxId)
    }

    useEffect(() => {
        fetchItems()
        fetchSetting()
    }, [])

    return (
        <Grid container spacing={2}>
            <TopButtonList
                onItemsChange={fetchItems}
                onSettingChange={() => {
                    fetchSetting()
                    fetchItems()
                }}
            />
            <SearchBar items={items} onSelectItem={setSelectedItem} />
            <DisplayList selectedItem={selectedItem} textboxId={textboxId} />
        </Grid>
    )
}

export default App
