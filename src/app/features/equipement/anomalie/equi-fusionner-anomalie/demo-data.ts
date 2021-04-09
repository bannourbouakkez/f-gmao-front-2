
export interface Bank {
  /*
    id: string;
    name: string;
    */
   Name:string;
   CustomerID:string;

  }
  
  
  export interface BankGroup {
    Name: string;
    banks: Bank[];
  }
  
  
  /** list of banks */
  
  export const BANKS: Bank[] = [
    {Name: 'Bank A (Switzerland)', CustomerID: 'A'},
    {Name: 'Bank B (Switzerland)', CustomerID: 'B'},
    {Name: 'Bank C (France)', CustomerID: 'C'},
    {Name: 'Bank D (France)', CustomerID: 'D'},
    {Name: 'Bank E (France)', CustomerID: 'E'},
    {Name: 'Bank F (Italy)', CustomerID: 'F'},
    {Name: 'Bank G (Italy)', CustomerID: 'G'},
    {Name: 'Bank H (Italy)', CustomerID: 'H'},
    {Name: 'Bank I (Italy)', CustomerID: 'I'},
    {Name: 'Bank J (Italy)', CustomerID: 'J'},
    {Name: 'Bank Kolombia (United States of America)', CustomerID: 'K'},
    {Name: 'Bank L (Germany)', CustomerID: 'L'},
    {Name: 'Bank M (Germany)', CustomerID: 'M'},
    {Name: 'Bank N (Germany)', CustomerID: 'N'},
    {Name: 'Bank O (Germany)', CustomerID: 'O'},
    {Name: 'Bank P (Germany)', CustomerID: 'P'},
    {Name: 'Bank Q (Germany)', CustomerID: 'Q'},
    {Name: 'Bank R (Germany)', CustomerID: 'R'}
  ];
  
  
  
  /** list of bank groups */
  
  export const BANKGROUPS: BankGroup[] = [
    {
      Name: 'Switzerland',
      banks: [
        {Name: 'Bank A', CustomerID: 'A'},
        {Name: 'Bank B', CustomerID: 'B'}
      ]
    },
    {
      Name: 'France',
      banks: [
        {Name: 'Bank C', CustomerID: 'C'},
        {Name: 'Bank D', CustomerID: 'D'},
        {Name: 'Bank E', CustomerID: 'E'},
      ]
    },
    {
      Name: 'Italy',
      banks: [
        {Name: 'Bank F', CustomerID: 'F'},
        {Name: 'Bank G', CustomerID: 'G'},
        {Name: 'Bank H', CustomerID: 'H'},
        {Name: 'Bank I', CustomerID: 'I'},
        {Name: 'Bank J', CustomerID: 'J'},
      ]
    },
    {
      Name: 'United States of America',
      banks: [
        {Name: 'Bank Kolombia', CustomerID: 'K'},
      ]
    },
    {
      Name: 'Germany',
      banks: [
        {Name: 'Bank L', CustomerID: 'L'},
        {Name: 'Bank M', CustomerID: 'M'},
        {Name: 'Bank N', CustomerID: 'N'},
        {Name: 'Bank O', CustomerID: 'O'},
        {Name: 'Bank P', CustomerID: 'P'},
        {Name: 'Bank Q', CustomerID: 'Q'},
        {Name: 'Bank R', CustomerID: 'R'}
      ]
    }
  ];
  