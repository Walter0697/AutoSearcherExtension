import { Grid, Paper, Typography, Button, IconButton } from '@mui/material'
import { IoIosSearch } from 'react-icons/io'
import { FiCopy } from 'react-icons/fi'
import { ItemType } from '../utils/storage'

type DisplayListProps = {
    selectedItem: ItemType | null
    textboxId: string
}

function DisplayList({ selectedItem, textboxId }: DisplayListProps) {
    const handleSearch = () => {
        if (!selectedItem) return

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                args: [
                    {
                        textboxId: textboxId,
                        value: selectedItem.value,
                    },
                ],
                func: (args) => {
                    function setNativeValue(
                        element: HTMLInputElement,
                        value: string
                    ): void {
                        let lastValue = element.value
                        element.value = value
                        const event = new InputEvent('input', {
                            bubbles: true,
                            inputType: 'insertText',
                        }) as InputEvent & { simulated: boolean }
                        event.simulated = true
                        let tracker = element._valueTracker
                        if (tracker) {
                            tracker.setValue(lastValue)
                        }
                        element.dispatchEvent(event)
                    }

                    const searchBox = document.querySelector(args.textboxId)
                    if (searchBox) {
                        setNativeValue(
                            searchBox as HTMLInputElement,
                            args.value
                        )
                    }
                },
            })
        })
    }

    const handleCopyInstruction = (instruction: string) => {
        navigator.clipboard.writeText(instruction)
    }

    return (
        <>
            {selectedItem && (
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Grid container spacing={1}>
                            <Grid
                                item
                                xs={12}
                                display={'flex'}
                                justifyContent={'flex-start'}
                            >
                                <Typography variant={'h6'}>
                                    {selectedItem.name}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                display={'flex'}
                                justifyContent={'flex-start'}
                                alignItems={'center'}
                            >
                                <Typography>{selectedItem.value}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<IoIosSearch />}
                                    onClick={handleSearch}
                                >
                                    Fill
                                </Button>
                            </Grid>
                            {selectedItem.instruction.map((inst, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    key={index}
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                >
                                    <Typography>- {inst}</Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleCopyInstruction(inst)
                                        }
                                        aria-label="copy instruction"
                                    >
                                        <FiCopy />
                                    </IconButton>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            )}
        </>
    )
}

export default DisplayList
