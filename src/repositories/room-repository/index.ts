import { prisma } from '@/config';

const deleteRoom = async (roomId: number) => {
    return prisma.room.delete({
        where: {
            id: roomId,
        },
    });
}

const findRoomById = async (roomId: number) => {
    return prisma.room.findUnique({
        where: { id: roomId },
    });
}

const roomRepository = {
    deleteRoom,
    findRoomById,
};

export default roomRepository;