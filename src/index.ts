import Express from "express"
import UserRoute from "./ROUTER/userRouter"
import InventoryRoute from "./ROUTER/inventoryRouter"
import BorrowRoute from "./ROUTER/borrowRouter"
const app = Express()

app.use(Express.json())
app.use(`/User`, UserRoute)
app.use(`/Inventory`, InventoryRoute)
app.use(`/Borrow`, BorrowRoute)

const PORT = 4000
app.listen(PORT, () => { 
    console.log(`Server peminjaman barang run on port ${PORT}`)
})