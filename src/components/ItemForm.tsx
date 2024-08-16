import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    TextField,
    Grid,
    styled,
} from '@mui/material'
import { IoIosAdd, IoIosTrash, IoIosCreate } from 'react-icons/io'
import {
    ItemType,
    getItemList,
    addItem,
    removeItem,
    updateItem,
} from '../utils/storage'

const StyledDialog = styled(Dialog)(() => ({
    '& .MuiDialog-paper': {
        width: '80vw',
        maxWidth: '600px',
        minHeight: '60vh',
    },
}))

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(3),
}))

type ItemFormProps = {
    open: boolean
    onClose: () => void
    onItemsChange: () => void
}

type EditingItemType = ItemType & { index: number }

function ItemForm({ open, onClose, onItemsChange }: ItemFormProps) {
    const [items, setItems] = useState<ItemType[]>([])
    const [addItemFormOpen, setAddItemFormOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<EditingItemType | null>(null)

    const fetchItems = async () => {
        const fetchedItems = await getItemList()
        setItems(fetchedItems)
    }

    useEffect(() => {
        fetchItems()
    }, [open])

    useEffect(() => {
        if (open) {
            setAddItemFormOpen(false)
            setEditingItem(null)
        }
    }, [open])

    const handleDelete = async (index: number) => {
        await removeItem(index)
        await fetchItems()
        onItemsChange()
    }

    const handleAddItem = async (newItem: ItemType) => {
        if (items.some((item) => item.name === newItem.name)) {
            alert(
                'An item with this name already exists. Please choose a different name.'
            )
            return
        }
        await addItem(newItem)
        await fetchItems()
        setAddItemFormOpen(false)
        onItemsChange()
    }

    const handleEditItem = async (updatedItem: ItemType, index: number) => {
        if (
            items.some(
                (item, i) => i !== index && item.name === updatedItem.name
            )
        ) {
            alert(
                'An item with this name already exists. Please choose a different name.'
            )
            return
        }
        await updateItem(index, updatedItem)
        await fetchItems()
        setEditingItem(null)
        onItemsChange()
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Items</DialogTitle>
            <DialogContent>
                <List>
                    {items.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={item.name} />
                            <IconButton
                                onClick={() =>
                                    setEditingItem({ ...item, index })
                                }
                                color="primary"
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                <IoIosCreate />
                            </IconButton>
                            <IconButton
                                onClick={() => handleDelete(index)}
                                color="error"
                                size="small"
                            >
                                <IoIosTrash />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <Button
                    onClick={() => setAddItemFormOpen(true)}
                    variant="contained"
                    startIcon={<IoIosAdd />}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Add New Item
                </Button>
            </DialogContent>
            <AddItemForm
                open={addItemFormOpen || editingItem !== null}
                onClose={() => {
                    setAddItemFormOpen(false)
                    setEditingItem(null)
                }}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                editingItem={editingItem}
            />
        </Dialog>
    )
}

type AddItemFormProps = {
    open: boolean
    onClose: () => void
    onAddItem: (item: ItemType) => void
    onEditItem: (item: ItemType, index: number) => void
    editingItem: EditingItemType | null
}

function AddItemForm({
    open,
    onClose,
    onAddItem,
    onEditItem,
    editingItem,
}: AddItemFormProps) {
    const [newItem, setNewItem] = useState<ItemType>({
        name: '',
        value: '',
        instruction: [],
    })

    useEffect(() => {
        if (editingItem) {
            setNewItem({ ...editingItem })
        } else {
            setNewItem({ name: '', value: '', instruction: [] })
        }
    }, [editingItem])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewItem((prev) => ({ ...prev, [name]: value }))
    }

    const handleInstructionChange = (index: number, value: string) => {
        setNewItem((prev) => ({
            ...prev,
            instruction: prev.instruction.map((inst, i) =>
                i === index ? value : inst
            ),
        }))
    }

    const addInstruction = () => {
        setNewItem((prev) => ({
            ...prev,
            instruction: [...prev.instruction, ''],
        }))
    }

    const removeInstruction = (index: number) => {
        setNewItem((prev) => ({
            ...prev,
            instruction: prev.instruction.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (editingItem) {
            onEditItem(newItem, editingItem.index)
        } else {
            onAddItem(newItem)
        }
        setNewItem({ name: '', value: '', instruction: [] })
        onClose()
    }

    return (
        <StyledDialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
                {editingItem ? 'Edit Item' : 'Add New Item'}
            </DialogTitle>
            <StyledDialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} pt={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={newItem.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Value"
                                name="value"
                                value={newItem.value}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <List>
                                {newItem.instruction.map((inst, index) => (
                                    <ListItem key={index} disableGutters>
                                        <TextField
                                            fullWidth
                                            label={`Instruction ${index + 1}`}
                                            value={inst}
                                            onChange={(e) =>
                                                handleInstructionChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            margin="dense"
                                        />
                                        <IconButton
                                            onClick={() =>
                                                removeInstruction(index)
                                            }
                                            color="error"
                                            size="small"
                                        >
                                            <IoIosTrash />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                onClick={addInstruction}
                                variant="contained"
                                startIcon={<IoIosAdd />}
                                fullWidth
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Add Instruction
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                {editingItem ? 'Update Item' : 'Add Item'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </StyledDialogContent>
        </StyledDialog>
    )
}

export default ItemForm
