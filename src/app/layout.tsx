import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import '../app/styles/global.css'
import ConversationalInput from '../components/ai/ConversationalInput/ConversationalInput'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <div className="flex flex-col flex-1 w-full">
            <Navbar />
            <main className="h-full overflow-y-auto">
              <div className="container px-6 mx-auto grid">
                {children}
              </div>
            </main>
          </div>
        </div>

        <ConversationalInput />
      </body>
    </html>
  );
}