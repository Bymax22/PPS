import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import Header from './components/Header'
import Footer from './components/Footer'
import SessionProviderClient from './SessionProviderClient'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Progress Preparatory School | Quality Online Education in Zambia',
    template: '%s | Progress Preparatory School'
  },
  description: 'Zambia\'s premier online learning platform offering comprehensive education from Grade 1 to 12. Live virtual classes, expert teachers, and proven academic results.',
  keywords: [
    'Progress Preparatory School',
    'online school Zambia',
    'virtual learning Zambia',
    'Grade 1-12 online',
    'Zambia education',
    'online classes Zambia',
    'virtual school',
    'distance learning Zambia'
  ],
  authors: [{ name: 'Progress Preparatory School' }],
  creator: 'Progress Preparatory School',
  publisher: 'Progress Preparatory School',
  metadataBase: new URL('https://progresspreparatory.edu.zm'),
  openGraph: {
    type: 'website',
    locale: 'en_ZM',
    url: 'https://progresspreparatory.edu.zm',
    siteName: 'Progress Preparatory School',
    title: 'Progress Preparatory School | The Hallmark of Education',
    description: 'Zambia\'s premier online learning platform offering comprehensive education from Grade 1 to 12.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Progress Preparatory School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progress Preparatory School | The Hallmark of Excellence',
    description: 'Zambia\'s premier online learning platform offering comprehensive education from Grade 1 to 12.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0713FB',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} mobile-text`}>
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`font-sans antialiased bg-white text-[#161A38] min-h-screen flex flex-col overflow-x-hidden text-sm md:text-base mobile-stack`}>
        <SessionProviderClient>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#0713FB] text-white px-4 py-2 rounded-lg z-50 text-sm touch-button"
          >
            Skip to main content
          </a>

          <Header />
          
          {/* Main content with proper spacing for header and footer */}
          <main 
            id="main-content" 
            className="flex-1 flex flex-col w-full safe-top safe-bottom pt-16 md:pt-20 pb-4 md:pb-8"
            tabIndex={-1}
          >
            <div className="w-full mx-auto max-w-7xl mobile-full">
              {children}
            </div>
          </main>
          
          <Footer />
        </SessionProviderClient>

        {/* Loading indicator */}
        <div id="global-loading" className="fixed top-4 right-4 z-50 hidden">
          <div className="spinner w-6 h-6 border-2 border-[#0713FB]"></div>
        </div>

        {/* Toast container */}
        <div id="toast-container" className="fixed top-16 md:top-20 left-1/2 transform -translate-x-1/2 z-50 space-y-2 w-full max-w-md px-4 safe-top hide-scrollbar"></div>

        {/* Service Worker Registration with Mobile Optimizations */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
              
              // Enhanced mobile experience
              document.addEventListener('touchstart', function() {}, {passive: true});
              
              // Prevent zoom on double-tap
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  event.preventDefault();
                }
                lastTouchEnd = now;
              }, false);
              
              // Mobile font size adjustment
              function adjustForMobile() {
                if (window.innerWidth < 768) {
                  // Set base font size for mobile
                  document.documentElement.style.fontSize = '14px';
                  
                  // Adjust heading sizes on mobile
                  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                  headings.forEach(heading => {
                    if (!heading.classList.contains('mobile-adjusted')) {
                      const currentSize = parseInt(window.getComputedStyle(heading).fontSize);
                      if (currentSize > 28) {
                        heading.style.fontSize = Math.min(currentSize, 32) * 0.85 + 'px';
                        heading.classList.add('mobile-adjusted');
                      }
                    }
                  });
                  
                  // Make all buttons touch-friendly
                  const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary, a[role="button"]');
                  buttons.forEach(btn => {
                    if (btn.offsetHeight < 44) {
                      btn.style.minHeight = '44px';
                      btn.style.paddingTop = '12px';
                      btn.style.paddingBottom = '12px';
                    }
                  });
                  
                  // Ensure images don't overflow
                  const images = document.querySelectorAll('img');
                  images.forEach(img => {
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                  });
                  
                  // Add mobile class to body for CSS targeting
                  document.body.classList.add('is-mobile');
                } else {
                  document.documentElement.style.fontSize = '';
                  document.body.classList.remove('is-mobile');
                }
              }
              
              // Run on load and resize
              window.addEventListener('load', adjustForMobile);
              window.addEventListener('resize', adjustForMobile);
              window.addEventListener('orientationchange', adjustForMobile);
              
              // Initial adjustment
              setTimeout(adjustForMobile, 100);
            `,
          }}
        />
      </body>
    </html>
  )
}