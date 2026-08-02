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
    ceo_message: sections.ceo_message.body || fallback.ceo_message,
    director_name: sections.ceo_message.directorName || fallback.director_name,
    director_title: sections.ceo_message.directorTitle || fallback.director_title,
    signature_img: sections.ceo_message.signatureImageUrl || fallback.signature_img,
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
