export function getTimeRange(range?:string){
  switch(range){
    case "5m":
      return "now()-interval '5 minutes'"
    case "1h":
      return "now()-interval '1 hour'"
    case "24h":
      return "now()-interval '24 hours'"
    case "7d":
      return "now() - interval '7 days'"
    default:
      return "now() -interval '1 hour' "
  }
}