import express from "express"
const router=express.Router()
import { nanoid } from "nanoid"

const idLength=8


router.get("/", (req, res) => {
    const books = req.app.db.data.books;  // Accede a los datos usando req.app.db.data
    res.send(books);
});

router.get("/:id",async (req,res)=>{
    const book=req.app.db.data.books.find(book=>book.id==req.params.id)
    if(!book)return res.status(404).send("Book dosnt exists")
    return res.status(200).json({book})

})
router.post("/", async (req, res) => {
    try {
        console.log(req.body)
        const book = {
            id: nanoid(idLength),
            ...req.body        
        }
        const {books}=req.app.db.data
        books.push(book)
        await req.app.db.write();

        return res.status(201).json(book);
    } catch (error) {
        return res.status(500).json({error});
    }
})

router.put("/:id",(req,res)=>{
    try{
        const book=req.app.db.data.books.find(book=>book.id==req.params.id)
        if(!book)return res.status(404).send("Book dosnt exists")
        Object.assign(book,req.body);
        req.app.db.write()
        return res.status(200).json({book})
    }catch(error){
        return res.status(500).json({error})
    }
})

router.delete("/:id",(req,res)=>{
    try{
        const index=req.app.db.data.books.findIndex(book=>book.id==req.params.id)
        if(index<0)return res.status(404).send("Book dosnt exists")
        req.app.db.data.books.splice(index,1)
        req.app.db.write()
        return res.status(200).json(req.app.db.data.books)
    }catch(error){
        return res.status(500).send(error)

    }
})

export default router