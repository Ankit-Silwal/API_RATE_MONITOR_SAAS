import {Pool} from "pg"
export const pool=new Pool({
  host:"localhost",
  port:5432,
  user:"postgres",
  password:process.env.POSTGRES_PASS,
  database:process.env.POSTGRES_DATABASE
})

export const connectDB=async ():Promise<void>=>{
  try{
    await pool.query('Select 1');
    console.log("Database was connected")
  }catch(error:any){
    console.log(`Error connecting the database ${error}`);
  }
}