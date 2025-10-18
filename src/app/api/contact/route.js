export async function POST(req) {
  try {
    const body = await req.json();
    const { name, number, city, usage } = body || {};
    if (!name || !number || !city || !usage) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (scriptUrl) {
      const resp = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, number, city, usage, ts: Date.now() }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Google Script error: ${resp.status} ${txt}`);
      }
    } else {
      console.log("Contact submission:", { name, number, city, usage });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
