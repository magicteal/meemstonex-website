"use client";

import React, { useEffect, useState } from "react";
import { getHomepageSettings, updateHomepageSettings, mockUpload } from "../../../services/api";
import { useToast } from "../../../components/products/ToastProvider";

export default function HomepageCMSEditor() {
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [buttonTitle, setButtonTitle] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [videos, setVideos] = useState(["", "", "", "", ""]);
  
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [aboutTitleL1, setAboutTitleL1] = useState("");
  const [aboutTitleL2, setAboutTitleL2] = useState("");
  const [aboutTitleL3, setAboutTitleL3] = useState("");
  const [aboutSubtext, setAboutSubtext] = useState("");
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const [trailImages, setTrailImages] = useState(["", "", "", "", "", "", "", ""]);
  const [uploadingTrail, setUploadingTrail] = useState([false, false, false, false, false, false, false, false]);

  const [processSubtitle, setProcessSubtitle] = useState("");
  const [processTitle, setProcessTitle] = useState("");
  const [processDescription, setProcessDescription] = useState("");
  const [processSteps, setProcessSteps] = useState(["", "", "", "", ""]);

  // Features CMS States
  const [featuresSubtitle, setFeaturesSubtitle] = useState("");
  const [featuresDescription, setFeaturesDescription] = useState("");
  const [featuresTilesOrder, setFeaturesTilesOrder] = useState([]);
  const [featuresTiles, setFeaturesTiles] = useState([]);
  const [uploadingTileVideo, setUploadingTileVideo] = useState([]);

  // Stats CMS States
  const [statsImageUrl, setStatsImageUrl] = useState("");
  const [statsSubtitle, setStatsSubtitle] = useState("");
  const [statsTitle, setStatsTitle] = useState("");
  const [statsItems, setStatsItems] = useState([
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" }
  ]);
  const [uploadingStatsImage, setUploadingStatsImage] = useState(false);

  // Story CMS States
  const [storySubtitle, setStorySubtitle] = useState("");
  const [storyTitleL1, setStoryTitleL1] = useState("");
  const [storyTitleL2, setStoryTitleL2] = useState("");
  const [storyTitleL3, setStoryTitleL3] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyButtonTitle, setStoryButtonTitle] = useState("");

  // Contact CMS States
  const [contactImageUrl, setContactImageUrl] = useState("");
  const [contactSubtitle, setContactSubtitle] = useState("");
  const [contactTitleL1, setContactTitleL1] = useState("");
  const [contactTitleL2, setContactTitleL2] = useState("");
  const [contactTitleL3, setContactTitleL3] = useState("");
  const [contactButtonTitle, setContactButtonTitle] = useState("");
  const [uploadingContactImage, setUploadingContactImage] = useState(false);

  // Team CMS States
  const [teamVisible, setTeamVisible] = useState(true);
  const [teamSubtitle, setTeamSubtitle] = useState("");
  const [teamTitleL1, setTeamTitleL1] = useState("");
  const [teamTitleL2, setTeamTitleL2] = useState("");
  const [teamTitleL3, setTeamTitleL3] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [uploadingMemberPhoto, setUploadingMemberPhoto] = useState([]);

  // Testimonials CMS States
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);
  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState("");
  const [testimonialsTitle, setTestimonialsTitle] = useState("");
  const [testimonialsItems, setTestimonialsItems] = useState([]);
  const [uploadingTestimonialVideo, setUploadingTestimonialVideo] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState([false, false, false, false, false]);
  const [error, setError] = useState(null);

  const { push, remove } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getHomepageSettings();
        if (!mounted) return;
        if (data?.hero) {
          setHeading(data.hero.heading || "");
          setParagraph(data.hero.paragraph || "");
          setButtonTitle(data.hero.buttonTitle || "");
          setButtonLink(data.hero.buttonLink || "");
          
          const loadedVids = Array.isArray(data.hero.videos) ? [...data.hero.videos] : [];
          while (loadedVids.length < 5) {
            loadedVids.push("");
          }
          setVideos(loadedVids.slice(0, 5));
        }
        if (data?.about) {
          setAboutImageUrl(data.about.imageUrl || "");
          const cleanTitle = (data.about.title || "").replace(/<\/?b>/gi, "");
          const lines = cleanTitle.split(/<br\s*\/?>/i).map(l => l.trim());
          setAboutTitleL1(lines[0] || "");
          setAboutTitleL2(lines[1] || "");
          setAboutTitleL3(lines[2] || "");
          setAboutSubtext(data.about.subtext || "");

          const loadedTrail = Array.isArray(data.about.trailImages) ? [...data.about.trailImages] : [];
          while (loadedTrail.length < 8) {
            loadedTrail.push("");
          }
          setTrailImages(loadedTrail.slice(0, 8));
        }
        if (data?.ourProcess) {
          setProcessSubtitle(data.ourProcess.subtitle || "");
          setProcessTitle(data.ourProcess.title || "");
          setProcessDescription(data.ourProcess.description || "");

          const loadedSteps = Array.isArray(data.ourProcess.steps) ? [...data.ourProcess.steps] : [];
          while (loadedSteps.length < 5) {
            loadedSteps.push("");
          }
          setProcessSteps(loadedSteps.slice(0, 5));
        }
        if (data?.features) {
          setFeaturesSubtitle(data.features.subtitle || "");
          setFeaturesDescription(data.features.description || "");

          const loadedTiles = Array.isArray(data.features.tiles) ? data.features.tiles : [];
          setFeaturesTilesOrder(loadedTiles.map((t) => t.key));
          setFeaturesTiles(loadedTiles);
          setUploadingTileVideo(loadedTiles.map(() => false));
        }
        if (data?.stats) {
          setStatsImageUrl(data.stats.imageUrl || "");
          setStatsSubtitle(data.stats.subtitle || "");
          setStatsTitle(data.stats.title || "");
          const loadedStatsItems = Array.isArray(data.stats.items) ? [...data.stats.items] : [];
          while (loadedStatsItems.length < 3) {
            loadedStatsItems.push({ value: "", label: "" });
          }
          setStatsItems(loadedStatsItems.slice(0, 3));
        }
        if (data?.story) {
          setStorySubtitle(data.story.subtitle || "");
          const cleanTitle = (data.story.title || "").replace(/<\/?b>/gi, "");
          const lines = cleanTitle.split(/<br\s*\/?>/i).map(l => l.trim());
          setStoryTitleL1(lines[0] || "");
          setStoryTitleL2(lines[1] || "");
          setStoryTitleL3(lines[2] || "");
          setStoryDescription(data.story.description || "");
          setStoryButtonTitle(data.story.buttonTitle || "");
        }
        if (data?.contact) {
          setContactImageUrl(data.contact.imageUrl || "");
          setContactSubtitle(data.contact.subtitle || "");
          const cleanTitle = (data.contact.title || "").replace(/<\/?b>/gi, "");
          const lines = cleanTitle.split(/<br\s*\/?>/i).map(l => l.trim());
          setContactTitleL1(lines[0] || "");
          setContactTitleL2(lines[1] || "");
          setContactTitleL3(lines[2] || "");
          setContactButtonTitle(data.contact.buttonTitle || "");
        }
        if (data?.team) {
          setTeamVisible(typeof data.team.visible === "boolean" ? data.team.visible : true);
          setTeamSubtitle(data.team.subtitle || "");
          const cleanTitle = (data.team.title || "").replace(/<\/?b>/gi, "");
          const lines = cleanTitle.split(/<br\s*\/?>/i).map(l => l.trim());
          setTeamTitleL1(lines[0] || "");
          setTeamTitleL2(lines[1] || "");
          setTeamTitleL3(lines[2] || "");
          setTeamMembers(Array.isArray(data.team.members) ? data.team.members : []);
          setUploadingMemberPhoto(Array.isArray(data.team.members) ? data.team.members.map(() => false) : []);
        }
        if (data?.testimonials) {
          setTestimonialsVisible(typeof data.testimonials.visible === "boolean" ? data.testimonials.visible : false);
          setTestimonialsSubtitle(data.testimonials.subtitle || "");
          setTestimonialsTitle(data.testimonials.title || "");
          setTestimonialsItems(Array.isArray(data.testimonials.items) ? data.testimonials.items : []);
          setUploadingTestimonialVideo(Array.isArray(data.testimonials.items) ? data.testimonials.items.map(() => false) : []);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load homepage settings");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleVideoUpload = async (index, file) => {
    if (!file) return;

    setUploading((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    const toastId = push({
      title: `Uploading Video ${index + 1}…`,
      description: "Optimizing buffer and saving to S3",
      duration: 0,
    });

    try {
      const uploadedUrl = await mockUpload(file);
      if (uploadedUrl) {
        setVideos((prev) => {
          const next = [...prev];
          next[index] = uploadedUrl;
          return next;
        });
        push({
          title: `Video ${index + 1} uploaded`,
          type: "success",
        });
      }
    } catch (err) {
      push({
        title: "Upload failed",
        description: err.message,
        type: "error",
      });
    } finally {
      remove(toastId);
      setUploading((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const handleTileVideoUpload = async (index, file) => {
    if (!file) return;

    setUploadingTileVideo((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    const toastId = push({
      title: `Uploading Tile Video ${index + 1}…`,
      description: "Optimizing video and saving to S3",
      duration: 0,
    });

    try {
      const uploadedUrl = await mockUpload(file);
      if (uploadedUrl) {
        setFeaturesTiles((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], video: uploadedUrl };
          return next;
        });
        push({
          title: `Tile ${index + 1} video uploaded`,
          type: "success",
        });
      }
    } catch (err) {
      push({
        title: "Upload failed",
        description: err.message,
        type: "error",
      });
    } finally {
      remove(toastId);
      setUploadingTileVideo((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const removeVideoAt = (index) => {
    setVideos((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
    push({
      title: `Video ${index + 1} removed`,
      type: "success",
    });
  };

  const handleAboutImageUpload = async (file) => {
    if (!file) return;

    setUploadingAboutImage(true);
    const toastId = push({
      title: "Uploading About Background…",
      description: "Optimizing image and saving to S3",
      duration: 0,
    });

    try {
      const uploadedUrl = await mockUpload(file);
      if (uploadedUrl) {
        setAboutImageUrl(uploadedUrl);
        push({
          title: "Background image uploaded",
          type: "success",
        });
      }
    } catch (err) {
      push({
        title: "Upload failed",
        description: err.message,
        type: "error",
      });
    } finally {
      remove(toastId);
      setUploadingAboutImage(false);
    }
  };

  const handleTrailImageUpload = async (index, file) => {
    if (!file) return;

    setUploadingTrail((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    const toastId = push({
      title: `Uploading Trail Image ${index + 1}…`,
      description: "Optimizing image and saving to S3",
      duration: 0,
    });

    try {
      const uploadedUrl = await mockUpload(file);
      if (uploadedUrl) {
        setTrailImages((prev) => {
          const next = [...prev];
          next[index] = uploadedUrl;
          return next;
        });
        push({
          title: `Trail Image ${index + 1} uploaded`,
          type: "success",
        });
      }
    } catch (err) {
      push({
        title: "Upload failed",
        description: err.message,
        type: "error",
      });
    } finally {
      remove(toastId);
      setUploadingTrail((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const removeTrailImageAt = (index) => {
    setTrailImages((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
    push({
      title: `Trail Image ${index + 1} removed`,
      type: "success",
    });
  };

  const handleStatsImageUpload = async (file) => {
    if (!file) return;

    setUploadingStatsImage(true);
    const toastId = push({
      title: "Uploading Stats Background…",
      description: "Optimizing image and saving to S3",
      duration: 0,
    });

    try {
      const uploadedUrl = await mockUpload(file);
      if (uploadedUrl) {
        setStatsImageUrl(uploadedUrl);
        push({
          title: "Background image uploaded",
          type: "success",
        });
      }
    } catch (err) {
      push({
        title: "Upload failed",
        description: err.message,
        type: "error",
      });
    } finally {
      remove(toastId);
      setUploadingStatsImage(false);
    }
  };

  const handleContactImageUpload = async (file) => {
    if (!file) return;

    setUploadingContactImage(true);
    const toastId = push({
      title: "Uploading Contact Cover…",
      description: "Optimizing image and saving to S3",
      duration: 0,
    });

    try {
      const uploadedUrl = await mockUpload(file);
      if (uploadedUrl) {
        setContactImageUrl(uploadedUrl);
        push({
          title: "Cover image uploaded",
          type: "success",
        });
      }
    } catch (err) {
      push({
        title: "Upload failed",
        description: err.message,
        type: "error",
      });
    } finally {
      remove(toastId);
      setUploadingContactImage(false);
    }
  };

  const handleMemberPhotoUpload = async (index, file) => {
    if (!file) return;

    setUploadingMemberPhoto((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    const toastId = push({
      title: `Uploading Photo for Member ${index + 1}…`,
      description: "Optimizing image and saving to S3",
      duration: 0,
    });

    try {
      const uploadedUrl = await mockUpload(file);
      if (uploadedUrl) {
        setTeamMembers((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], photo: uploadedUrl };
          return next;
        });
        push({
          title: `Member ${index + 1} photo uploaded`,
          type: "success",
        });
      }
    } catch (err) {
      push({
        title: "Upload failed",
        description: err.message,
        type: "error",
      });
    } finally {
      remove(toastId);
      setUploadingMemberPhoto((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const removeMemberPhotoAt = (index) => {
    setTeamMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], photo: "" };
      return next;
    });
    push({
      title: `Member ${index + 1} photo removed`,
      type: "success",
    });
  };

  const addTeamMember = () => {
    setTeamMembers((prev) => [
      ...prev,
      { name: "", position: "", photo: "" }
    ]);
    setUploadingMemberPhoto((prev) => [...prev, false]);
  };

  const removeTeamMember = (index) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
    setUploadingMemberPhoto((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTestimonialVideoUpload = async (index, file) => {
    if (!file) return;

    setUploadingTestimonialVideo((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    const toastId = push({
      title: `Uploading Video for Testimonial ${index + 1}…`,
      description: "Optimizing video and saving to S3",
      duration: 0,
    });

    try {
      const uploadedUrl = await mockUpload(file);
      if (uploadedUrl) {
        setTestimonialsItems((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], video: uploadedUrl };
          return next;
        });
        push({
          title: `Testimonial ${index + 1} video uploaded`,
          type: "success",
        });
      }
    } catch (err) {
      push({
        title: "Upload failed",
        description: err.message,
        type: "error",
      });
    } finally {
      remove(toastId);
      setUploadingTestimonialVideo((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const removeTestimonialVideoAt = (index) => {
    setTestimonialsItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], video: "" };
      return next;
    });
    push({
      title: `Testimonial ${index + 1} video removed`,
      type: "success",
    });
  };

  const addTestimonial = () => {
    setTestimonialsItems((prev) => {
      if (prev.length >= 15) {
        push({
          title: "Limit reached",
          description: "You can add up to 15 testimonials",
          type: "error",
        });
        return prev;
      }
      return [...prev, { name: "", role: "", video: "" }];
    });
    setUploadingTestimonialVideo((prev) => (prev.length >= 15 ? prev : [...prev, false]));
  };

  const removeTestimonial = (index) => {
    setTestimonialsItems((prev) => prev.filter((_, i) => i !== index));
    setUploadingTestimonialVideo((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!heading.trim()) {
      push({
        title: "Validation error",
        description: "Heading title is required",
        type: "error",
      });
      return;
    }

    const activeVideos = videos.filter((v) => v && v.trim());
    if (activeVideos.length === 0) {
      push({
        title: "Validation error",
        description: "At least one active video loop is required",
        type: "error",
      });
      return;
    }

    setSaving(true);
    const toastId = push({ title: "Saving homepage CMS settings…", duration: 0 });

    try {
      const payload = {
        hero: {
          heading: heading.trim(),
          paragraph: paragraph.trim(),
          buttonTitle: buttonTitle.trim(),
          buttonLink: buttonLink.trim(),
          videos: activeVideos,
        },
        about: {
          imageUrl: aboutImageUrl.trim(),
          title: [aboutTitleL1, aboutTitleL2, aboutTitleL3].map(s => s.trim()).filter(Boolean).join(" <br /> "),
          subtext: aboutSubtext.trim(),
          trailImages: trailImages.filter((v) => v && v.trim()),
        },
        ourProcess: {
          subtitle: processSubtitle.trim(),
          title: processTitle.trim(),
          description: processDescription.trim(),
          steps: processSteps.map(s => s.trim()).filter(Boolean)
        },
        features: {
          subtitle: featuresSubtitle.trim(),
          description: featuresDescription.trim(),
          tilesOrder: featuresTilesOrder,
          tiles: featuresTiles.map(t => ({
            key: t.key,
            name: t.name.trim(),
            video: t.video.trim(),
            desc: t.desc.trim()
          }))
        },
        stats: {
          imageUrl: statsImageUrl.trim(),
          subtitle: statsSubtitle.trim(),
          title: statsTitle.trim(),
          items: statsItems.map(item => ({
            value: item.value.trim(),
            label: item.label.trim()
          }))
        },
        story: {
          subtitle: storySubtitle.trim(),
          title: [storyTitleL1, storyTitleL2, storyTitleL3].map(s => s.trim()).filter(Boolean).join(" <br /> "),
          description: storyDescription.trim(),
          buttonTitle: storyButtonTitle.trim()
        },
        contact: {
          imageUrl: contactImageUrl.trim(),
          subtitle: contactSubtitle.trim(),
          title: [contactTitleL1, contactTitleL2, contactTitleL3].map(s => s.trim()).filter(Boolean).join(" <br /> "),
          buttonTitle: contactButtonTitle.trim()
        },
        team: {
          visible: teamVisible,
          subtitle: teamSubtitle.trim(),
          title: [teamTitleL1, teamTitleL2, teamTitleL3].map(s => s.trim()).filter(Boolean).join(" <br /> "),
          members: teamMembers.map(m => ({
            name: m.name.trim(),
            position: m.position.trim(),
            photo: m.photo.trim()
          }))
        },
        testimonials: {
          visible: testimonialsVisible,
          subtitle: testimonialsSubtitle.trim(),
          title: testimonialsTitle.trim(),
          items: testimonialsItems.map(t => ({
            name: (t.name || "").trim(),
            role: (t.role || "").trim(),
            video: (t.video || "").trim()
          }))
        }
      };
      await updateHomepageSettings(payload);
      push({
        title: "Settings saved",
        description: "All homepage configurations are now live",
        type: "success",
      });
    } catch (err) {
      push({
        title: "Save failed",
        description: err.message,
        type: "error",
      });
    } finally {
      remove(toastId);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-white">
        <h1 className="text-2xl font-bold">Homepage CMS</h1>
        <p className="text-xs text-neutral-400 mt-2 animate-pulse uppercase tracking-widest">Loading configurations…</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-white font-general">
      <div className="border-b border-white/10 pb-6 mb-8">
        <h1 className="text-3xl font-black uppercase tracking-widest special-font text-blue-50">
          Hom<b>e</b>page CMS
        </h1>
        <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-general">
          Customize the landing copy, action links, and video loops of the marketing page
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-xs font-robert-regular">
          {error}
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex-1 min-w-[100px] py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "hero"
              ? "bg-white text-black shadow-lg"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Hero
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`flex-1 min-w-[100px] py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "about"
              ? "bg-white text-black shadow-lg"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          About
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("process")}
          className={`flex-1 min-w-[100px] py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "process"
              ? "bg-white text-black shadow-lg"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Process
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("features")}
          className={`flex-1 min-w-[100px] py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "features"
              ? "bg-white text-black shadow-lg"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Features
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("stats")}
          className={`flex-1 min-w-[100px] py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "stats"
              ? "bg-white text-black shadow-lg"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Stats
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("story")}
          className={`flex-1 min-w-[100px] py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "story"
              ? "bg-white text-black shadow-lg"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Story
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex-1 min-w-[100px] py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "contact"
              ? "bg-white text-black shadow-lg"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Contact
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("team")}
          className={`flex-1 min-w-[100px] py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "team"
              ? "bg-white text-black shadow-lg"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Team
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("testimonials")}
          className={`flex-1 min-w-[100px] py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "testimonials"
              ? "bg-white text-black shadow-lg"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Testimonials
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {activeTab === "hero" && (
          <>
            {/* Texts section */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
              <h2 className="text-md font-bold uppercase tracking-wider text-blue-50 border-b border-white/5 pb-3">Hero Section Text & Action Button</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="hero-heading" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Hero Heading Title
                  </label>
                  <input
                    id="hero-heading"
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="hero-paragraph" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Hero Paragraph Description (use newlines to separate lines)
                  </label>
                  <textarea
                    id="hero-paragraph"
                    value={paragraph}
                    onChange={(e) => setParagraph(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="hero-btn-title" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Primary Button Title
                  </label>
                  <input
                    id="hero-btn-title"
                    type="text"
                    value={buttonTitle}
                    onChange={(e) => setButtonTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="hero-btn-link" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Primary Button Link
                  </label>
                  <input
                    id="hero-btn-link"
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Video Loops Section */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
              <div className="border-b border-white/5 pb-3 flex items-center justify-between">
                <h2 className="text-md font-bold uppercase tracking-wider text-blue-50">Hero Video Loops (Max 5 Loops)</h2>
                <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  {videos.filter(Boolean).length} Active Loops
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {videos.map((vidSrc, idx) => (
                  <div key={idx} className="flex flex-col border border-white/5 rounded-2xl p-3 bg-neutral-900/30 justify-between min-h-[220px]">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 block mb-2">Slot {idx + 1}</span>
                      {vidSrc ? (
                        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-square w-full">
                          <video
                            src={vidSrc}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            autoPlay
                          />
                          <button
                            type="button"
                            onClick={() => removeVideoAt(idx)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer"
                            title="Remove Video"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-white/10 rounded-lg aspect-square w-full flex items-center justify-center bg-black/40">
                          <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">Empty Slot</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <label className="block">
                        <span className="sr-only">Choose video</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(idx, e.target.files?.[0])}
                          disabled={uploading[idx] || saving}
                          className="block w-full text-xs text-neutral-400 cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50/10 file:text-blue-200 hover:file:bg-blue-50/20 file:transition-all"
                        />
                      </label>
                      {uploading[idx] && (
                        <p className="text-[10px] text-blue-400 animate-pulse mt-1.5 font-bold uppercase tracking-wider">Uploading...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "about" && (
          <>
            {/* About section */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
              <h2 className="text-md font-bold uppercase tracking-wider text-blue-50 border-b border-white/5 pb-3">About Section Content & Background Cover</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="about-subtext" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    About Subtext (displayed above title)
                  </label>
                  <input
                    id="about-subtext"
                    type="text"
                    value={aboutSubtext}
                    onChange={(e) => setAboutSubtext(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70">
                    About Section Title (Line by Line)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="about-title-l1" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 1</label>
                      <input
                        id="about-title-l1"
                        type="text"
                        value={aboutTitleL1}
                        onChange={(e) => setAboutTitleL1(e.target.value)}
                        placeholder="e.g. Discover the world of"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="about-title-l2" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 2</label>
                      <input
                        id="about-title-l2"
                        type="text"
                        value={aboutTitleL2}
                        onChange={(e) => setAboutTitleL2(e.target.value)}
                        placeholder="e.g. World with Meemstonex"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="about-title-l3" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 3 (Optional)</label>
                      <input
                        id="about-title-l3"
                        type="text"
                        value={aboutTitleL3}
                        onChange={(e) => setAboutTitleL3(e.target.value)}
                        placeholder="Optional Line 3"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Background Cover Image
                  </label>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 rounded-2xl border border-white/5 bg-neutral-900/30">
                    <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-video w-full md:w-48 max-w-xs h-28 flex items-center justify-center">
                      {aboutImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={aboutImageUrl}
                          alt="About Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">No Image</span>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAboutImageUpload(e.target.files?.[0])}
                        disabled={uploadingAboutImage || saving}
                        className="block w-full text-xs text-neutral-400 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-white/10 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 file:transition-all"
                      />
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
                        Suggested resolution: 1920x1080. Max file size: 5MB.
                      </p>
                      {uploadingAboutImage && (
                        <p className="text-[10px] text-blue-400 animate-pulse font-bold uppercase tracking-wider">Uploading cover image...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Image Trail Section */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
              <div className="border-b border-white/5 pb-3 flex items-center justify-between">
                <h2 className="text-md font-bold uppercase tracking-wider text-blue-50">About Section Hover Image Trail (Max 8 Images)</h2>
                <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  {trailImages.filter(Boolean).length} Active Images
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trailImages.map((imgSrc, idx) => (
                  <div key={idx} className="flex flex-col border border-white/5 rounded-2xl p-3 bg-neutral-900/30 justify-between min-h-[220px]">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 block mb-2">Slot {idx + 1}</span>
                      {imgSrc ? (
                        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-square w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc}
                            alt={`Trail Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeTrailImageAt(idx)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer"
                            title="Remove Image"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-white/10 rounded-lg aspect-square w-full flex items-center justify-center bg-black/40">
                          <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">Empty Slot</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <label className="block">
                        <span className="sr-only">Choose image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleTrailImageUpload(idx, e.target.files?.[0])}
                          disabled={uploadingTrail[idx] || saving}
                          className="block w-full text-xs text-neutral-400 cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50/10 file:text-blue-200 hover:file:bg-blue-50/20 file:transition-all"
                        />
                      </label>
                      {uploadingTrail[idx] && (
                        <p className="text-[10px] text-blue-400 animate-pulse mt-1.5 font-bold uppercase tracking-wider">Uploading...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "process" && (
          <>
            {/* Process headings */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
              <h2 className="text-md font-bold uppercase tracking-wider text-blue-50 border-b border-white/5 pb-3">Process Section Copy Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="process-subtitle" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Process Subtitle
                  </label>
                  <input
                    id="process-subtitle"
                    type="text"
                    value={processSubtitle}
                    onChange={(e) => setProcessSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="process-title" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Process Section Main Title
                  </label>
                  <input
                    id="process-title"
                    type="text"
                    value={processTitle}
                    onChange={(e) => setProcessTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="process-description" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Process Section Description Paragraph
                  </label>
                  <textarea
                    id="process-description"
                    value={processDescription}
                    onChange={(e) => setProcessDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Process Steps List */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
              <h2 className="text-md font-bold uppercase tracking-wider text-blue-50 border-b border-white/5 pb-3">Process Steps Description (Static Icons)</h2>
              
              <div className="space-y-4">
                {processSteps.map((stepVal, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 border border-white/5 rounded-2xl p-4 bg-neutral-900/30">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest min-w-[80px]">Step {idx + 1}</span>
                    <input
                      type="text"
                      value={stepVal}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProcessSteps((prev) => {
                          const next = [...prev];
                          next[idx] = val;
                          return next;
                        });
                      }}
                      required
                      placeholder={`Step ${idx + 1} Copy`}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "features" && (
          <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
            <h2 className="text-md font-bold uppercase tracking-wider text-blue-50 border-b border-white/5 pb-3">Features Section Headings</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="features-subtitle" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                  Features Subtitle
                </label>
                <input
                  id="features-subtitle"
                  type="text"
                  value={featuresSubtitle}
                  onChange={(e) => setFeaturesSubtitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label htmlFor="features-description" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                  Features Description
                </label>
                <textarea
                  id="features-description"
                  value={featuresDescription}
                  onChange={(e) => setFeaturesDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Category Ordering Section */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-100">Category Display Order</h3>
              <p className="text-xs text-neutral-400">
                Arrange the order of categories displayed in the homepage bento grid. Use the Up (↑) and Down (↓) buttons to move categories.
              </p>
              
              <div className="space-y-2 max-w-xl">
                {featuresTilesOrder.map((name, index) => (
                  <div 
                    key={name} 
                    className="flex items-center justify-between border border-white/5 rounded-xl p-3 bg-neutral-900/30 hover:border-white/10 transition-all animate-fade-in"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-neutral-500 w-5">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {name}
                      </span>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          const nextOrder = [...featuresTilesOrder];
                          const temp = nextOrder[index];
                          nextOrder[index] = nextOrder[index - 1];
                          nextOrder[index - 1] = temp;
                          setFeaturesTilesOrder(nextOrder);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={index === featuresTilesOrder.length - 1}
                        onClick={() => {
                          const nextOrder = [...featuresTilesOrder];
                          const temp = nextOrder[index];
                          nextOrder[index] = nextOrder[index + 1];
                          nextOrder[index + 1] = temp;
                          setFeaturesTilesOrder(nextOrder);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tile Content Section */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-100">Tile Content (Video, Heading &amp; Description)</h3>
              <p className="text-xs text-neutral-400">
                Customize the background video, heading, and description shown on each bento grid tile.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuresTiles.map((tile, idx) => (
                  <div key={tile.key} className="border border-white/10 rounded-3xl p-5 bg-neutral-950/40 space-y-4 shadow-inner">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">
                      {tile.key}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1 flex flex-col items-center">
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-square w-full flex items-center justify-center mb-2">
                          {tile.video ? (
                            <video
                              src={tile.video}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                              autoPlay
                            />
                          ) : (
                            <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider">No Video</span>
                          )}
                        </div>

                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleTileVideoUpload(idx, e.target.files?.[0])}
                          disabled={uploadingTileVideo[idx] || saving}
                          className="hidden"
                          id={`tile-video-input-${idx}`}
                        />
                        <label
                          htmlFor={`tile-video-input-${idx}`}
                          className="w-full px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer text-center transition-all"
                        >
                          {uploadingTileVideo[idx] ? "Uploading…" : "Upload Video"}
                        </label>
                      </div>

                      <div className="sm:col-span-2 space-y-3">
                        <div>
                          <label htmlFor={`tile-heading-${idx}`} className="block text-[9px] uppercase font-black tracking-[0.2em] text-neutral-500 mb-1">Heading</label>
                          <input
                            id={`tile-heading-${idx}`}
                            type="text"
                            value={tile.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFeaturesTiles((prev) => {
                                const next = [...prev];
                                next[idx] = { ...next[idx], name: val };
                                return next;
                              });
                            }}
                            required
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                          />
                        </div>
                        <div>
                          <label htmlFor={`tile-desc-${idx}`} className="block text-[9px] uppercase font-black tracking-[0.2em] text-neutral-500 mb-1">Description</label>
                          <textarea
                            id={`tile-desc-${idx}`}
                            value={tile.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFeaturesTiles((prev) => {
                                const next = [...prev];
                                next[idx] = { ...next[idx], desc: val };
                                return next;
                              });
                            }}
                            required
                            rows={4}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <>
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
              <h2 className="text-md font-bold uppercase tracking-wider text-blue-50 border-b border-white/5 pb-3">Stats Section Copy & Background Image</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="stats-subtitle" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Stats Subtitle
                  </label>
                  <input
                    id="stats-subtitle"
                    type="text"
                    value={statsSubtitle}
                    onChange={(e) => setStatsSubtitle(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="stats-title" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Stats Title
                  </label>
                  <input
                    id="stats-title"
                    type="text"
                    value={statsTitle}
                    onChange={(e) => setStatsTitle(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Background Cover Image
                  </label>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 rounded-2xl border border-white/5 bg-neutral-900/30">
                    <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-video w-full md:w-48 max-w-xs h-28 flex items-center justify-center">
                      {statsImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={statsImageUrl}
                          alt="Stats Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">No Image</span>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStatsImageUpload(e.target.files?.[0])}
                        disabled={uploadingStatsImage || saving}
                        className="block w-full text-xs text-neutral-400 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-white/10 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 file:transition-all"
                      />
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
                        Suggested background image. Max file size: 5MB.
                      </p>
                      {uploadingStatsImage && (
                        <p className="text-[10px] text-blue-400 animate-pulse font-bold uppercase tracking-wider">Uploading cover image...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
              <h2 className="text-md font-bold uppercase tracking-wider text-blue-50 border-b border-white/5 pb-3">Stat Counters (Max 3 Items)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsItems.map((item, idx) => (
                  <div key={idx} className="border border-white/5 rounded-2xl p-4 bg-neutral-900/30 space-y-4">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">Counter {idx + 1}</span>
                    <div>
                      <label htmlFor={`stats-val-${idx}`} className="block text-[9px] uppercase font-black tracking-[0.2em] text-neutral-500 mb-1">Value (e.g. 80+)</label>
                      <input
                        id={`stats-val-${idx}`}
                        type="text"
                        value={item.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStatsItems((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], value: val };
                            return next;
                          });
                        }}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label htmlFor={`stats-label-${idx}`} className="block text-[9px] uppercase font-black tracking-[0.2em] text-neutral-500 mb-1">Label (e.g. Projects)</label>
                      <input
                        id={`stats-label-${idx}`}
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStatsItems((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], label: val };
                            return next;
                          });
                        }}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "story" && (
          <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
            <h2 className="text-md font-bold uppercase tracking-wider text-blue-50 border-b border-white/5 pb-3">Story Section Settings</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="story-subtitle" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                  Story Subtitle
                </label>
                <input
                  id="story-subtitle"
                  type="text"
                  value={storySubtitle}
                  onChange={(e) => setStorySubtitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70">
                  Story Title (Line by Line)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="story-title-l1" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 1</label>
                    <input
                      id="story-title-l1"
                      type="text"
                      value={storyTitleL1}
                      onChange={(e) => setStoryTitleL1(e.target.value)}
                      placeholder="e.g. The story of"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="story-title-l2" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 2</label>
                    <input
                      id="story-title-l2"
                      type="text"
                      value={storyTitleL2}
                      onChange={(e) => setStoryTitleL2(e.target.value)}
                      placeholder="e.g. generations"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="story-title-l3" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 3 (Optional)</label>
                    <input
                      id="story-title-l3"
                      type="text"
                      value={storyTitleL3}
                      onChange={(e) => setStoryTitleL3(e.target.value)}
                      placeholder="Optional Line 3"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="story-description" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                  Story Description Paragraph
                </label>
                <textarea
                  id="story-description"
                  value={storyDescription}
                  onChange={(e) => setStoryDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label htmlFor="story-btn-title" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                  Button Action Title
                </label>
                <input
                  id="story-btn-title"
                  type="text"
                  value={storyButtonTitle}
                  onChange={(e) => setStoryButtonTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6">
            <h2 className="text-md font-bold uppercase tracking-wider text-blue-50 border-b border-white/5 pb-3">Contact Banner Section</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-subtitle" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                  Contact Subtitle
                </label>
                <input
                  id="contact-subtitle"
                  type="text"
                  value={contactSubtitle}
                  onChange={(e) => setContactSubtitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label htmlFor="contact-btn-title" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                  Contact Button Label
                </label>
                <input
                  id="contact-btn-title"
                  type="text"
                  value={contactButtonTitle}
                  onChange={(e) => setContactButtonTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70">
                  Contact Banner Title (Line by Line)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="contact-title-l1" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 1</label>
                    <input
                      id="contact-title-l1"
                      type="text"
                      value={contactTitleL1}
                      onChange={(e) => setContactTitleL1(e.target.value)}
                      placeholder="e.g. Let's build the"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-title-l2" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 2</label>
                    <input
                      id="contact-title-l2"
                      type="text"
                      value={contactTitleL2}
                      onChange={(e) => setContactTitleL2(e.target.value)}
                      placeholder="e.g. new era of"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-title-l3" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 3</label>
                    <input
                      id="contact-title-l3"
                      type="text"
                      value={contactTitleL3}
                      onChange={(e) => setContactTitleL3(e.target.value)}
                      placeholder="e.g. marbles together"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                  Avatar / Cover Image
                </label>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 rounded-2xl border border-white/5 bg-neutral-900/30">
                  <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-square w-24 h-24 flex items-center justify-center">
                    {contactImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={contactImageUrl}
                        alt="Contact Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">No Image</span>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleContactImageUpload(e.target.files?.[0])}
                      disabled={uploadingContactImage || saving}
                      className="block w-full text-xs text-neutral-400 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-white/10 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 file:transition-all"
                    />
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
                      Suggested: Square clip-masked image. Max file size: 5MB.
                    </p>
                    {uploadingContactImage && (
                      <p className="text-[10px] text-blue-400 animate-pulse font-bold uppercase tracking-wider">Uploading cover image...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-8">
            {/* Team Settings Card */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-md font-bold uppercase tracking-wider text-blue-50">Team Section General Settings</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70">Section Visible:</span>
                  <input
                    type="checkbox"
                    checked={teamVisible}
                    onChange={(e) => setTeamVisible(e.target.checked)}
                    className="rounded border-white/10 bg-white/5 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="team-subtitle" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Team Subtitle
                  </label>
                  <input
                    id="team-subtitle"
                    type="text"
                    value={teamSubtitle}
                    onChange={(e) => setTeamSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70">
                    Team Section Title (Line by Line)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="team-title-l1" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 1</label>
                      <input
                        id="team-title-l1"
                        type="text"
                        value={teamTitleL1}
                        onChange={(e) => setTeamTitleL1(e.target.value)}
                        placeholder="e.g. MEET THE"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="team-title-l2" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 2</label>
                      <input
                        id="team-title-l2"
                        type="text"
                        value={teamTitleL2}
                        onChange={(e) => setTeamTitleL2(e.target.value)}
                        placeholder="e.g. TEAM"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="team-title-l3" className="block text-[9px] uppercase text-neutral-500 mb-1">Line 3 (Optional)</label>
                      <input
                        id="team-title-l3"
                        type="text"
                        value={teamTitleL3}
                        onChange={(e) => setTeamTitleL3(e.target.value)}
                        placeholder="Optional Line 3"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members List Card */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-md font-bold uppercase tracking-wider text-blue-50">Team Members</h2>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="rounded-xl border border-blue-500 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-200 hover:bg-blue-500 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  + Add Member
                </button>
              </div>

              {teamMembers.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl bg-black/20">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1">No Team Members Configured</p>
                  <p className="text-[10px] text-neutral-600">Click the button above to add your first team member.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="border border-white/10 rounded-3xl p-5 bg-neutral-950/40 space-y-4 shadow-inner relative flex flex-col justify-between">
                      <button
                        type="button"
                        onClick={() => removeTeamMember(idx)}
                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer"
                        title="Remove Member"
                      >
                        ×
                      </button>
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Member #{idx + 1}</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-1 flex flex-col items-center">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-square w-24 h-24 flex items-center justify-center mb-2">
                              {member.photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={member.photo}
                                  alt={`Preview of ${member.name || 'member'}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider">No Photo</span>
                              )}
                            </div>
                            
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleMemberPhotoUpload(idx, e.target.files?.[0])}
                              disabled={uploadingMemberPhoto[idx] || saving}
                              className="hidden"
                              id={`member-photo-input-${idx}`}
                            />
                            <div className="flex gap-1.5 w-full justify-center">
                              <label
                                htmlFor={`member-photo-input-${idx}`}
                                className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer text-center flex-1 transition-all"
                              >
                                {uploadingMemberPhoto[idx] ? "Uploading…" : "Upload"}
                              </label>
                              {member.photo && (
                                <button
                                  type="button"
                                  onClick={() => removeMemberPhotoAt(idx)}
                                  className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="sm:col-span-2 space-y-3">
                            <div>
                              <label htmlFor={`member-name-${idx}`} className="block text-[9px] uppercase font-black tracking-[0.2em] text-neutral-500 mb-1">Name</label>
                              <input
                                id={`member-name-${idx}`}
                                type="text"
                                value={member.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTeamMembers((prev) => {
                                    const next = [...prev];
                                    next[idx] = { ...next[idx], name: val };
                                    return next;
                                  });
                                }}
                                required
                                placeholder="e.g. Abdul"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                              />
                            </div>
                            <div>
                              <label htmlFor={`member-pos-${idx}`} className="block text-[9px] uppercase font-black tracking-[0.2em] text-neutral-500 mb-1">Position / Role</label>
                              <input
                                id={`member-pos-${idx}`}
                                type="text"
                                value={member.position}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTeamMembers((prev) => {
                                    const next = [...prev];
                                    next[idx] = { ...next[idx], position: val };
                                    return next;
                                  });
                                }}
                                required
                                placeholder="e.g. Master Carver"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="space-y-8">
            {/* Testimonials Settings Card */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-md font-bold uppercase tracking-wider text-blue-50">Testimonials Section General Settings</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70">Section Visible:</span>
                  <input
                    type="checkbox"
                    checked={testimonialsVisible}
                    onChange={(e) => setTestimonialsVisible(e.target.checked)}
                    className="rounded border-white/10 bg-white/5 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="testimonials-subtitle" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Testimonials Subtitle
                  </label>
                  <input
                    id="testimonials-subtitle"
                    type="text"
                    value={testimonialsSubtitle}
                    onChange={(e) => setTestimonialsSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="testimonials-title" className="block text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70 mb-2">
                    Testimonials Title
                  </label>
                  <input
                    id="testimonials-title"
                    type="text"
                    value={testimonialsTitle}
                    onChange={(e) => setTestimonialsTitle(e.target.value)}
                    placeholder="e.g. TESTIMONIALS"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-blue-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials List Card */}
            <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-md font-bold uppercase tracking-wider text-blue-50">Testimonials</h2>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    {testimonialsItems.length} / 15
                  </span>
                  <button
                    type="button"
                    onClick={addTestimonial}
                    disabled={testimonialsItems.length >= 15}
                    className="rounded-xl border border-blue-500 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-200 hover:bg-blue-500 hover:text-white transition-all cursor-pointer shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    + Add Testimonial
                  </button>
                </div>
              </div>

              {testimonialsItems.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl bg-black/20">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1">No Testimonials Configured</p>
                  <p className="text-[10px] text-neutral-600">Click the button above to add your first testimonial.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonialsItems.map((item, idx) => (
                    <div key={idx} className="border border-white/10 rounded-3xl p-5 bg-neutral-950/40 space-y-4 shadow-inner relative flex flex-col justify-between">
                      <button
                        type="button"
                        onClick={() => removeTestimonial(idx)}
                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer"
                        title="Remove Testimonial"
                      >
                        ×
                      </button>
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Testimonial #{idx + 1}</span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-1 flex flex-col items-center">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[9/16] w-24 flex items-center justify-center mb-2">
                              {item.video ? (
                                <video
                                  src={item.video}
                                  className="w-full h-full object-cover"
                                  muted
                                  loop
                                  playsInline
                                  autoPlay
                                />
                              ) : (
                                <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider">No Video</span>
                              )}
                            </div>

                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleTestimonialVideoUpload(idx, e.target.files?.[0])}
                              disabled={uploadingTestimonialVideo[idx] || saving}
                              className="hidden"
                              id={`testimonial-video-input-${idx}`}
                            />
                            <div className="flex gap-1.5 w-full justify-center">
                              <label
                                htmlFor={`testimonial-video-input-${idx}`}
                                className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer text-center flex-1 transition-all"
                              >
                                {uploadingTestimonialVideo[idx] ? "Uploading…" : "Upload"}
                              </label>
                              {item.video && (
                                <button
                                  type="button"
                                  onClick={() => removeTestimonialVideoAt(idx)}
                                  className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="sm:col-span-2 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label htmlFor={`testimonial-name-${idx}`} className="block text-[9px] uppercase font-black tracking-[0.2em] text-neutral-500 mb-1">Name</label>
                                <input
                                  id={`testimonial-name-${idx}`}
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setTestimonialsItems((prev) => {
                                      const next = [...prev];
                                      next[idx] = { ...next[idx], name: val };
                                      return next;
                                    });
                                  }}
                                  placeholder="e.g. Rohan Sharma"
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                />
                              </div>
                              <div>
                                <label htmlFor={`testimonial-role-${idx}`} className="block text-[9px] uppercase font-black tracking-[0.2em] text-neutral-500 mb-1">Role / Location</label>
                                <input
                                  id={`testimonial-role-${idx}`}
                                  type="text"
                                  value={item.role}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setTestimonialsItems((prev) => {
                                      const next = [...prev];
                                      next[idx] = { ...next[idx], role: val };
                                      return next;
                                    });
                                  }}
                                  placeholder="e.g. Mumbai, Maharashtra"
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                />
                              </div>
                            </div>
                            {!item.video && (
                              <p className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">
                                A video is required for this testimonial to appear on the homepage.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || uploading.some(Boolean) || uploadingAboutImage || uploadingTrail.some(Boolean) || uploadingStatsImage || uploadingContactImage || uploadingMemberPhoto.some(Boolean) || uploadingTestimonialVideo.some(Boolean)}
            className="rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all px-6 py-3.5 text-xs font-black uppercase tracking-wider cursor-pointer disabled:opacity-50 shadow-lg"
          >
            {saving ? "Saving Changes…" : "Save Homepage Settings"}
          </button>
        </div>
      </form>
    </main>
  );
}
