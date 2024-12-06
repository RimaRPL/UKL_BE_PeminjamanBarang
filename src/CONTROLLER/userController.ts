import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "minimal" })

/** Create */
const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const {username, email, password} = req.body

        const findEmail = await prisma.user.findFirst({
            where: { email }
        })
        
        if(findEmail) {
            res.status(400).json({
                message: `Email sudah digunakan`
            })
            return
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: `Member`
            }
        })

        res.status(200).json({
            message: `User telah dibuat`,
            data: newUser
        })
        
        return

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

/** Read */
const readUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search?.toString() || null;

        const allData = await prisma.user.findMany({
            where: search
                ? {
                    OR: [{
                            username: { contains: search },
                        },
                        {
                            email: { contains: search },
                        }],
                    }
                : undefined, 
        });

        res.status(200).json({
            message: `User telah ditampilkan`,
            data: allData,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
};

/** Update */
const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {

        const id = req.params.id

        const findUser = await prisma.user
            .findFirst({
                where: { id: Number(id) }
            })

        if (!findUser) {
            return res.status(200)
                .json({
                    message: `User tidak ditemukan`
                })
        }

        const {
             username, password, role
        } = req.body

        const saveUser = await prisma.user
            .update({
                where: { id: Number(id) },
                data: {
                    username: username ? username : findUser.username,
                    password: password ? await bcrypt.hash(password, 12) : findUser.password,
                    role: role ? role : findUser.role
                }
            })

        return res.status(200)
            .json({
                message: `User telah diperbarui`,
                data: saveUser
            })
    } catch (error) {
        console.log(error)
        return res.status(500)
            .json(error)
    }
}

/** Delete */
const deleteUser = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        
        const id = req.params.id

        const findUser = await prisma.user
            .findFirst({
                where: {id: Number(id)}
            })

        if (!findUser){
            return res.status(200)
            .json({
                message: `User tidak ditemukan`
            })
        }

    
        const saveUser= await prisma.user
            .delete({ 
                where: {id: Number(id)}
            })

        return res.status(200)
            .json({
                message: `User telah dihapus`,
                data: saveUser
        })
    } catch (error) {
        console.log(error)
        res.status(500)
            .json(error)
    }
}

const authentication = async (req: Request, res: Response) : Promise<any> => {
    try {
        const {username, password} = req.body

        /** cek username */
        const findUser = await prisma.user.findFirst({
            where: {username}
        })

        if(!findUser){
            return res.status(400)
            .json({
                message: `Username belum terdaftar`
            })
        }

        const isMatchPassword = await bcrypt.compare(password, findUser.password)

        if(!isMatchPassword){
            return res.status(200)
            .json({
                message: `Password Salah`
            })
        }

        const payload = {
            id: findUser?.id,
            username: findUser?.username,
            email: findUser?.email,
            UserRole: findUser?.role
        }

        const signature = process.env.SECRET || ``

        const token = Jwt.sign(payload, signature)

        return res.status(200).json({
            status: "success",
            message: "Login telah berhasil ",
            token,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

export { createUser, readUser, updateUser, deleteUser, authentication}





