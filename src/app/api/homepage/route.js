import { NextResponse } from "next/server";
import { getCollection } from "../../../lib/mongodb";
import { DEFAULT_FEATURE_TILES, mergeFeatureTiles } from "../../../lib/featureTiles";

export const dynamic = "force-dynamic";

function ensureBoldTags(text) {
  if (!text) return "";
  
  // Normalize text for comparison with default keys
  const normalized = text.replace(/<\/?b>/gi, "").toLowerCase().replace(/\s+/g, " ").trim();
  
  const DEFAULT_MAP = {
    "discover the world of <br /> world with meemstonex": "Disc<b>o</b>ver the world of <br /> W<b>o</b>rld with Meemstonex",
    "the story of <br /> generations": "The st<b>o</b>ry of <br /> generations",
    "let's build the <br /> new era of <br /> marbles together": "Let's b<b>u</b>ild the <br /> new e<b>r</b>a of <br /> ma<b>r</b>bles toge<b>t</b>her"
  };
  
  if (DEFAULT_MAP[normalized]) {
    return DEFAULT_MAP[normalized];
  }
  
  // Otherwise, auto-inject bold tags into words of length >= 3
  let clean = text.replace(/<\/?b>/gi, "");
  
  const words = clean.split(" ");
  const stopWords = ["the", "of", "and", "in", "to", "with", "a", "an", "for", "on", "at", "by", "is", "it"];
  
  const processed = words.map(word => {
    // If it is an HTML tag or stop word, return as is
    if (word.includes("<") || word.includes(">") || word.includes("/") || stopWords.includes(word.toLowerCase())) {
      return word;
    }
    
    // Remove punctuation to calculate correct word length and index
    let cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, "");
    if (cleanWord.length < 3) {
      return word;
    }
    
    // Find middle index of clean word
    let mid = Math.floor(cleanWord.length / 2);
    let targetChar = cleanWord[mid];
    
    // Find index of target character in original word
    let idx = word.indexOf(targetChar);
    if (idx !== -1) {
      return word.slice(0, idx) + "<b>" + targetChar + "</b>" + word.slice(idx + 1);
    }
    return word;
  });
  
  return processed.join(" ");
}

