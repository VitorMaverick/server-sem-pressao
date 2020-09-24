import { Request, Response } from 'express';

export default class Ok {
    async index(request: Request, response: Response) {
        try{
            const ok = await response.json('OK')
            console.log('ok');
            return ok;
        }catch(er){
            console.log('erro: ', er);
        }
        
    }
}