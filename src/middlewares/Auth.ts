import { Request, Response, NextFunction } from 'express';
import db from '../database/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';


export const auth = async (request: Request, response: Response, next: NextFunction) => {
    const authHeader:any = request.headers.authorization;
    
    if(!authHeader){
        return response.status(401).json({message: 'tokes is requised'});
    }
    
    const parts = authHeader.split(' ');
    const [ scheme, token] = parts;
    
    try{
        await jwt.verify(token, authConfig.secret);
        next();
    }catch(error){
        return response.status(401).json({message: 'tokes invalid'}); 
    }
        
}
