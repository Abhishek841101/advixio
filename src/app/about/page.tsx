
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero" id="about">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">A smarter way to do business</div>

              <h1>
                Find your next <span>business</span> connection.
              </h1>

              <p>
                One marketplace. More possibilities. Advixio360 brings buyers,
                products, and suppliers together so businesses can discover,
                showcase, and grow with confidence.
              </p>

              <div className="actions">
                <Link className="btn light" href="#how">
                  Explore how it works <b>↗</b>
                </Link>

                <Link className="btn ghost" href="#join">
                  Join our network
                </Link>
              </div>

              <div className="hero-proof">
                <span className="proof-line" />
                <span>Built to make business discovery simpler</span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="visual">
              <div className="visual-label">
                THE BUSINESS ECOSYSTEM <span>360°</span>
              </div>

              <div className="visual-backdrop" />
              <div className="big-number">
                360<span>°</span>
              </div>

              <div className="connection-line line-a" />
              <div className="connection-line line-b" />
              <div className="connection-line line-c" />

              <div className="mini-tile tile-product">
                <div className="tile-icon">▦</div>
                <strong>Products</strong>
                <small>Discover what you need</small>
              </div>

              <div className="mini-tile tile-supplier">
                <div className="tile-icon">▤</div>
                <strong>Suppliers</strong>
                <small>Meet trusted businesses</small>
              </div>

              <div className="mini-tile tile-buyer">
                <div className="tile-icon">⌘</div>
                <strong>Buyers</strong>
                <small>Find the right fit</small>
              </div>

              <div className="center-chip">
                <span className="chip-mark">A</span>
                <div>
                  <strong>Advixio360</strong>
                  <small>Business, connected.</small>
                </div>
              </div>

              <div className="visual-bottom">
                <span className="pulse" />
                DISCOVER <i>•</i> CONNECT <i>•</i> GROW
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats">
          <div className="wrap statsgrid">
            <div className="stat">
              <b>360°</b>
              <span>Complete business discovery</span>
            </div>

            <div className="stat">
              <b>One place</b>
              <span>Products, suppliers &amp; categories</span>
            </div>

            <div className="stat">
              <b>Pan-India</b>
              <span>Designed for businesses across India</span>
            </div>

            <div className="stat">
              <b>Opportunity</b>
              <span>Visibility and better discovery</span>
            </div>
          </div>
        </section>

        {/* About Story */}
        <section className="section">
          <div className="wrap story">
            <div className="art">
              <div className="hub">
                <div className="hubmain">A</div>

                <div className="hubnodes">
                  <div className="node">
                    <b>▧</b>
                    Product discovery
                  </div>

                  <div className="node">
                    <b>▤</b>
                    Supplier directory
                  </div>
                </div>
              </div>
            </div>

            <div className="copy">
              <div className="eyebrow">Who we are</div>

              <h2>
                Making business discovery simpler, clearer and more connected.
              </h2>

              <p>
                Finding the right supplier or product can take time. Businesses
                need useful information, a clear way to explore options, and a
                platform that helps them move from discovery to a business
                conversation.
              </p>

              <p>
                Advixio360 brings these experiences together in one marketplace.
                We’re building a digital space where businesses can present
                their products, buyers can explore relevant options, and
                connections can begin with greater ease.
              </p>

              <ul className="checks">
                <li>
                  <span className="tick">✓</span>
                  Designed around practical business needs
                </li>
                <li>
                  <span className="tick">✓</span>
                  Product and supplier discovery in one place
                </li>
                <li>
                  <span className="tick">✓</span>
                  Focused on accessibility, clarity and opportunity
                </li>
              </ul>

              <Link className="btn primary" href="#how">
                See how it works →
              </Link>
            </div>
          </div>
        </section>

        {/* Purpose, Vision and Mission */}
        <section className="section pale">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">What guides us</div>
              <h2>Our purpose, vision &amp; mission</h2>
              <p>
                We believe a better business ecosystem starts with better
                discovery and more meaningful connections.
              </p>
            </div>

            <div className="cards">
              <article className="card">
                <div className="ic">◎</div>
                <h3>Our purpose</h3>
                <p>
                  To make it easier for businesses to find products, discover
                  suppliers and identify opportunities that support their goals.
                </p>
              </article>

              <article className="card">
                <div className="ic">◉</div>
                <h3>Our vision</h3>
                <p>
                  To become a useful and accessible digital destination for
                  business discovery, product exploration and supplier
                  connections.
                </p>
              </article>

              <article className="card">
                <div className="ic">✓</div>
                <h3>Our mission</h3>
                <p>
                  To build a dependable marketplace experience that helps
                  businesses showcase offerings and helps buyers discover
                  relevant options with confidence.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section" id="how">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">Simple by design</div>
              <h2>How Advixio360 works</h2>
              <p>
                A clear path from exploring the marketplace to finding a
                business match.
              </p>
            </div>

            <div className="steps">
              <article className="step">
                <h3>Explore categories</h3>
                <p>
                  Browse business categories and discover products relevant to
                  your sourcing needs.
                </p>
              </article>

              <article className="step">
                <h3>Review offerings</h3>
                <p>
                  View product information and explore available supplier
                  listings.
                </p>
              </article>

              <article className="step">
                <h3>Find suppliers</h3>
                <p>
                  Discover business profiles, their locations and listed
                  product ranges.
                </p>
              </article>

              <article className="step">
                <h3>Connect &amp; move forward</h3>
                <p>
                  Begin a business enquiry and take the next step.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Connection Banner */}
        <section className="section pale">
          <div className="wrap">
            <div className="banner">
              <div>
                <h2>Business grows better through connection.</h2>
                <p>
                  Our platform is built around practical discovery and a
                  marketplace experience that keeps businesses moving.
                </p>
              </div>

              <div className="pills">
                <span className="pill">Clarity</span>
                <span className="pill">Accessibility</span>
                <span className="pill">Opportunity</span>
                <span className="pill">Connection</span>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="section">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">Who we serve</div>
              <h2>Built for the business community</h2>
              <p>
                Whether you’re looking for a product or showcasing your
                business, Advixio360 helps bring the marketplace closer.
              </p>
            </div>

            <div className="audiences">
              <article className="aud">
                <div className="ic">▥</div>
                <h3>Manufacturers &amp; suppliers</h3>
                <p>
                  Showcase products and make your business easier to discover.
                </p>
              </article>

              <article className="aud">
                <div className="ic">▤</div>
                <h3>Buyers &amp; sourcing teams</h3>
                <p>
                  Explore product options and find suppliers for your
                  requirements.
                </p>
              </article>

              <article className="aud">
                <div className="ic">♧</div>
                <h3>Small &amp; growing businesses</h3>
                <p>
                  Discover business opportunities and expand your product
                  network.
                </p>
              </article>

              <article className="aud">
                <div className="ic">◇</div>
                <h3>Trade &amp; industry</h3>
                <p>
                  Explore a shared digital space for products and business
                  connections.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="cta" id="join">
          <div className="wrap">
            <div className="ctabox">
              <div>
                <h2>Ready to discover what’s possible?</h2>
                <p>
                  Explore products, find suppliers and make Advixio360 part of
                  your business discovery journey.
                </p>
              </div>

              <Link className="btn light" href="/products">
                Explore the marketplace →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