export async function GET() {
  try {
    const col = await getCollection("settings");
    const doc = await col.findOne({ _id: "homepage" });

    const defaults = {
      hero: {
        heading: "MEEMSTONEX",
        paragraph: "Enter the world of Meemstonex, where raw natural stones are transformed into timeless architectural masterpieces. Crafting unmatched luxury for three generations, our premium marble collection brings custom precision and breathtaking beauty to your spaces.",
        buttonTitle: "Explore Products",
        buttonLink: "/products",
        videos: [
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-1.mp4",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-2.mp4",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-3.mp4",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-4.mp4",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-2.mp4"
        ]
      },
      about: {
        imageUrl: "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/img/sub-hero.webp",
        title: "Disc<b>o</b>ver the world of <br /> W<b>o</b>rld with Meemstonex",
        subtext: "Welcome to Meemstonex",
        trailImages: [
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P1.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P2.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P3.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P4.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P5.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P6.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P7.webp"
        ]
      },
      ourProcess: {
        subtitle: "Our Process",
        title: "YOUR DREAM TEMPLE IN 5 STEPS",
        description: "Looking to design your Dream Temple? Here's how you can get started.",
        steps: [
          "Lets Connect One on One",
          "Explore our Catalog",
          "Place The Order",
          "Approval",
          "Delivery and Installation"
        ]
      },
      features: {
        subtitle: "Where Everyday Elegance Meets a World of Interconnected Luxury",
        description: "Immerse yourself in a rich and ever-expanding universe where our vibrant array of marble products seamlessly converge, creating an interconnected overlay of refined experiences within your home",
        tilesOrder: [
          "MARBLE TEMPLE",
          "INLAY WORK",
          "FOUNTAINS",
          "STONE WALL PANELS",
          "ART / CRAFT / HANDICRAFT",
          "MOSQUE WORKS",
          "WASH BASIN",
          "TABLE TOP"
        ],
        tiles: DEFAULT_FEATURE_TILES
      },
      stats: {
        imageUrl: "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/img/numbersBG.webp",
        subtitle: "Completed Custom Projects",
        title: "COMPLETED CUSTOM PROJECTS",
        items: [
          { value: "80+", label: "Projects" },
          { value: "100+", label: "Cities" },
          { value: "28+", label: "Years Experience" }
        ]
      },
      story: {
        subtitle: "the multiversal world of meemstonex",
        title: "The st<b>o</b>ry of <br /> generations",
        description: "For three generations, Meemstonex Marble has shaped the poetry of stone where earth’s finest artistry becomes a family’s enduring legacy. From the first chisel strike to today’s modern craftsmanship, our heritage lives in every vein, every polish, and every masterpiece we create. Guided by passion, precision, and pride, we honor nature’s grandeur by transforming raw marble into timeless expressions of beauty and strength. At Meemstonex, we don’t just work with stone we preserve tradition, craft stories, and carve the legacy of generations into every surface we touch",
        buttonTitle: "discover products"
      },
      contact: {
        imageUrl: "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/img/abdul.webp",
        subtitle: "Contact Meemstonex",
        title: "Let's b<b>u</b>ild the <br /> new e<b>r</b>a of <br /> ma<b>r</b>bles toge<b>t</b>her",
        buttonTitle: "contact us"
      },
      team: {
        visible: true,
        subtitle: "The Minds Behind the Craft",
        title: "MEET THE TEAM",
        members: [
          {
            name: "Abdul",
            position: "Founder & Master Carver",
            photo: "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/img/abdul.webp"
          }
        ]
      },
      testimonials: {
        visible: false,
        subtitle: "What Our Clients Say",
        title: "TESTIMONIALS",
        items: []
      }
    };

    if (!doc) {
      return NextResponse.json(defaults);
    }

    // Merge document with defaults to handle partial updates cleanly
    const merged = {
      hero: {
        ...defaults.hero,
        ...(doc.hero || {})
      },
      about: {
        ...defaults.about,
        ...(doc.about || {})
      },
      ourProcess: {
        ...defaults.ourProcess,
        ...(doc.ourProcess || {})
      },
      features: {
        ...defaults.features,
        ...(doc.features || {}),
        tiles: mergeFeatureTiles(doc.features?.tiles)
      },
      stats: {
        ...defaults.stats,
        ...(doc.stats || {})
      },
      story: {
        ...defaults.story,
        ...(doc.story || {})
      },
      contact: {
        ...defaults.contact,
        ...(doc.contact || {})
      },
      team: {
        ...defaults.team,
        ...(doc.team || {})
      },
      testimonials: {
        ...defaults.testimonials,
        ...(doc.testimonials || {})
      }
    };

    if (merged.about && merged.about.title) {
      merged.about.title = ensureBoldTags(merged.about.title);
    }
    if (merged.story && merged.story.title) {
      merged.story.title = ensureBoldTags(merged.story.title);
    }
    if (merged.contact && merged.contact.title) {
      merged.contact.title = ensureBoldTags(merged.contact.title);
    }
    if (merged.team && merged.team.title) {
      merged.team.title = ensureBoldTags(merged.team.title);
    }

    return NextResponse.json(merged);
  } catch (err) {
    console.error("GET /api/homepage error:", err);
    // Silent fallback to defaults to keep page working
    return NextResponse.json({
      hero: {
        heading: "MEEMSTONEX",
        paragraph: "Enter the world of Meemstonex, where raw natural stones are transformed into timeless architectural masterpieces. Crafting unmatched luxury for three generations, our premium marble collection brings custom precision and breathtaking beauty to your spaces.",
        buttonTitle: "Explore Products",
        buttonLink: "/products",
        videos: [
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-1.mp4",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-2.mp4",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-3.mp4",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-4.mp4",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/videos/hero-2.mp4"
        ]
      },
      about: {
        imageUrl: "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/img/sub-hero.webp",
        title: "Disc<b>o</b>ver the world of <br /> W<b>o</b>rld with Meemstonex",
        subtext: "Welcome to Meemstonex",
        trailImages: [
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P1.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P2.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P3.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P4.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P5.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P6.webp",
          "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/products/P7.webp"
        ]
      },
      ourProcess: {
        subtitle: "Our Process",
        title: "YOUR DREAM TEMPLE IN 5 STEPS",
        description: "Looking to design your Dream Temple? Here's how you can get started.",
        steps: [
          "Lets Connect One on One",
          "Explore our Catalog",
          "Place The Order",
          "Approval",
          "Delivery and Installation"
        ]
      },
      features: {
        subtitle: "Where Everyday Elegance Meets a World of Interconnected Luxury",
        description: "Immerse yourself in a rich and ever-expanding universe where our vibrant array of marble products seamlessly converge, creating an interconnected overlay of refined experiences within your home",
        tilesOrder: [
          "MARBLE TEMPLE",
          "INLAY WORK",
          "FOUNTAINS",
          "STONE WALL PANELS",
          "ART / CRAFT / HANDICRAFT",
          "MOSQUE WORKS",
          "WASH BASIN",
          "TABLE TOP"
        ],
        tiles: DEFAULT_FEATURE_TILES
      },
      stats: {
        imageUrl: "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/img/numbersBG.webp",
        subtitle: "Completed Custom Projects",
        title: "COMPLETED CUSTOM PROJECTS",
        items: [
          { value: "80+", label: "Projects" },
          { value: "100+", label: "Cities" },
          { value: "28+", label: "Years Experience" }
        ]
      },
      story: {
        subtitle: "the multiversal world of meemstonex",
        title: "The st<b>o</b>ry of <br /> generations",
        description: "For three generations, Meemstonex Marble has shaped the poetry of stone where earth’s finest artistry becomes a family’s enduring legacy. From the first chisel strike to today’s modern craftsmanship, our heritage lives in every vein, every polish, and every masterpiece we create. Guided by passion, precision, and pride, we honor nature’s grandeur by transforming raw marble into timeless expressions of beauty and strength. At Meemstonex, we don’t just work with stone we preserve tradition, craft stories, and carve the legacy of generations into every surface we touch",
        buttonTitle: "discover products"
      },
      contact: {
        imageUrl: "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/img/abdul.webp",
        subtitle: "Contact Meemstonex",
        title: "Let's b<b>u</b>ild the <br /> new e<b>r</b>a of <br /> ma<b>r</b>bles toge<b>t</b>her",
        buttonTitle: "contact us"
      },
      team: {
        visible: true,
        subtitle: "The Minds Behind the Craft",
        title: "MEET THE TEAM",
        members: [
          {
            name: "Abdul",
            position: "Founder & Master Carver",
            photo: "https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/img/abdul.webp"
          }
        ]
      },
      testimonials: {
        visible: false,
        subtitle: "What Our Clients Say",
        title: "TESTIMONIALS",
        items: []
      }
    });
  }
}
