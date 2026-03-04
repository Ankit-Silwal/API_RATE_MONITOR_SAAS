import { pool } from "../../config/db"
export async function getApiStats(apiId: string)
{
  const result = await pool.query(
    `
    SELECT
      COUNT(*) AS total_requests,

      COUNT(*) FILTER (WHERE status_code >= 400) AS error_requests,

      percentile_cont(0.50) WITHIN GROUP (ORDER BY response_time) 
      AS p50_latency,

      percentile_cont(0.95) WITHIN GROUP (ORDER BY response_time) 
      AS p95_latency,

      percentile_cont(0.99) WITHIN GROUP (ORDER BY response_time) 
      AS p99_latency

    FROM api_usage_logs
    WHERE api_id = $1
    `,
    [apiId]
  )

  const row = result.rows[0]

  const totalRequests = Number(row.total_requests)
  const errorRequests = Number(row.error_requests)

  return {
    totalRequests,
    errorRequests,
    errorRate: totalRequests === 0 ? 0 : (errorRequests / totalRequests) * 100,

    p50Latency: row.p50_latency ? Number(row.p50_latency) : 0,
    p95Latency: row.p95_latency ? Number(row.p95_latency) : 0,
    p99Latency: row.p99_latency ? Number(row.p99_latency) : 0
  }
}