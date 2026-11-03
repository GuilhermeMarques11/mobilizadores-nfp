export interface UserProps {
  profile: {
    full_name: string;
    email: string;
    role: string;
    status: string;
    city: string;
    id: string;
    created_at: Date;
    phone?: string;
  };
}
