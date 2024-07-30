import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

const salt = await bcrypt.genSalt(10)
//cadastro

router.post('/cadastro', async(req, res)=>{
    try{
        const user = req.body
        const hashPassword = await bcrypt.hash(user.password, salt)
        const userDB = await prisma.user.create({
            data:{
            email: user.email,
            name: user.name,
            password: hashPassword,
        },
    })
        res.status(201).json(userDB)
    } catch (error) {
        res.status(500).json({message:"erro no servidor !"})
    }
})

router.post('/login', async (req,res)=>{
    try{
        const userInfo = req.body
        const user = await prisma.user.findUnique({where: {email:userInfo.email}})
        
        //Verifica se o usuário existe
        if(!user){
            return res.status(404).json({message:"Usuário não encontrado"})
        }
        
        //compara a senha do banco com a que o usuario digitou
        const isMatch = await bcrypt.compare(userInfo.password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"Login e/ou senha inválidas"})
        }
        const token = jwt.sign({id:user.id},JWT_SECRET,{expiresIn:'1m'})
        res.status(200).json(token)
    }catch{
        res.status(500).json({message:"erro no servidor !"})
    }


})


export default router

