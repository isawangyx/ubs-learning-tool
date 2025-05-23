import { useEffect, useState } from 'react';
import { fetchProfile, ProfilePayload } from '../api/profile';

export default function Dashboard() {
//   const [profile, setProfile] = useState<ProfilePayload | null>(null);

//   useEffect(() => {
//     fetchProfile().then(res => setProfile(res.data));
//   }, []);

//   if (!profile) return <div>Loading…</div>;

  return (
    <div>
      <h1>Welcome back!</h1>
      {/* <pre>{JSON.stringify(profile, null, 2)}</pre> */}
    </div>
  );
}
