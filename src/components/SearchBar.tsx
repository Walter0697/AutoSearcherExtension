import { Autocomplete, TextField, Grid } from '@mui/material'
import { ItemType } from '../utils/storage'

type SearchBarProps = {
    items: ItemType[]
    onSelectItem: (item: ItemType | null) => void
}

function SearchBar({ items, onSelectItem }: SearchBarProps) {
    const options = items.map((item) => ({
        label: item.name,
        value: item.value,
        item: item,
    }))

    return (
        <Grid item xs={12}>
            <Autocomplete
                options={options}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={'Please Select'}
                        variant={'outlined'}
                        fullWidth
                    />
                )}
                onChange={(_, newValue) => {
                    onSelectItem(newValue ? newValue.item : null)
                }}
            />
        </Grid>
    )
}

export default SearchBar
