import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ClientLayout from '@/src/components/common/ClientLayout';
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";

// Force next.js to treat this route as server-side rendered
export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Wardrobe Wiz - Your AI-Powered Digital Wardrobe',
  description: 'Transform your closet into an endless source of perfectly coordinated outfits with Wardrobe Wiz. Upload just 5 photos to start getting AI-powered outfit recommendations!',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};

export default async function RootLayout({ children }) {
  const { currentUser } = await getAuthenticatedAppForUser();

  return (
    <html lang="en">
      <body>
        <ClientLayout user={currentUser?.toJSON()}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
