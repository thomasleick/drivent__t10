import { prisma } from '@/config';

async function deleteRoom(roomId: number) {
    return prisma.room.delete({
        where: {
            id: roomId,
        },
    });
}

async function findRoomById(roomId: number) {
    return prisma.room.findUnique({
        where: { id: roomId },
    });
}

const roomRepository = {
    deleteRoom,
    findRoomById,
};

export default roomRepository;