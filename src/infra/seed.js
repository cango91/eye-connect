require('dotenv').config();
require('./db');
// const Patient = require('../models/patient');
// let patients = [
//     {"name": "Amina Jafari", "dateOfBirth": new Date("1991-03-12T00:00"), "gender": "Female"},
//     {"name": "Bashar Al-Hashimi", "dateOfBirth": new Date("1982-07-30T00:00"), "gender": "Male"},
//     {"name": "Cansu Aydin", "dateOfBirth": new Date("1987-02-09T00:00"), "gender": "Female"},
//     {"name": "Damilola Okeke", "dateOfBirth": new Date("1989-11-01T00:00"), "gender": "Male"},
//     {"name": "Emine Yildirim", "dateOfBirth": new Date("1995-12-06T00:00"), "gender": "Female"},
//     {"name": "Faridah Bello", "dateOfBirth": new Date("1985-08-20T00:00"), "gender": "Female"},
//     {"name": "Ghazi Mustafa", "dateOfBirth": new Date("1978-04-18T00:00"), "gender": "Male"},
//     {"name": "Halima Ndiaye", "dateOfBirth": new Date("1993-10-28T00:00"), "gender": "Female"},
//     {"name": "Ismail Erdogan", "dateOfBirth": new Date("1981-01-15T00:00"), "gender": "Male"},
//     {"name": "Jamila Ngugi", "dateOfBirth": new Date("1992-05-22T00:00"), "gender": "Female"},
//     {"name": "Khalil Samara", "dateOfBirth": new Date("1988-09-03T00:00"), "gender": "Male"},
//     {"name": "Leyla Arslan", "dateOfBirth": new Date("1990-06-13T00:00"), "gender": "Female"},
//     {"name": "Musa Camara", "dateOfBirth": new Date("1983-02-25T00:00"), "gender": "Male"},
//     {"name": "Naima Zakaria", "dateOfBirth": new Date("1986-07-08T00:00"), "gender": "Female"},
//     {"name": "Osman Demir", "dateOfBirth": new Date("1979-03-30T00:00"), "gender": "Male"},
//     {"name": "Pembe Aksoy", "dateOfBirth": new Date("1984-11-12T00:00"), "gender": "Female"},
//     {"name": "Qasim Farah", "dateOfBirth": new Date("1991-04-21T00:00"), "gender": "Male"},
//     {"name": "Rahma Ali", "dateOfBirth": new Date("1980-12-31T00:00"), "gender": "Female"},
//     {"name": "Suleiman Hassan", "dateOfBirth": new Date("1982-06-19T00:00"), "gender": "Male"},
//     {"name": "Tayyiba Cisse", "dateOfBirth": new Date("1989-01-07T00:00"), "gender": "Female"},
//     {"name": "Ufuk Yilmaz", "dateOfBirth": new Date("1990-08-26T00:00"), "gender": "Male"},
//     {"name": "Vusala Polat", "dateOfBirth": new Date("1985-02-14T00:00"), "gender": "Female"},
//     {"name": "Walid Al-Hakim", "dateOfBirth": new Date("1977-07-03T00:00"), "gender": "Male"},
//     {"name": "Xavier Nkrumah", "dateOfBirth": new Date("1993-11-20T00:00"), "gender": "Male"},
//     {"name": "Yasmin El-Masri", "dateOfBirth": new Date("1987-05-15T00:00"), "gender": "Female"},
//     {"name": "Zeki Kaya", "dateOfBirth": new Date("1981-10-01T00:00"), "gender": "Male"}
//     ];

// Patient.insertMany(patients)
//     .then(() => {
//         console.log('data has been inserted');
//     }).catch(err=>{
//         console.error(err);
//     });