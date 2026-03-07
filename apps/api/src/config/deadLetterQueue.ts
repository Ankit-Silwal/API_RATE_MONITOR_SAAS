import { Queue } from "bullmq";
import { queueConnection } from "./queue";

export const deadLetterQueue=new Queue(
  "usage-events-dlq",{
    connection:queueConnection
  }
)