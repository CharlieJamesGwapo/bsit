export interface Event {
  id: string;
  name: string;
  category: "academic" | "sports" | "cultural";
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  description: string;
  mechanics: string[];
  image: string;
}

export interface Instructor {
  id: string;
  name: string;
  position: string;
  specialization: string;
  photo: string;
}

export interface CollegeInfo {
  name: string;
  institution: string;
  established: number;
  address: string;
  phone: string;
  website: string;
  vision: string;
  mission: string;
  coreValues: string;
  objectives: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type CountdownStatus = "upcoming" | "happening" | "completed";
