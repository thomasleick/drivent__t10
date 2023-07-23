import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getEnrollmentByUser, postCreateOrUpdateEnrollment, getAddressFromCEP } from '@/controllers';
import { createEnrollmentSchema } from '@/schemas';
import { getBookings } from '@/controllers/booking-controller';



const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBookings)


export { bookingRouter };
