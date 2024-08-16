import { useEffect, useState } from 'react'
import { Autocomplete, TextField, Grid } from '@mui/material'
import { getItemList } from '../utils/storage'

type SelectBoxProps = {
    setSearchWord: (value: string | undefined) => void
}

type AutoCompleteOption = {
    label: string
    value: string
}

function SelectBox({ setSearchWord }: SelectBoxProps) {
    const [currentSelected, setCurrentSelected] = useState<
        AutoCompleteOption | undefined
    >(undefined)
    const [options, setOptions] = useState<AutoCompleteOption[]>([])

    const getItem = async () => {
        const itemList = await getItemList()
        setOptions(
            itemList.map((item) => {
                return {
                    label: item.name,
                    value: item.name,
                }
            })
        )
    }

    useEffect(() => {
        getItem()
    }, [])

    return (
        <Grid item xs={12}>
            <Autocomplete
                value={currentSelected}
                options={options}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={'Please Select'}
                        variant={'outlined'}
                        fullWidth
                    />
                )}
                onInputChange={(_, newInputValue) => {
                    setSearchWord(newInputValue)
                }}
                onChange={(_, value) => {
                    setCurrentSelected(value as AutoCompleteOption)
                    setSearchWord(value?.value)
                }}
            />
        </Grid>
    )
}

export default SelectBox
