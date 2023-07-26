const getDate = date =>{
    date = new Date(date);
    return `${date.getMonth().toString().padStart(2,'0')}/${date.getDay().toString().padStart(2,'0')}/${date.getFullYear()}`;
}