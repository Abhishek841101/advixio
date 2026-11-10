
"use client";

export default function ContactAdvixio() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const interest = formData.get("interest") as string;
    const message = formData.get("message") as string;

    const whatsappMessage = `
Hello Advixio360!

I have a new enquiry from your website.

Name: ${name}
Phone: ${phone}
Email: ${email}
Looking For: ${interest}

Message:
${message}

Thank you.
    `.trim();

    const whatsappURL = `https://wa.me/918530955850?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="contact-advixio-section">
      <div className="contact-advixio-container">

        {/* Left Business Support Card */}
        <div className="contact-support-card">
          <div className="contact-support-icon">
            <span>◎</span>
          </div>

          <div className="contact-support-content">
            <span className="contact-support-badge">
              Business Support
            </span>

            <h2>
              Let's connect your business to the right opportunities.
            </h2>

            <p>
              Have a question, need help with your listing,
              or want to connect with our team?
            </p>

            <div className="contact-support-links">
              <a
                href="mailto:advixio12@gmail.com"
                className="contact-support-email"
              >
                <span>✉</span>
                advixio12@gmail.com
              </a>

              <a
                href="tel:+918530955850"
                className="contact-support-email"
              >
                <span>☎</span>
                +91 8530955850
              </a>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="contact-form-card">
          <div className="contact-form-heading">
            <h2>Contact Advixio360</h2>
            <p>
              Send us your details and our team can get back to you.
            </p>
          </div>

          <form
            className="contact-advixio-form"
            onSubmit={handleSubmit}
          >
            <div className="contact-form-fields">

              <div className="contact-form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-phone">Phone Number</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-interest">
                  I'm looking for
                </label>

                <select
                  id="contact-interest"
                  name="interest"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Buy Products">Buy Products</option>
                  <option value="Sell Products">Sell Products</option>
                  <option value="Supplier Listing">Supplier Listing</option>
                  <option value="Business Support">Business Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="contact-form-group contact-form-message">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell us how we can help"
                  rows={3}
                  required
                />
              </div>

            </div>

            <div className="contact-form-bottom">
              <p>
                Your details are used only to respond to your enquiry.
              </p>

              <button type="submit">
                Send Enquiry <span>→</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
