// app/(dashboard)/customer/profile/page.tsx
// Server Component - SEO Friendly

import { Metadata } from 'next';
import { ProfileForm } from './components/ProfileForm'; 
import { PasswordForm } from './components/PasswordForm';

export const metadata: Metadata = {
  title: 'My Profile | TechStore',
  description: 'Manage your account settings and preferences',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>

        {/* Password Change */}
        <div>
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}