require("dotenv"); // FOR BCYRPT SECRET KEY
require("colors")
let ENVIRONMENT =  'test';

function getDatabase(){
    return (ENVIRONMENT === "test") 
    ? "test.sqlite"
    : "production.sqlite"
}

const BCRYPT_WORK_FACTOR = ENVIRONMENT === "test" ? 1 : 12
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY || "A SUPER SECRET KEY"

console.log("ProcMusic Config:".green);
console.log("WORK FACTOR:".yellow, BCRYPT_WORK_FACTOR.toString().white);
console.log("PORT:".yellow, PORT.toString().white);
console.log("DATABASE:".yellow, getDatabase());

module.exports = {
    getDatabase,
    BCRYPT_WORK_FACTOR,
    PORT,
    SECRET_KEY
}