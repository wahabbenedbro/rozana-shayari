import React, { useRef, useState } from 'react';
import { Share2, Download, Camera } from 'lucide-react';
import { PoemService } from './PoemService';

type Language = 'urdu' | 'hindi' | 'english';

interface Poem {
  id: string;
  urdu: string;
  hindi: string;
  english: string;
  author: {
    urdu: string;
    hindi: string;
    english: string;
  };
}

interface ShareButtonProps {
  poem: Poem;
  language: Language;
  date?: string;
}

export function ShareButton({ poem, language, date }: ShareButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getLanguageClass = (lang: Language) => {
    switch (lang) {
      case 'urdu':
        return { fontFamily: 'Noto Nastaliq Urdu', direction: 'rtl', align: 'center' };
      case 'hindi':
        return { fontFamily: 'Noto Sans Devanagari', direction: 'ltr', align: 'center' };
      case 'english':
        return { fontFamily: 'Playfair Display', direction: 'ltr', align: 'center' };
      default:
        return { fontFamily: 'Playfair Display', direction: 'ltr', align: 'center' };
    }
  };

  const trackShare = async (platform: string = 'unknown') => {
    try {
      await PoemService.trackShare(poem.id, platform);
    } catch (error) {
      console.error('Error tracking share:', error);
      // Don't block sharing if tracking fails
    }
  };

  const generatePoemImage = async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size for social media (1080x1080 for Instagram)
      canvas.width = 1080;
      canvas.height = 1080;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, '#faf9f6'); // ivory
      gradient.addColorStop(0.5, '#ffffff'); // white
      gradient.addColorStop(1, 'rgba(15, 76, 58, 0.05)'); // emerald-deep/5
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // Add subtle pattern
      ctx.fillStyle = 'rgba(212, 175, 55, 0.08)'; // gold-accent
      for (let x = 0; x < 1080; x += 40) {
        for (let y = 0; y < 1080; y += 40) {
          ctx.beginPath();
          ctx.arc(x + 10, y + 10, 1, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + 30, y + 30, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Draw decorative border
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 50, 980, 980);

      // App title
      ctx.fillStyle = '#2d3748';
      ctx.font = 'bold 48px serif';
      ctx.textAlign = 'center';
      ctx.fillText('روزانہ شاعری', 540, 150);
      
      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#4a5568';
      ctx.fillText('Daily Poetry for the Soul', 540, 190);

      // Date
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#4a5568';
      ctx.globalAlpha = 0.7;
      ctx.fillText(date || 'Saturday, August 16, 2025', 540, 230);
      ctx.globalAlpha = 1;

      // Decorative line
      const lineGradient = ctx.createLinearGradient(340, 260, 740, 260);
      lineGradient.addColorStop(0, 'transparent');
      lineGradient.addColorStop(0.5, '#d4af37');
      lineGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = lineGradient;
      ctx.fillRect(340, 260, 400, 2);

      // Poem text
      const poemText = poem[language];
      const langStyle = getLanguageClass(language);
      
      ctx.fillStyle = '#2d3748';
      ctx.font = '36px serif';
      ctx.textAlign = 'center'; // Always center text for all languages including Urdu
      
      const lines = poemText.split('\n');
      const startY = 350;
      const lineHeight = 60;
      
      lines.forEach((line, index) => {
        const y = startY + (index * lineHeight);
        // Center all text including Urdu
        ctx.fillText(line, 540, y);
      });

      // Author
      ctx.font = '24px serif';
      ctx.fillStyle = '#4a5568';
      ctx.globalAlpha = 0.8;
      ctx.textAlign = 'center';
      const authorY = startY + (lines.length * lineHeight) + 60;
      ctx.fillText(`— ${poem.author[language]}`, 540, authorY);
      ctx.globalAlpha = 1;

      // Watermark/Logo
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 28px serif';
      ctx.textAlign = 'center';
      ctx.fillText('Rozana Shayari App', 540, 950);
      
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#4a5568';
      ctx.globalAlpha = 0.6;
      ctx.fillText('Download from App Store', 540, 980);
      ctx.globalAlpha = 1;

      // Convert to data URL
      const dataURL = canvas.toDataURL('image/png', 0.9);
      resolve(dataURL);
    });
  };

  const handleShare = async () => {
    setIsGenerating(true);
    
    try {
      const imageDataURL = await generatePoemImage();
      
      // Convert data URL to blob
      const response = await fetch(imageDataURL);
      const blob = await response.blob();
      
      if (navigator.share && navigator.canShare({ files: [new File([blob], 'poem.png', { type: 'image/png' })] })) {
        // Use Web Share API if supported
        await navigator.share({
          title: 'Daily Poetry from Rozana Shayari',
          text: `${poem[language]} — ${poem.author[language]}`,
          files: [new File([blob], 'rozana-shayari-poem.png', { type: 'image/png' })]
        });
        
        // Track share as 'native-share'
        await trackShare('native-share');
      } else {
        // Fallback: download the image
        const link = document.createElement('a');
        link.download = 'rozana-shayari-poem.png';
        link.href = imageDataURL;
        link.click();
        
        // Track share as 'download'
        await trackShare('download');
      }
    } catch (error) {
      console.error('Error sharing poem:', error);
      
      // If sharing fails, still try to track it and offer a text share
      await trackShare('error-fallback');
      
      // Fallback to text sharing
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Daily Poetry from Rozana Shayari',
            text: `${poem[language]}\n\n— ${poem.author[language]}\n\nFrom Rozana Shayari - Daily Poetry App`,
          });
          await trackShare('text-share');
        } catch (shareError) {
          console.error('Text share also failed:', shareError);
          // Last resort: copy to clipboard
          try {
            await navigator.clipboard.writeText(
              `${poem[language]}\n\n— ${poem.author[language]}\n\nFrom Rozana Shayari - Daily Poetry App`
            );
            alert('Poem copied to clipboard!');
            await trackShare('clipboard');
          } catch (clipboardError) {
            console.error('Clipboard copy failed:', clipboardError);
            alert('Unable to share poem. Please try again.');
          }
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSocialShare = async (platform: string) => {
    const poemText = encodeURIComponent(`${poem[language]}\n\n— ${poem.author[language]}\n\nFrom Rozana Shayari - Daily Poetry App`);
    const appUrl = encodeURIComponent(window.location.origin);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${poemText}&url=${appUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${poemText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${poemText}%20${appUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${appUrl}&text=${poemText}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    await trackShare(platform);
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-3">
        {/* Primary Share Button */}
        <button
          onClick={handleShare}
          disabled={isGenerating}
          className="
            group relative flex items-center space-x-2 px-6 py-3
            bg-gradient-to-r from-emerald-deep to-midnight-blue
            text-white rounded-full shadow-lg
            hover:shadow-xl transition-all duration-300 ease-out
            transform hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isGenerating ? (
            <>
              <Camera size={18} className="animate-pulse" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Share2 size={18} />
              <span>Share Poem</span>
            </>
          )}
          
          {/* Glowing effect */}
          <div className="
            absolute inset-0 rounded-full
            bg-gradient-to-r from-gold-accent/30 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            animate-pulse
          "></div>
        </button>

        {/* Social Media Quick Share Buttons */}
        <div className="flex space-x-2 opacity-60 hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleSocialShare('whatsapp')}
            className="p-2 text-green-600 hover:text-green-700 transition-colors"
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.506z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialShare('twitter')}
            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            title="Share on Twitter"
            aria-label="Share on Twitter"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialShare('facebook')}
            className="p-2 text-blue-700 hover:text-blue-800 transition-colors"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialShare('telegram')}
            className="p-2 text-blue-400 hover:text-blue-500 transition-colors"
            title="Share on Telegram"
            aria-label="Share on Telegram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </button>
        </div>
        
        <p className="text-xs text-text-secondary opacity-60 text-center">
          Share this beautiful poetry with your loved ones
        </p>
      </div>
      
      {/* Hidden canvas for image generation */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </>
  );
}