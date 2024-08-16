import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Grid,
} from '@mui/material'
import {
    getSetting,
    setSetting,
    SettingType,
    ExportType,
    getItemList,
    setItemList,
} from '../utils/storage'

type SettingFormProps = {
    open: boolean
    onClose: () => void
    onSettingChange: () => void
}

function SettingForm({ open, onClose, onSettingChange }: SettingFormProps) {
    const [textboxId, setTextboxId] = useState('')

    useEffect(() => {
        if (open) {
            getSetting().then((setting) => setTextboxId(setting.textboxId))
        }
    }, [open])

    const handleSave = async () => {
        const newSetting: SettingType = { textboxId }
        await setSetting(newSetting)
        onSettingChange()
        onClose()
    }

    const handleExport = async () => {
        const items = await getItemList()
        const setting = await getSetting()
        const exportData: ExportType = { items, setting }
        const jsonString = JSON.stringify(exportData, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'auto_search_settings.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    const importedData: ExportType = JSON.parse(
                        e.target?.result as string
                    )
                    await setItemList(importedData.items)
                    await setSetting(importedData.setting)
                    setTextboxId(importedData.setting.textboxId) // Refresh the textboxId state
                    onSettingChange() // Notify parent component about the change
                    alert('Settings imported successfully!')
                } catch (error) {
                    console.error('Error importing settings:', error)
                    alert(
                        'Error importing settings. Please check the file format.'
                    )
                }
            }
            reader.readAsText(file)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Textbox ID"
                    type="text"
                    fullWidth
                    value={textboxId}
                    onChange={(e) => setTextboxId(e.target.value)}
                />
                <Button
                    onClick={handleSave}
                    color="primary"
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                >
                    Save
                </Button>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Button
                            onClick={handleExport}
                            variant="contained"
                            fullWidth
                        >
                            Export All Settings
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                            id="import-input"
                        />
                        <label htmlFor="import-input">
                            <Button
                                variant="contained"
                                component="span"
                                fullWidth
                            >
                                Import Settings
                            </Button>
                        </label>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default SettingForm
