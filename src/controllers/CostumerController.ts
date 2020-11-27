import { Request, Response } from 'express';

import db from '../database/connection';

interface ISchedule {
  week_day: number;
  from: string;
  to: string;
}
interface ISservice {
 
  subject: string,
  cost: number,
}


export default class ClassesController {
   
  async index(request: Request, response: Response) {
    try{
        const costumer = await db('costumer').select('*').from('costumer');
        
        
    
          return response.json(costumer);
      } catch (err) {
        
  
        return response.status(400).json({
          error: 'Unexpected error, login não cadastrado '
        })
      }
      
  }

  async create(request: Request, response: Response) {
    const {
      
      name,
      email,
      whatsapp,
      queixa,
      localDor,
      pacote
    } = request.body;

    const trx = await db.transaction();
          
      try {
        const insertedUsersIds = await trx('costumer').insert({
            name,
            email,
            whatsapp,
            queixa,
            localDor,
            pacote
        });
  
        const user_id = insertedUsersIds[0];
        console.log(user_id);

         await trx.commit();

         return response.status(201).send();
  
    } catch (err) {
        await trx.rollback();
  
        return response.status(400).json({
          error: 'Unexpected error while creating new class'
        })
     
    

    
  }
}
}
