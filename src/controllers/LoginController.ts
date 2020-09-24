import { Request, Response } from 'express';
import db from '../database/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';

function generateToken(params = {}){
    return jwt.sign(params,authConfig.secret, { expiresIn: 86400, });
}

export default class LoginController {
    async authentication(request: Request, response: Response){
        const { email, password } = request.body;
        
        const [select] = await db('logins')
            .select('*')
            .from('logins')
            .where('email', email)
        const {id} =  select;
        console.log(id);
          


        if(select == undefined){
            return response.status(400).json({error: "Resgistration Falied"});
        }
        

        const autentica = await bcrypt.compare(password, select.password);
        
        if(!autentica){
            return response.status(400).json({error: "password Falied"});
        }

        select.password = undefined; 

        
        return response.json({
            email: select.email,
            id: select.id,
            token: generateToken({ id: select.id}),
        });
    }
    async index(request: Request, response: Response) {
        const  login  = await db('logins').select('logins.*');
        

        return response.json(login);
      }
    async create(request: Request, response: Response) {
        
        const { 
            email,
            password,
            
            } = request.body;
            
        const test = await db('logins').select('email')
        .from('logins')
        .where('email', email);
        console.log(test[0]);
        console.log({email});
        
        if(test[0] != undefined){
            console.log('Email já cadastrado');
            return response.status(400).json({error: "Email já cadastrado"});
        }
        try{
            
            const hash = await bcrypt.hash( password , 10); 
            const selectId = await db('logins').insert({
                email,
                password: hash,
            });
            const login_id = selectId[0];
           

            return response.status(201).json({email, password, token: generateToken({ id: selectId}), userId: login_id} );
           
            
        }catch(er){
            console.log('erro: ', er);
        }
        
    }
}