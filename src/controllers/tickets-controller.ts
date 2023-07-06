import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '@/services/tickets-service';

export const getTicketTypes = async (_req: Request, res: Response) => {
    try {
        const types = ticketsService.getTicketTypes();
        return res.status(httpStatus.OK).send(types);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send({});
    }

}