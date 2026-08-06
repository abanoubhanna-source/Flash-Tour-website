import { NextResponse } from "next/server";
import fallback from "@/data/about.json";
import { getPublishedAboutContent } from "@/lib/cms/pages/public";

// Maps the CMS's 11 About sections onto the shape the public /about page
// renders. hero_intro's single `title` replaces the legacy title_part1/
// title_part2 split (title_part2 stays empty; the page renders one heading).
export async function GET() {
  const content = await getPublishedAboutContent();
  const sections = content?.sections;
  if (!sections) return NextResponse.json(fallback);

  return NextResponse.json({
    hero: {
      tag: sections.hero_intro.eyebrow || fallback.hero.tag,
      title_part1: sections.hero_intro.title || fallback.hero.title_part1,
      title_part2: "",
      desc: sections.hero_intro.body || fallback.hero.desc,
    },
    vision: sections.vision.body || fallback.vision,
    mission: sections.mission.body || fallback.mission,
    services: sections.services_summary.items.length
      ? { title: sections.services_summary.title || fallback.services.title, items: sections.services_summary.items }
      : fallback.services,
    languages: sections.languages.items.length
      ? { title: sections.languages.title || fallback.languages.title, items: sections.languages.items }
      : fallback.languages,
    flawless_process: sections.flawless_process.items.length
      ? { title: sections.flawless_process.title || fallback.flawless_process.title, items: sections.flawless_process.items }
      : fallback.flawless_process,
    experience: sections.experience.body
      ? { title: sections.experience.title, body: sections.experience.body, bullets: sections.experience.bullets, image: sections.experience.image.url || fallback.experience.image }
      : fallback.experience,
    work_process: sections.work_process.body
      ? { title: sections.work_process.title, body: sections.work_process.body, bullets: sections.work_process.bullets, image: sections.work_process.image.url || fallback.work_process.image, secondaryImage: sections.work_process.secondaryImage.url || fallback.work_process.secondaryImage }
      : fallback.work_process,
    ceo_message: sections.ceo_message.body || fallback.ceo_message,
    director_name: sections.ceo_message.directorName || fallback.director_name,
    director_title: sections.ceo_message.directorTitle || fallback.director_title,
    signature_img: sections.ceo_message.signatureImageUrl || fallback.signature_img,
    team_title: sections.team.title || fallback.team_title,
    team_body: sections.team.body || fallback.team_body,
    team_stats: sections.team.stats || fallback.team_stats,
    timeline: sections.expansion_journey.milestones.length
      ? sections.expansion_journey.milestones.map((milestone) => ({
          year: String(milestone.year),
          title: milestone.title,
          desc: milestone.desc,
          img: milestone.image.url || undefined,
        }))
      : fallback.timeline,
  });
}
