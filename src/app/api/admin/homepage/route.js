import { NextResponse } from "next/server";
import { getCollection } from "../../../../lib/mongodb";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { hero, about, ourProcess, features, stats, story, contact } = body || {};

    if (!hero && !about && !ourProcess && !features && !stats && !story && !contact) {
      return NextResponse.json({ error: "Missing settings payload (hero, about, ourProcess, features, stats, story, or contact)" }, { status: 400 });
    }

    const updateDoc = {
      updatedAt: new Date(),
    };

    if (hero) {
      const { heading, paragraph, buttonTitle, buttonLink, videos } = hero;

      if (!heading || !videos || !Array.isArray(videos) || videos.length === 0) {
        return NextResponse.json(
          { error: "Invalid payload: hero heading and at least one video loop required" },
          { status: 400 }
        );
      }

      updateDoc.hero = {
        heading: String(heading).trim(),
        paragraph: String(paragraph || "").trim(),
        buttonTitle: String(buttonTitle || "").trim(),
        buttonLink: String(buttonLink || "").trim(),
        videos: videos.map((v) => String(v || "").trim()).filter(Boolean),
      };
    }

    if (about) {
      const { imageUrl, title, subtext, trailImages } = about;
      updateDoc.about = {
        imageUrl: String(imageUrl || "").trim(),
        title: String(title || "").trim(),
        subtext: String(subtext || "").trim(),
        trailImages: Array.isArray(trailImages)
          ? trailImages.map((img) => String(img || "").trim()).filter(Boolean).slice(0, 8)
          : []
      };
    }

    if (ourProcess) {
      const { subtitle, title, description, steps } = ourProcess;
      updateDoc.ourProcess = {
        subtitle: String(subtitle || "").trim(),
        title: String(title || "").trim(),
        description: String(description || "").trim(),
        steps: Array.isArray(steps)
          ? steps.map((s) => String(s || "").trim()).filter(Boolean).slice(0, 5)
          : []
      };
    }

    if (features) {
      const { subtitle, description } = features;
      updateDoc.features = {
        subtitle: String(subtitle || "").trim(),
        description: String(description || "").trim()
      };
    }

    if (stats) {
      const { imageUrl, subtitle, title, items } = stats;
      updateDoc.stats = {
        imageUrl: String(imageUrl || "").trim(),
        subtitle: String(subtitle || "").trim(),
        title: String(title || "").trim(),
        items: Array.isArray(items)
          ? items.map(item => ({
              value: String(item?.value || "").trim(),
              label: String(item?.label || "").trim()
            })).slice(0, 3)
          : []
      };
    }

    if (story) {
      const { subtitle, title, description, buttonTitle } = story;
      updateDoc.story = {
        subtitle: String(subtitle || "").trim(),
        title: String(title || "").trim(),
        description: String(description || "").trim(),
        buttonTitle: String(buttonTitle || "").trim()
      };
    }

    if (contact) {
      const { imageUrl, subtitle, title, buttonTitle } = contact;
      updateDoc.contact = {
        imageUrl: String(imageUrl || "").trim(),
        subtitle: String(subtitle || "").trim(),
        title: String(title || "").trim(),
        buttonTitle: String(buttonTitle || "").trim()
      };
    }

    const col = await getCollection("settings");
    await col.updateOne(
      { _id: "homepage" },
      { $set: updateDoc },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, ...updateDoc });
  } catch (err) {
    console.error("PUT /api/admin/homepage error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
