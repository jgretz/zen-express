export default {
  name: 'schema',
  definition: {
    name: 'string',
    url: 'string',
    icon: 'string',
    permission: 'string',
    trackChangeDates: 'bool',
    hideInData: 'bool',
    fields: [{
      name: 'string',
      field_type: 'string',
      peer: 'string',
      list: 'string',
      required: 'bool',
      identity: 'bool',
      showInList: 'bool'
    }],
  },
};
