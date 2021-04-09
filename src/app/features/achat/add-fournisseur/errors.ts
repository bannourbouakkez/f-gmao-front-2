

 const formErrors = {
    'nom': '',
    'livmode_id': '',
    'secteur_id': '',
    'TVA':'',
    'tel1': '',
    'tel2': '',
    'fax1': '',
    'fax2': '',
    'email1': '',
    'email2': '',
    'portable1': '',
    'portable2': ''
  };

 const validationMessages = {
    'nom': {
      'required': 'Full Name is required.'
    },
    'livmode_id': {
      'required': 'mode de livraison est obligatoire.'
    },
    'secteur_id': {
      'required': 'secteur est obligatoire.',
    },
    'TVA': {
      'required': 'TVA est obligatoire',
      'pattern':'que des nombres '
    },
    'tel1': {
      'required': 'numero telephone est obligatoire',
      'pattern':'que des nombres '
    },
    'tel2': {
      'pattern':'que des nombres '
    },
    'fax1': {
      'pattern':'que des nombres '
    },
    'fax2': {
      'pattern':'que des nombres '
    },
    'portable1': {
      'pattern':'que des nombres '
    },
    'portable2': {
      'pattern':'que des nombres '
    },
    'email1': {
      'email':'mahouch email hétha '
    },
    'email2': {
      'email':'mahouc email hétha '
    },




  };

  export { formErrors , validationMessages };