export type Contact = {
  name: string;
  email: string;
  createdAt: Date;
  id: string;
  phone: string;
};

export type NewContact = Omit<Contact, "id">;
