// Les 3 catégories possibles — pas autre chose !
export type Category = "work" | "personal" | "ideas";

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  category: Category; // ← nouveau champ
  imageURL?: string; // ← optionnel (photo ou pas)
}

export type NewNote = Omit<Note, "id">;
