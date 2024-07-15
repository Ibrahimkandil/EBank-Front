export class Compte_Bancaire {
  id?: number;
  accountNumber: string;
  balance: number;
  opening_date: Date;
  account_type: string;
  closing_date: Date;
  interest_rate: number;
  client_id?: number;
}
