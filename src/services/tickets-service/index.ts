import ticketRepository from '@/repositories/ticket-repository';

const ticketsService = {
  async getTicketTypes() {
    const types = await ticketRepository.getTicketTypes();
    return types;
  },
};

export default ticketsService;