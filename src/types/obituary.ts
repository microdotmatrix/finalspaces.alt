export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  location?: string;
}

export interface ServiceDetails {
  type: string;
  date?: Date;
  time?: string;
  location?: string;
  address?: string;
  officiant?: string;
}

export interface ObituaryFormData {
  // Personal Information
  fullName: string;
  nickname?: string;
  age?: number;
  dateOfBirth?: Date;
  dateOfDeath?: Date;
  placeOfBirth?: string;
  placeOfDeath?: string;
  causeOfDeath?: string;

  // Biographical Information
  biography: string;
  education?: string;
  career?: string;
  militaryService?: string;
  hobbies?: string;
  achievements?: string;
  personalityTraits?: string;

  // Family Information
  survivedBy: FamilyMember[];
  predeceased: FamilyMember[];

  // Service Information
  services: ServiceDetails[];

  // Additional Information
  charityDonations?: string;
  specialRequests?: string;
  photoDescription?: string;
}
