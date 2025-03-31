import { ProfilePageClient } from "@/components/Profile/ProfilePage";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  return <ProfilePageClient userId={params.userId} />;
} 