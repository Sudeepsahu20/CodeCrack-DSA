export const dynamic = 'force-dynamic';
import PlaylistsSection from "@/modules/profile/components/playlist-section";
import ProfileStats from "@/modules/profile/components/profile-stats";
import { getCurrentUserData } from "@/modules/profile/actions";
import UserInfoCard from "@/modules/profile/components/user-info-card";
import React from "react";
import SubmissionsHistory from "@/modules/profile/components/submission-history";
import SolvedProblems from "@/modules/profile/components/solved-problems";

const ProfilePage = async () => {
  const profileData = await getCurrentUserData();

  console.log(profileData);
  return (
    <div className="min-h-screen  py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <UserInfoCard userData={profileData} />

        <ProfileStats
          submissions={profileData.submissions}
          solvedCount={profileData.solvedProblems.length}
          playlistCount={profileData.playlists.length}
        />

        <SubmissionsHistory submissions={profileData.submissions} />

        <div className="grid  gap-8">
          <SolvedProblems solvedProblems={profileData.solvedProblems} /> 
         <PlaylistsSection playlists={profileData.playlists} />
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
