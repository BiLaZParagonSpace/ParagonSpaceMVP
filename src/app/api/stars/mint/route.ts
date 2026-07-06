import { mintParagonStar } from "@/lib/paragon-space";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { wallet?: unknown };
    const wallet = typeof body.wallet === "string" ? body.wallet : "";
    const star = await mintParagonStar(wallet);

    return Response.json({ ok: true, star });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось выпустить NFT-звезду.";

    return Response.json({ ok: false, message }, { status: 400 });
  }
}
