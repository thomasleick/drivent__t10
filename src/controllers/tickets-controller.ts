import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '@/services/tickets-service';

export const getTicketTypes = async (_req: Request, res: Response) => {
    try {
        const types = await ticketsService.getTicketTypes();
        return res.status(httpStatus.OK).send(types);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send([]);
    }
}

export const getTicketsByUserId = async (_req: Request, res: Response) => {
    try {
        const userTickets = await ticketsService.getTicketsByUserId(res.locals.userId);
        return res.status(httpStatus.OK).send(userTickets[0]);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send([]);
    }
}
export const postTicket = async (req: Request, res: Response) => {
    try {
        const newTicket = await ticketsService.createTicket(req.body.ticketTypeId, res.locals.userId);
        return res.status(httpStatus.CREATED).send(newTicket);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send([]);
    }
}
