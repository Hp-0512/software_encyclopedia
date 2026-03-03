import React from "react";
import "../CSS/AboutUs.css";
import Header from "../components/Header";
import growth from "../assets/growth.jpg";
import analytics from "../assets/analytics.jpg";
import businesssolution from "../assets/business.jpg";
import foundation from "../assets/foundation.jpg";
import softwareresearch from "../assets/software.jpg";

const AboutUs = () => {
  return (
    <>
      <Header />
      <div className="about-container">
        {/* HERO SECTION */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>About Software Encyclopedia</h1>
            <p>
              Software Encyclopedia is a modern digital knowledge platform
              designed to simplify software discovery, evaluation, and
              decision-making. Our mission is to provide structured, verified,
              and deeply researched insights into the evolving world of software
              solutions.
            </p>
          </div>
        </section>

        {/* WHAT WE PROVIDE */}
        <section className="about-section">
          <h2>What We Provide</h2>

          <div className="provide-grid">
            <div className="provide-card">
              <img src={softwareresearch} alt="Software Research" />
              <div className="provide-content">
                <h3>Comprehensive Software Directory</h3>
                <p>
                  We offer an extensive and continuously expanding database of
                  software products across multiple industries including SaaS,
                  FinTech, AI tools, CRM systems, enterprise platforms,
                  productivity solutions, and developer utilities.
                </p>
                <p>
                  Each listing is categorized, structured, and optimized to help
                  users quickly understand functionality, target audience,
                  pricing models, and scalability.
                </p>
              </div>
            </div>

            <div className="provide-card">
              <img src={analytics} alt="Analytics" />
              <div className="provide-content">
                <h3>In-Depth Analysis & Comparisons</h3>
                <p>
                  Beyond simple listings, we provide detailed feature
                  breakdowns, side-by-side comparisons, and usability insights
                  that allow businesses and individuals to evaluate solutions
                  effectively.
                </p>
                <p>
                  Our structured evaluation process considers performance,
                  integration capability, security standards, customer support,
                  and long-term adaptability.
                </p>
              </div>
            </div>

            <div className="provide-card">
              <img src={businesssolution} alt="Business Solutions" />
              <div className="provide-content">
                <h3>Strategic Software Guidance</h3>
                <p>
                  We understand that selecting the right software is a strategic
                  decision. Software Encyclopedia provides guidance tailored to
                  startups, SMEs, and large enterprises.
                </p>
                <p>
                  Our goal is to reduce uncertainty, eliminate misinformation,
                  and empower confident, data-driven decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="about-section light-bg">
          <h2>Why Choose Software Encyclopedia?</h2>

          <div className="why-grid">
            <div className="why-card">
              <h3>Verified & Structured Information</h3>
              <p>
                Every software profile undergoes research and structured
                formatting to ensure clarity, consistency, and reliability.
              </p>
            </div>

            <div className="why-card">
              <h3>Clarity Over Complexity</h3>
              <p>
                We eliminate unnecessary technical jargon and present
                information in a user-friendly format that helps both technical
                and non-technical audiences.
              </p>
            </div>

            <div className="why-card">
              <h3>Continuous Updates</h3>
              <p>
                The technology ecosystem evolves rapidly. We continuously update
                listings, features, and industry coverage to reflect real-world
                changes and trends.
              </p>
            </div>

            <div className="why-card">
              <h3>User-Focused Experience</h3>
              <p>
                Designed with modern UI principles, our platform ensures smooth
                navigation, intuitive exploration, and efficient knowledge
                discovery.
              </p>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="mission-vision">
          <div className="mv-card mission">
            <div className="mv-content">
              <h2>Our Mission</h2>
              <p>
                Our mission is to build a centralized, trustworthy knowledge
                ecosystem where individuals and organizations can explore
                software solutions with confidence.
              </p>
              <p>
                We aim to simplify complexity, promote transparency, and create
                a structured digital encyclopedia that supports smarter
                technology decisions worldwide.
              </p>
            </div>
          </div>

          <div className="mv-card vision">
            <div className="mv-content">
              <h2>Our Vision</h2>
              <p>
                Our vision is to become the most trusted global reference point
                for software knowledge — a platform recognized for accuracy,
                depth, and innovation.
              </p>
              <p>
                We aspire to continuously evolve alongside the technology
                industry, expanding into advanced research, trend analysis, and
                intelligent discovery tools.
              </p>
            </div>
          </div>
        </section>

        {/* OUR JOURNEY */}
        <section className="about-section">
          <h2>Our Journey</h2>

          <div className="journey-item">
            <img src={foundation} alt="Foundation" />
            <div>
              <h3>Foundation & Vision</h3>
              <p>
                Software Encyclopedia was founded with a simple idea: create a
                structured, reliable platform that eliminates confusion in
                software selection.
              </p>
              <p>
                Recognizing the fragmentation in digital knowledge, we set out
                to organize and standardize software information.
              </p>
            </div>
          </div>

          <div className="journey-item">
            <img src={growth} alt="Growth" />
            <div>
              <h3>Growth & Expansion</h3>
              <p>
                As the platform evolved, we expanded our coverage across
                industries, introduced structured analysis frameworks, and
                enhanced user experience with modern design principles.
              </p>
              <p>
                Today, Software Encyclopedia continues to grow, driven by
                innovation and a commitment to quality.
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>500+</h3>
              <p>Verified Software Listings Across Industries</p>
            </div>

            <div className="stat-card">
              <h3>50+</h3>
              <p>Technology Categories & Industry Domains</p>
            </div>

            <div className="stat-card">
              <h3>10K+</h3>
              <p>Monthly Knowledge Seekers & Professionals</p>
            </div>

            <div className="stat-card">
              <h3>100%</h3>
              <p>Commitment to Accuracy & Structured Data</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
