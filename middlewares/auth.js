import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req,res,next) => { 

    const token = req.headers.authorization

    console.log(token)

    if(!token){
        return res.status(401).json({message:'Acesso negado'})
    }

    try{
        const decoded = jwt.verify(token.replace('Bearer ',''),JWT_SECRET)
        console.log(decoded)
        req.userid = decoded.id
    }catch(error){
        return res.status(401).json({message:'token invalido'})
    }

    next()
}

export default auth