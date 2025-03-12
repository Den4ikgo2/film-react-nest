export class CreateTicketDto {
  email: string;
  phone: string;
  tickets: {
    day: string;
    daytime: string;
    film: string;
    price: number;
    row: number;
    seat: number;
    session: string;
    time: string;
  }[];
}
