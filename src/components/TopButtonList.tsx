import { useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import { IoIosAdd, IoIosSettings } from 'react-icons/io'
import SettingForm from './SettingForm'
import ItemForm from './ItemForm'

type TopButtonListProps = {
    onItemsChange: () => void
    onSettingChange: () => void
}

function TopButtonList({ onItemsChange, onSettingChange }: TopButtonListProps) {
    const [openedForm, setOpenedForm] = useState<'settings' | 'items' | null>(
        null
    )

    return (
        <>
            <Grid item xs={12} display={'flex'} justifyContent={'flex-end'}>
                <IconButton
                    aria-label="add"
                    onClick={() => setOpenedForm('items')}
                >
                    <IoIosAdd />
                </IconButton>
                <IconButton
                    aria-label="settings"
                    onClick={() => setOpenedForm('settings')}
                >
                    <IoIosSettings />
                </IconButton>
            </Grid>
            <SettingForm
                open={openedForm === 'settings'}
                onClose={() => setOpenedForm(null)}
                onSettingChange={onSettingChange}
            />
            <ItemForm
                open={openedForm === 'items'}
                onClose={() => setOpenedForm(null)}
                onItemsChange={onItemsChange}
            />
        </>
    )
}

export default TopButtonList
