import type { Contact, NewContact } from "./types/contact";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";

export function ContactsApp() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData: Contact[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Contact,
      );
      setContacts(contactsData);
    });
    return () => unsubscribe();
  }, []);

  async function addContact(): Promise<void> {
    if (!name) return;
    const newContact: NewContact = {
      name,
      email,
      phone,
      createdAt: new Date(),
    };
    await addDoc(collection(db, "contacts"), newContact);
    setName("");
    setEmail("");
    setPhone("");
  }

  async function deleteContact(id: string): Promise<void> {
    await deleteDoc(doc(db, "contacts", id));
  }

  async function updateContact(
    id: string,
    data: Partial<Contact>,
  ): Promise<void> {
    await updateDoc(doc(db, "contacts", id), data);
  }

  return (
    <div>
      <h1>Contacts</h1>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={addContact}>Add</button>
      {contacts.map((contact) => (
        <div key={contact.id}>
          <p>{contact.name}</p>
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
          <button onClick={() => deleteContact(contact.id)}>Delete</button>
          <button onClick={() => deleteContact(contact.id)}>Delete</button>
          <button
            onClick={() => {
              const newName = prompt("Nouveau nom ?");
              if (newName) updateContact(contact.id, { name: newName });
            }}
          >
            Modifier
          </button>
        </div>
      ))}
    </div>
  );
}
