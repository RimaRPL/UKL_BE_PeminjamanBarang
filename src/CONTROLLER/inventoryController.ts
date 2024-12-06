import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Create */
const createInventory = async (req: Request, res: Response): Promise<any> => {
    try {
        const {name, category, location, quantity} = req.body

        const newData = await prisma.inventory.create({
            data: {
                name: name,
                category: category,
                location: location,
                quantity: quantity,
            }
        })

        res.status(201).json({
            status: 'success',
            message: "Barang berhasil ditambahkan",
            data: newData
        })
    } catch (error) {
        console.log(error)

        res.status(500).json(error)
    }
}

/** Read */
const readInventoryById = async ( req: Request, res: Response) : Promise<any> => {
    try {
        const id = req.params.id

        // Jika ID ada, cari berdasarkan ID, jika tidak tampilkan semua
        const data = id
            ? await prisma.inventory.findUnique({
                where: {
                    id: Number(id),
                },
            })
            : await prisma.inventory.findMany();

        // Jika ID diberikan tapi data tidak ditemukan
        if (id && !data) {
            res.status(404).json({
                message: `Barang dengan ${id} tidak ditemukan`,
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            message: `Barang telah ditampilkan`,
            data: data,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
        
    }
}


/**Update */
const updateInventory = async ( req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const findData = await prisma.inventory.findFirst({
            where: {
                id: Number(id)
            }
        })

        if(!findData){
            res.status(404).json({
                message: `Barang tidak ditemukan`
            })
        }

        const {name, category, location, quantity} = req.body

        const newData = await prisma.inventory.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name ?? findData?.name,
                category: category ?? findData?.category,
                location: location ?? findData?.location,
                quantity: quantity ?? findData?.quantity,
            }
        })

        res.status(200).json({
            status: 'success',
            message: "Barang berhasil diubah",
            data: newData
        })

    } catch (error) {
        console.log(error)

        res.status(500).json(error);
    }
}

/** Delete */
/** Id barang yang bisa dihapus hanya yang belum dipinjam */
const deleteInventory = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const findData = await prisma.inventory.findFirst({
            where: { id: Number(id) }
        })

        if(!findData) {
            res.status(404).json({
                message: `Barang not found`
            })
        }

        await prisma.inventory.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({
            
            message: `Barang telah dihapus`
        })
    } catch (error) {
        console.log(error)

        res.status(500).json(error)
    }
}

export { createInventory, readInventoryById, updateInventory, deleteInventory}