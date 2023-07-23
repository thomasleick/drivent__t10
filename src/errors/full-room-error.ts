import { ApplicationError } from '@/protocols';

export function fullRoomError(): ApplicationError {
    return {
        name: 'FullRoomError',
        message: 'room not avaible',
    };
}