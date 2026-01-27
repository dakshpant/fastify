import"dotenv/config"

class Env {
    static APP_Name = process.env.APP_NAME;
    
    static PORT = process.env.PORT ? Number(process.env.PORT) : 4000

    static DB_URL = process.env.DATABASE_URL
}
export default Env