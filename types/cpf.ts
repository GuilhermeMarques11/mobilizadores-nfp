export interface ProfileRelation {
  id: string;
  full_name: string | null;
}

export interface CpfType {
  cpf: string;
  id: string;
  created_at: Date;
  cpf_status: string;
  user_id: string;
  profiles?: ProfileRelation | ProfileRelation[] | null;
}
