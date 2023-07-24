import { AuthenticatedRequest } from '@/middlewares';
import e, { Response } from 'express';
import httpStatus from 'http-status';
import bookingService from '@/services/booking-service';

export const getBookings = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req;

    try {
        const bookings = await bookingService.getBookings(userId);
        return res.status(httpStatus.OK).send(bookings);

    } catch (error) {
        if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND)
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const postBooking = async (req: AuthenticatedRequest, res: Response) => {
    const { roomId } = req.body;
    const { userId } = req;

    try {
        const bookingId = await bookingService.postBooking(userId, roomId);
        return res.status(httpStatus.OK).send({ bookingId });

    } catch (error) {
        if (error.name === 'FullRoomError') return res.sendStatus(httpStatus.FORBIDDEN);
        /* if (error.name === 'NotFoundError')  */return res.sendStatus(httpStatus.NOT_FOUND);
        /* return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR); */
    }
}

export const putBooking = async (req: AuthenticatedRequest, res: Response) => {
    const { roomId } = req.body;
    const { bookingId } = req.params;
    const { userId } = req;

    try {
        const room = await bookingService.putBooking(userId, parseInt(bookingId), roomId);
        res.send(room);

    } catch (error) {
        if (error.name === 'FullRoomError') return res.sendStatus(httpStatus.FORBIDDEN);
        /* if (error.name === 'NotFoundError')  */return res.sendStatus(httpStatus.NOT_FOUND);
        /*  return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR); */
    }
}