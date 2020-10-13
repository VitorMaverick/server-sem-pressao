import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHoutToMinutes';

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
  async listSchedules(request: Request, response: Response) {
    
    try{
      const [userId] = await db('users').select('id').from('users');
      
      const [services] = await db('services')
      .select('id').from('services')    
      .where('user_id', userId.id );
      
      console.log(userId.id);

      const schedules = await db('class_schedule')
      .select('*').from('schedule')
      .where('user_id', services.id );
  
        return response.json(schedules);
    } catch (err) {
      

      return response.status(400).json({
        error: 'Unexpected error, login não cadastrado '
      })
    }
  }
  async list(req: Request, res: Response) {
    
    
    var services:any = await db('users')
     .select('*')
     .from('users')
    
    
    
     

     const query = services.map(async (item:any) => {
      item.schedule = await db('schedule').select('*').from('schedule').where('user_id', item.id).orderBy(item.id)  
     });
     const query1 = services.map(async (item:any) => {
      item.services = await db('services').select('*').from('services').where('user_id', item.id).orderBy(item.id)  
     });

   await Promise.all(query1)
     .then(() => res.json(services))
     .catch((err) => console.log(err));
 }
 async listId(req: Request, res: Response) {
  const filters = req.query;
  console.log(filters.id as string);
  
  

   const [select] = await db('users')
          .select('*')
          .from('users')
          .where('login_id', filters.id as string);
         

    res.json(select);
  
}
   
  async index(request: Request, response: Response) {
    const filters = request.query;

    const subject = filters.subject as string;
    const time = filters.time as string;
    const week_day = filters.week_day as string;

    if (!filters.subject || !filters.week_day || !filters.time) {
      return response.status(400).json({
        error: 'Missing filters to search classes'
      });
    }

    const timeInMinutes = convertHourToMinutes(time);

    console.log(timeInMinutes);
    

    const users = await db('users')
      .whereExists(function() {
        this.select('schedule.*')
          .from('schedule')
          .whereRaw('`schedule`.`user_id` = `users`.`id`')
          .whereRaw('`schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`schedule`.`to` > ??', [timeInMinutes])
      })
      .whereExists(function() {
        this.select('services.*')
          .from('services')
          .whereRaw('`services`.`user_id` = `users`.`id`')
          .where('subject', subject)
      })
      .select('users.*')
    

      const query = users.map(async (item:any) => {
        item.schedule = await db('schedule').select('*').from('schedule').where('user_id', item.id).orderBy(item.id)
       });
       const query1 = users.map(async (item:any) => {
        item.services = await db('services').select('*').from('services').where('user_id', item.id).orderBy(item.id)
       });
  
     await Promise.all(query1)
       .then(() => response.json(users))
       .catch((err) => console.log(err));

      
  }

  async create(request: Request, response: Response) {
    const {
      
      name,
      avatar,
      whatsapp,
      bio,
      login_id,
      service,
      schedule
    } = request.body;

    const [select] = await db('users')
            .select('*')
            .from('users')
            .where('login_id', login_id);
           
    
    
       
    if(select == undefined){
      const trx = await db.transaction();
      console.log('criou novo usurio');
      
      
      try {
        const insertedUsersIds = await trx('users').insert({
          name,
          avatar,
          whatsapp,
          bio,
          login_id
        });
  
        const user_id = insertedUsersIds[0];
        console.log(user_id);
        

        const Service = service.map((item: ISservice) => {
          return {
            user_id,
            subject: item.subject,
            cost: item.cost,
          };
        });
        console.log(Service);
        
  
        await trx('services').insert(Service);
  
        
  
        const Schedule = schedule.map((item: ISchedule) => {
          return {
            user_id,
            week_day: item.week_day,
            from: convertHourToMinutes(item.from),
            to: convertHourToMinutes(item.to),
          };
        });
        
        
  
        await trx('schedule').insert(Schedule);

        console.log(Schedule);
  
        await trx.commit();
  
        return response.status(201).send();
      } catch (err) {
        await trx.rollback();
  
        return response.status(400).json({
          error: 'Unexpected error while creating new class'
        })
      }
    }
    const id = select.id;    
    const trx = await db.transaction();
      
    try {
      const insertedUsersIds = await trx('users').where({id: id}).update({
        name: name,
        avatar: avatar,
        whatsapp: whatsapp,
        bio: bio,
        
      });

      console.log(id);
      

      const Service = service.map((item: ISservice) => {
        return {
          user_id: id,
          subject: item.subject,
          cost: item.cost,
        };
      });
      await trx('services').where({user_id: id}).delete();
      await trx('services').insert(Service);

      

      const Schedule = schedule.map((item: ISchedule) => {
      
        return {
          user_id: id,
          week_day: item.week_day,
          from: convertHourToMinutes(item.from),
          to: convertHourToMinutes(item.to),
        };
      });
      console.log( id);
      
      await trx('schedule').where({user_id: id}).delete();
      await trx('schedule').insert(Schedule);

      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while updating new class'
      })
    }  

    
  }
}
