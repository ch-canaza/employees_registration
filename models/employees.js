const mongoose = require('mongoose');

const full_name_validation = /[A-Z]+/;
const valid_id_number = /[a-zA-Z0-9]+/;
const valid_email_re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const EmployeeSchema = mongoose.Schema({
  surname: {
    type: String,
    required: true,
    minLength: [3, 'name too short {VALUE}'],
    maxLength: [20, 'name too long'],
    match: [full_name_validation, '{VALUE} should be uppercase, no special characters allowed']
    
  },
  second_surname: {
    type: String,
    required: true,
    minLength: [3, 'name too short {VALUE}'],
    maxLength: [20, 'name too long'],
    match: [full_name_validation, '{VALUE} should be uppercase, no special characters allowed']
  },
  firstname: {
    type: String,
    required: true,
    minLength: [3, 'name too short {VALUE}'],
    maxLength: [20, 'name too long'],
    match: [full_name_validation, '{VALUE} should be uppercase, no special characters allowed']
  },
  midlename: {
    type: String,
    required: true,minLength: [3, 'name too short {VALUE}'],
    maxLength: [50, 'name too long'],
    match: [full_name_validation, '{VALUE} should be uppercase, no special characters allowed']
  },
  country: {
    type: String,
    required: true,
    enum: ['Colombia', 'United States'],
  },
  id_type: {
    type: String,
    required: true,
    enum: ['C.C', 'C.E', 'passport', 'special permission']
  },
  id_number: {
    type: String,
    required: true,
    match: [valid_id_number, '{VALUE} should be aphanumeric, no special characters'],
    maxLength: [20, 'id number is  too long'],
    unique: true

  },
  email: {
    type: String,
    required: true, 
    unique: true,
    maxLength: [300, 'email is too long'],
    match: valid_email_re

  },
  start_date: {
    type: Date,
    required: true,
    
  },
  area: {
    type: String,
    required: true,
    enum: ['Administración', 'Financiera', 'Compras', 'Infraestructura', 'Operación', 'Talento Humano', 'Servicios Varios', 'otro']
  },
  status: {
    type: String,
    required: true,
    enum: ['active']
  },
  register_date: {
    type: String,
    required: true
  },
  edition_date: {
    type: String, //modificar - Date -
    required: true
  },
 
});
const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports.Employee = Employee;