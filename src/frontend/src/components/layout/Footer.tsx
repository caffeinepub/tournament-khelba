import { SiFacebook, SiX, SiInstagram, SiYoutube } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'tournament-khelba';

  return (
    <footer className="border-t border-cyan-500/20 bg-gray-900/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img 
              src="/assets/generated/tournament-khelba-logo.dim_400x120.png" 
              alt="Tournament Khelba" 
              className="h-12 mb-4"
            />
            <p className="text-gray-400 text-sm mb-2">
              Bangladesh's premier Free Fire tournament platform
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Presented by</span>
              <img 
                src="/assets/generated/code11-logo.dim_200x60.png" 
                alt="Code 11" 
                className="h-6"
              />
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-cyan-400 transition-colors">Tournaments</a></li>
              <li><a href="/leaderboard" className="hover:text-cyan-400 transition-colors">Leaderboard</a></li>
              <li><a href="/wallet" className="hover:text-cyan-400 transition-colors">Wallet</a></li>
              <li><a href="/profile" className="hover:text-cyan-400 transition-colors">Profile</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <SiFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <SiX className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <SiInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <SiYoutube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cyan-500/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} Tournament Khelba. All rights reserved.</p>
          <p>
            Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
