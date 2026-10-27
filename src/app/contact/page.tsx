"use client";

import Link from "next/link";
import { useState } from "react";

const EMAIL = "advixio12@gmail.com";
const PHONE = "+918530955850";
const WHATSAPP = "918530955850";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Website enquiry from ${form.name}`
    );

    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <main className="contact-page min-h-screen overflow-hidden bg-[#080B14] text-white">
      <style jsx>{`
        .contact-page {
          --accent: #8b7cff;
          --muted: #a4a9bd;
        }

        .contact-grid {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 95%);
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(18px, -22px, 0);
          }
        }

        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes glow {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 0.85;
          }
        }

        .contact-drift {
          animation: drift 8s ease-in-out infinite;
        }

        .contact-appear {
          animation: appear 0.8s ease-out both;
        }

        .contact-appear-delay {
          animation: appear 0.8s 0.16s ease-out both;
        }

        .contact-appear-delay-2 {
          animation: appear 0.8s 0.3s ease-out both;
        }

        .contact-orbit {
          animation: orbit 24s linear infinite;
        }

        .contact-glow {
          animation: glow 5s ease-in-out infinite;
        }

        .contact-card {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.075),
            rgba(255, 255, 255, 0.025)
          );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .contact-link {
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .contact-link:hover {
          transform: translateY(-4px);
          border-color: rgba(139, 124, 255, 0.65);
          background: rgba(139, 124, 255, 0.09);
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-drift,
          .contact-appear,
          .contact-appear-delay,
          .contact-appear-delay-2,
          .contact-orbit,
          .contact-glow {
            animation: none !important;
          }

          .contact-link {
            transition: none;
          }
        }
          
.contact-message-intro {
  animation: contactIntro 750ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.contact-message-card {
  animation: contactCardIntro 850ms 100ms
    cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.contact-field {
  animation: fieldIntro 600ms ease-out both;
}

.contact-field:nth-child(1) {
  animation-delay: 150ms;
}

.contact-field:nth-child(2) {
  animation-delay: 220ms;
}

.contact-field:nth-child(3) {
  animation-delay: 290ms;
}

@keyframes contactIntro {
  from {
    opacity: 0;
    transform: translate3d(-22px, 16px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes contactCardIntro {
  from {
    opacity: 0;
    transform: translate3d(22px, 22px, 0) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes fieldIntro {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-message-intro,
  .contact-message-card,
  .contact-field {
    animation: none !important;
  }
}

      `}</style>

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] overflow-hidden">
        <div className="contact-grid absolute inset-0" />

        <div className="contact-drift contact-glow absolute -left-36 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[110px]" />

        <div className="contact-drift absolute -right-32 top-36 h-[430px] w-[430px] rounded-full bg-indigo-500/20 blur-[120px]" />

        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:px-10 lg:pb-28">
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="m15 18-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Back to Advixio
          </Link>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium tracking-wide text-white/60">
            CONTACT / 01
          </span>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="contact-appear relative z-10">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-300" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.17em] text-violet-200">
                Let&apos;s connect
              </span>
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">
              Great things
              <br />
              start with
              <br />
              <span className="bg-gradient-to-r from-[#B6A8FF] via-[#9182FF] to-[#71C8FF] bg-clip-text text-transparent">
                a conversation.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#A4A9BD] sm:text-lg">
              Have a business idea, a question, or something we can help with?
              Reach the Advixio team directly. No complicated process, just a
              conversation.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Advixio team, I would like to discuss a business enquiry.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#8B7CFF] px-5 py-3 text-sm font-semibold text-[#080B14] transition duration-300 hover:-translate-y-1 hover:bg-[#A99EFF] hover:shadow-[0_12px_40px_rgba(139,124,255,0.25)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M20 11.5a8.4 8.4 0 0 1-12.4 7.4L4 20l1.2-3.5A8.4 8.4 0 1 1 20 11.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 8.5c.3-.6.6-.6 1-.6.2 0 .4 0 .5.4l.7 1.6c.1.3 0 .5-.2.7l-.5.6c.6 1.2 1.5 2.1 2.7 2.7l.6-.5c.2-.2.4-.3.7-.2l1.6.7c.4.1.4.3.4.5 0 .4 0 .7-.6 1-.5.3-1.2.3-2.1 0-2.4-.8-4.8-3.2-5.6-5.6-.3-.9-.3-1.6 0-2.1Z"
                    fill="currentColor"
                  />
                </svg>
                Start a conversation
                <span className="transition group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </a>

              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.08]"
              >
                Email our team
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17 17 7M7 7h10v10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/45">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Direct contact options
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
                Built for business enquiries
              </span>
            </div>
          </div>

          {/* Distinct visual composition */}
          <div className="contact-appear-delay relative mx-auto flex min-h-[400px] w-full max-w-[480px] items-center justify-center sm:min-h-[480px]">
            <div className="contact-orbit absolute h-[300px] w-[300px] rounded-full border border-dashed border-violet-300/20 sm:h-[390px] sm:w-[390px]" />

            <div className="absolute h-[260px] w-[260px] rounded-full border border-indigo-300/15 sm:h-[330px] sm:w-[330px]" />

            <div className="contact-glow absolute h-64 w-64 rounded-full bg-violet-600/20 blur-[80px] sm:h-80 sm:w-80" />

            <div className="contact-card relative z-10 flex h-56 w-56 flex-col items-center justify-center rounded-[36px] border border-white/15 shadow-[0_0_100px_rgba(139,124,255,0.14)] sm:h-64 sm:w-64">
              <div className="absolute inset-3 rounded-[28px] border border-white/[0.06]" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#A99AFF] to-[#6F61E8] text-[#080B14] shadow-[0_10px_50px_rgba(139,124,255,0.3)] sm:h-24 sm:w-24">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-10 w-10 sm:h-12 sm:w-12"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="m5 6 7 6 7-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="relative mt-5 text-lg font-semibold tracking-tight">
                Let&apos;s talk
              </p>
              <p className="relative mt-1 text-xs text-white/45">
                Advixio · Business connections
              </p>
            </div>

            {/* Floating email card */}
            <a
              href={`mailto:${EMAIL}`}
              className="contact-card contact-link absolute left-0 top-12 z-20 flex max-w-[245px] items-center gap-3 rounded-2xl border border-white/10 p-3.5 shadow-xl sm:left-[-8px] sm:top-14"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="m5 6 7 6 7-6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-wider text-white/45">
                  Drop us a line
                </span>
                <span className="mt-1 block truncate text-xs font-semibold">
                  {EMAIL}
                </span>
              </span>
            </a>

            {/* Floating call card */}
            <a
              href={`tel:${PHONE}`}
              className="contact-card contact-link absolute bottom-12 right-0 z-20 flex items-center gap-3 rounded-2xl border border-white/10 p-3.5 shadow-xl sm:bottom-14 sm:right-[-4px]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M7 3.8h3l1.5 4-2 1.5a15 15 0 0 0 5.2 5.2l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C10 18 6 14 5 5.8c0-1.1.9-2 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-wider text-white/45">
                  Give us a call
                </span>
                <span className="mt-1 block text-sm font-semibold">
                  +91 8530955850
                </span>
              </span>
            </a>

            <div className="absolute right-8 top-7 hidden h-3 w-3 rounded-full bg-sky-300 shadow-[0_0_24px_rgba(125,211,252,0.8)] sm:block" />
            <div className="absolute bottom-10 left-10 hidden h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_20px_rgba(167,139,250,0.8)] sm:block" />
          </div>
        </div>
      </section>

      {/* Contact channels */}
    {/* Contact channels */}
<section className="relative border-t border-[#E5E7EB] bg-white">
  <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
    <div className="contact-appear mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">
          Choose your channel
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1A1A1A] sm:text-4xl">
          Reach us your way.
        </h2>
      </div>
      <p className="max-w-md text-sm leading-7 text-[#6B7280]">
        Choose the contact method that suits your enquiry. Each option
        opens directly on your device.
      </p>
    </div>

    <div className="grid gap-5 md:grid-cols-3">
      {[
        {
          title: "Email",
          description: "For detailed enquiries and business communication.",
          value: EMAIL,
          href: `mailto:${EMAIL}`,
          action: "Open email",
          icon: "email",
        },
        {
          title: "Phone",
          description: "For a direct conversation about your requirements.",
          value: "+91 8530955850",
          href: `tel:${PHONE}`,
          action: "Call now",
          icon: "phone",
        },
        {
          title: "WhatsApp",
          description: "Send a message and start a conversation online.",
          value: "Message Advixio",
          href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Advixio team, I have a business enquiry.")}`,
          action: "Open WhatsApp",
          icon: "whatsapp",
        },
      ].map((item, index) => (
        <a
          key={item.title}
          href={item.href}
          target={item.icon === "whatsapp" ? "_blank" : undefined}
          rel={item.icon === "whatsapp" ? "noopener noreferrer" : undefined}
          className="contact-appear group rounded-2xl border border-[#E5E7EB] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 sm:p-7"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#4F46E5] transition group-hover:bg-[#4F46E5] group-hover:text-white">
              {item.icon === "email" && (
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {item.icon === "phone" && (
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  <path d="M7 3.8h3l1.5 4-2 1.5a15 15 0 0 0 5.2 5.2l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C10 18 6 14 5 5.8c0-1.1.9-2 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {item.icon === "whatsapp" && (
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  <path d="M20 11.5a8.4 8.4 0 0 1-12.4 7.4L4 20l1.2-3.5A8.4 8.4 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <path d="M9 8.5c.3-.6.6-.6 1-.6.2 0 .4 0 .5.4l.7 1.6c.1.3 0 .5-.2.7l-.5.6c.6 1.2 1.5 2.1 2.7 2.7l.6-.5c.2-.2.4-.3.7-.2l1.6.7c.4.1.4.3.4.5 0 .4 0 .7-.6 1-.5.3-1.2.3-2.1 0-2.4-.8-4.8-3.2-5.6-5.6-.3-.9-.3-1.6 0-2.1Z" fill="currentColor" />
                </svg>
              )}
            </div>
            <span className="text-xl text-[#9CA3AF] transition group-hover:translate-x-1 group-hover:text-[#4F46E5]">
              ↗
            </span>
          </div>

          <h3 className="mt-6 text-xl font-semibold text-[#1A1A1A]">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            {item.description}
          </p>
          <p className="mt-5 break-all text-sm font-semibold text-[#4F46E5]">
            {item.value}
          </p>
          <div className="mt-6 border-t border-[#E5E7EB] pt-4 text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
            {item.action} →
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

      {/* Message section */}
      
<section className="relative isolate overflow-hidden border-t border-[#E5E7EB] bg-[#F9F9FB]">
  {/* Animated background accents */}
  <div className="contact-grid pointer-events-none absolute inset-0 opacity-40" />

  <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 animate-pulse rounded-full bg-indigo-100/70 blur-3xl" />
  <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 animate-pulse rounded-full bg-violet-100/80 blur-3xl [animation-delay:1.5s]" />

  <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-10">

    {/* LEFT CONTENT */}
    <div className="contact-message-intro">
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-[#10B981]" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4F46E5]">
          Your message
        </span>
      </div>

      <h2 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-[3.5rem]">
        Tell us what&apos;s
        <span className="mt-2 block bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4338CA] bg-clip-text pb-1 text-transparent">
          on your mind.
        </span>
      </h2>

      <p className="mt-6 max-w-md text-sm leading-8 text-[#6B7280] sm:text-base">
        Have a question or a business requirement? Tell us about it.
        We&apos;re here to help you connect, explore opportunities, and
        move your business forward.
      </p>

      {/* Contact highlights */}
      <div className="mt-9 space-y-3">
        {[
          {
            number: "01",
            title: "Simple and direct",
            description:
              "Share your query without creating an account.",
          },
          {
            number: "02",
            title: "Built around your needs",
            description:
              "Tell us your requirements so we can understand your enquiry.",
          },
          {
            number: "03",
            title: "Your choice, your control",
            description:
              "Review your email before choosing to send it.",
          },
        ].map((item, index) => (
          <div
            key={item.number}
            className="group flex items-start gap-4 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:translate-x-1 hover:border-indigo-100 hover:bg-white hover:shadow-[0_8px_25px_rgba(79,70,229,0.06)]"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-[#EEF0FF] text-xs font-bold text-[#4F46E5] transition-all duration-300 group-hover:bg-[#4F46E5] group-hover:text-white">
              {item.number}
            </div>

            <div className="pt-0.5">
              <h3 className="text-sm font-bold text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#4F46E5]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#6B7280]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT FORM CARD */}
    <div className="contact-message-card relative">
      {/* Gradient outline */}
      <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-br from-indigo-200 via-white to-violet-200 opacity-90" />

      <div className="relative rounded-[27px] border border-[#E5E7EB] bg-white p-5 shadow-[0_25px_80px_rgba(31,41,55,0.08)] sm:p-8 lg:p-9">

        {/* Form heading */}
        <div className="mb-8 flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5]">
              Let&apos;s connect
            </span>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1A1A1A] sm:text-3xl">
              Send an enquiry
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Complete the form and prepare your email.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-[#EEF0FF] text-[#4F46E5] transition-transform duration-300 hover:rotate-[-8deg] hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div className="contact-field">
              <label
                htmlFor="contact-name"
                className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
              >
                Your name <span className="text-[#4F46E5]">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Full name"
                className="contact-input w-full rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-indigo-200 focus:border-[#4F46E5] focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Email */}
            <div className="contact-field">
              <label
                htmlFor="contact-email"
                className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
              >
                Email address <span className="text-[#4F46E5]">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="you@example.com"
                className="contact-input w-full rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-indigo-200 focus:border-[#4F46E5] focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Message */}
          <div className="contact-field">
            <label
              htmlFor="contact-message"
              className="mb-2 block text-sm font-semibold text-[#1A1A1A]"
            >
              Your message <span className="text-[#4F46E5]">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              value={form.message}
              onChange={(event) =>
                setForm({ ...form, message: event.target.value })
              }
              placeholder="Tell us about your question or business requirement..."
              className="contact-input w-full resize-y rounded-xl border border-[#E5E7EB] bg-[#F9F9FB] px-4 py-3.5 text-sm leading-7 text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-indigo-200 focus:border-[#4F46E5] focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
            <p className="mt-2 text-right text-xs text-[#9CA3AF]">
              Minimum 10 characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="contact-submit group relative mt-2 inline-flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#4338CA] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-200 active:translate-y-0"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Prepare email</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>

          <div className="flex items-start justify-center gap-2 px-2 pt-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
            <p className="text-center text-xs leading-5 text-[#6B7280]">
              Your email application will open with your details prepared.
              You can review everything before sending.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>

  
</section>


      {/* Footer CTA */}
      <section className="relative bg-[#F9F9FB] px-5 pb-12 sm:px-8 lg:px-10">
  <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:flex-row sm:items-center sm:p-8">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">
        Advixio
      </p>
      <h2 className="mt-2 text-xl font-semibold text-[#1A1A1A]">
        Let&apos;s build better business connections.
      </h2>
    </div>

    <Link
      href="/products"
      className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
    >
      Explore marketplace →
    </Link>
  </div>

  <p className="mx-auto mt-8 max-w-7xl text-center text-xs text-[#6B7280]">
    © {new Date().getFullYear()} Advixio. All rights reserved.
  </p>
</section>
    </main>
  );
}
