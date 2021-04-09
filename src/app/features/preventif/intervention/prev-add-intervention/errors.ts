
 const formErrors = {
    'frequence': '',
    'tache_id': '',
    'ddr': '',
    'type': '',
    'nb_operateur': '',
    'parametrage': '',
    'h': '',
    'm': ''
  };

 const validationMessages = {
    'frequence': {
      'required': 'Frequnce est obligatoire.',
      'pattern':'que des nombres entiers.'
    },
    'tache_id': {
      'required': 'Tache est obligatoire.'
    },
    'ddr': {
      'required': 'DDR est obligatoire.'
    },
    'type': {
      'required': 'Type est obligatoire.'
    },
    'nb_operateur': {
      'pattern': 'que des nombres entiers.'
    },
    'parametrage': {
      'required': 'Parametrage est obligatoire.'
    },
    'h': {
      'pattern': 'que des nombres entiers.'
    },
    'm': {
      'pattern': 'que des nombres entiers.'
    }
    
  };

  export { formErrors , validationMessages };