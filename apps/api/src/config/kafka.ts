import { Kafka } from "kafkajs";

export const kafka=new Kafka({
  clientId:"api-rate-monitor",
  brokers:["localhost:9092"]
})

export const producer=kafka.producer()
export const consumer=kafka.consumer({
  groupId:"usage-log-consumer"
})