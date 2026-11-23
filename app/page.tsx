"use client";

import GolfSportClubHeaderLinks from "@/components/templates/golf-sport-club-landing-page-links/Golf Sport Club Header Links";
import CommunityLinks from "@/components/templates/golf-sport-club-landing-page-links/Community Links";
import FeaturesLinks from "@/components/templates/golf-sport-club-landing-page-links/Features Links";
import AboutUsLinks from "@/components/templates/golf-sport-club-landing-page-links/About Us Links";
import LevelsLinks from "@/components/templates/golf-sport-club-landing-page-links/Level Links";
import TeamLinks from "@/components/templates/golf-sport-club-landing-page-links/Team Links";
import FooterLinks from "@/components/templates/golf-sport-club-landing-page-links/Footer Links";

export default function Home() {
  return (
    <main className="min-h-screen">
      <GolfSportClubHeaderLinks />
      <CommunityLinks />
      <AboutUsLinks />
      <FeaturesLinks />
      <LevelsLinks />
      <TeamLinks />
      <FooterLinks />
    </main>
  );
}
