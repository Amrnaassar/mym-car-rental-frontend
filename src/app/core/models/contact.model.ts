export interface SendContactMessage {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  message: string;
}