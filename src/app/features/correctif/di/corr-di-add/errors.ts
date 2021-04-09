
 const formErrors = {
    'demandeur_user_id': '',
    'recepteur_user_id': '',
    //'equipement_id': '',
    'anomalie_id': '',
    'date': '',
    'time': '',
    'type': '',
    'degre': ''
  };

 const validationMessages = {
    'demandeur_user_id': {
      'required': 'Demandeur est obligatoire.'
      //'pattern':'que des nombres entiers.'
    },
    'anomalie_id': {
      'required': 'Anomalie est obligatoire.'
    },
    'recepteur_user_id': {
      'required': 'Recepteur est obligatoire.'
    },
    'date': {
      'required': 'Date est obligatoire.'
    },
    'time': {
      'required': 'Heure est obligatoire.'
    },
    'type': {
      'required': 'Type est obligatoire.'
    },
    'degre': {
      'required': 'Degre est obligatoire.'
    }
    
    
  };

  export { formErrors , validationMessages };