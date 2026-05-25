import aboutHero from '../assets/about-hero.png';
import './AboutUs.css';

export default function AboutUs() {
  return (
    <div className="page-wrapper" id="page-about">
      {/* Page Header */}
      <section className="about-hero" id="about-hero">
        <div className="about-hero__bg">
          <img src={aboutHero} alt="" className="about-hero__bg-img" />
          <div className="about-hero__bg-overlay" />
        </div>
        <div className="about-hero__content container">
          <span className="badge badge-gold animate-fade-in-up delay-1">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
            About Us
          </span>
          <h1 className="about-hero__title animate-fade-in-up delay-2">
            About Gulf<span className="gold">Wings</span>3000
          </h1>
          <p className="about-hero__subtitle animate-fade-in-up delay-3">
            Your trusted companion in the world of finance, investments, and
            wealth-building knowledge since 2018.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section" id="who-we-are">
        <div className="container">
          <div className="about-content-grid">
            <div className="about-text">
              <span className="badge badge-gold">Who We Are</span>
              <h2>A Publication Built for Financial Empowerment</h2>
              <p>
                GulfWings3000 is a premium monthly finance magazine dedicated to
                delivering expert insights on investments, personal finance, wealth
                management, and economic developments. We serve as a bridge between
                complex financial markets and everyday individuals seeking to grow
                their wealth.
              </p>
              <p>
                Our editorial team comprises seasoned financial journalists,
                certified investment advisors, and market analysts who curate
                content that is both accessible and deeply insightful.
              </p>
            </div>
            <div className="about-values">
              {[
                { icon: 'verified', label: 'Trusted Research' },
                { icon: 'groups', label: '12,000+ Readers' },
                { icon: 'auto_stories', label: '50+ Editions' },
                { icon: 'emoji_events', label: '8 Years of Excellence' },
              ].map((v) => (
                <div className="about-value-chip glass" key={v.icon}>
                  <span className="material-symbols-outlined">{v.icon}</span>
                  <span>{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* Our Mission */}
      <section className="section" id="our-mission">
        <div className="container">
          <div className="section-header">
            <h2>Our Mission</h2>
            <p>
              We believe financial literacy is the foundation of individual and
              collective prosperity.
            </p>
            <span className="gold-line" />
          </div>
          <div className="mission-cards-grid">
            {[
              {
                icon: 'lightbulb',
                title: 'Educate',
                desc: 'Break down complex financial concepts into actionable knowledge accessible to every reader.',
              },
              {
                icon: 'explore',
                title: 'Discover',
                desc: 'Uncover money opportunities, emerging markets, and investment avenues before they become mainstream.',
              },
              {
                icon: 'rocket_launch',
                title: 'Empower',
                desc: 'Equip our readers with the tools and insights needed to make confident financial decisions.',
              },
            ].map((m) => (
              <div className="mission-card card" key={m.icon}>
                <div className="mission-card__icon-wrap">
                  <span className="material-symbols-outlined">{m.icon}</span>
                </div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* What We Cover */}
      <section className="section" id="what-we-cover">
        <div className="container">
          <div className="section-header">
            <h2>What We Cover</h2>
            <p>
              Comprehensive coverage across the financial landscape, curated for
              investors at every level.
            </p>
            <span className="gold-line" />
          </div>
          <div className="coverage-grid">
            {[
              { icon: 'trending_up', title: 'Investment Analysis', desc: 'In-depth stock market analysis, fund reviews, and portfolio strategy guides.' },
              { icon: 'account_balance_wallet', title: 'Personal Finance', desc: 'Budgeting, saving, debt management, and smart money habits for everyday life.' },
              { icon: 'real_estate_agent', title: 'Real Estate', desc: 'Property investment trends, REITs, and real estate market intelligence.' },
              { icon: 'currency_bitcoin', title: 'Digital Assets', desc: 'Cryptocurrency analysis, blockchain developments, and DeFi opportunities.' },
              { icon: 'public', title: 'Global Markets', desc: 'International economic developments, forex trends, and cross-border investing.' },
              { icon: 'shield', title: 'Wealth Protection', desc: 'Insurance, estate planning, tax optimization, and risk management strategies.' },
            ].map((c) => (
              <div className="coverage-item" key={c.icon}>
                <span className="material-symbols-outlined coverage-item__icon">{c.icon}</span>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
