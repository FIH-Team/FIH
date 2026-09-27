import { Geist, Geist_Mono, Geist_Pixel } from 'next/font/google';

export const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const geistPixel = Geist_Pixel({
  subsets: ['latin'],
  variable: '--font-geist-pixel',
});

export { Geist, Geist_Mono, Geist_Pixel };
