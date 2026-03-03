import {Pool} from "pg"
import dotenv from "dotenv"

dotenv.config()

export const pool=new Pool({
  host:"localhost",
  port:5432,
  user:"postgres",
  password:process.env.POSTGRES_PASSWORD,
  database:process.env.DATABASE_NAME
})

export const connectDB=async ():Promise<void>=>{
  try{
    await pool.query('Select 1');
    console.log("Database was connected")
  }catch(error:any){
    console.log(`Error connecting the database ${error}`);
  }
}

