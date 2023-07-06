import { Request, Response } from 'express';
import httpStatus from 'http-status';
import eventsService from '@/services/events-service';

export const getBlah = async (_req: Request, res: Response) => {
    try {
        return res.status(httpStatus.OK).send();
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send({});
    }

}