import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketTypes, getTicketsByUserId, postTicket } from '@/controllers';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTicketTypes)
    .get('/', getTicketsByUserId)
    .post('/', validateBody(createTicketSchema), postTicket)


export { ticketsRouter };
