import { publicApi, type DataDeletionStatus } from "@/lib/api";
import { clientIp, json } from "@/lib/http";

// Proxies `GET /api/v1/public/meta/instagram/data-deletion/{code}` for the status lookup on /data-deletion.
export async function GET(request: Request, { params }: RouteContext<"/api/data-deletion/[code]">) {
  const { code } = await params;
  if (!/^[a-z0-9]{8,64}$/.test(code)) {
    return json({ error: "invalid" }, 400);
  }
  const result = await publicApi<DataDeletionStatus>(`/meta/instagram/data-deletion/${encodeURIComponent(code)}`, { clientIp: clientIp(request) });
  if (result.ok) {
    return json({ confirmationCode: result.data.confirmationCode, status: result.data.status, createdAt: result.data.createdAt });
  }
  return json({ error: result.status === 404 ? "notFound" : "unavailable" }, result.status === 404 ? 404 : 503);
}
