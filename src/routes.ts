import express from 'express';
import ServicesController from './controllers/ServicesController';
import ConnectionsController from './controllers/ConnectionsController';
import Ok from './controllers/LoginController';
import Logins from './controllers/LoginController';
import Costumer from './controllers/CostumerController';

import { auth } from './middlewares/Auth';

const routes = express.Router();

const servicesController = new ServicesController();
const connectionsController = new ConnectionsController();
const ok = new Ok();
const logins = new Logins();
const costumer = new Costumer();


routes.post('/classes', servicesController.create);
routes.get('/classes', servicesController.index);
routes.get('/list', servicesController.list);
routes.get('/listId', servicesController.listId);

routes.post('/costumer', costumer.create);
routes.get('/costumer', costumer.index);

routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);

routes.post('/login', logins.create);
routes.get('/login', logins.index);

routes.post('/authentication', logins.authentication);
routes.use(auth);
routes.get('/authentication', logins.index);


routes.get('/ok', ok.index);

export default routes;