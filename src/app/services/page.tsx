 
"use client";

import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Industrial & Manufacturing",
    description:
      "Connect with service providers for industrial manufacturing, fabrication, welding, machining, and production requirements.",
    tags: ["Fabrication", "Machining", "Welding"],
    href: "/products",
  },
  {
    number: "02",
    title: "Logistics & Transportation",
    description:
      "Explore transportation, freight, goods delivery, and logistics solutions for your business supply chain.",
    tags: ["Transportation", "Freight", "Delivery"],
    href: "/products",
  },
  {
    number: "03",
    title: "IT & Digital Solutions",
    description:
      "Discover technology partners offering website development, software solutions, IT support, and digital services.",
    tags: ["Software", "Web Development", "IT Support"],
    href: "/products",
  },
  {
    number: "04",
    title: "Business Consulting",
    description:
      "Find professional assistance for business operations, growth planning, process improvement, and market research.",
    tags: ["Consulting", "Planning", "Strategy"],
    href: "/products",
  },
  {
    number: "05",
    title: "Maintenance & Repair",
    description:
      "Explore maintenance and repair services for machinery, equipment, electrical systems, and industrial facilities.",
    tags: ["Maintenance", "Repair", "Electrical"],
    href: "/products",
  },
  {
    number: "06",
    title: "Packaging & Printing",
    description:
      "Find business partners for product packaging, custom printing, labels, branding materials, and bulk packaging needs.",
    tags: ["Packaging", "Printing", "Labels"],
    href: "/products",
  },
];

const benefits = [
  {
    number: "01",
    title: "Discover service providers",
    description:
      "Explore service categories and find businesses that match your requirements.",
  },
  {
    number: "02",
    title: "Compare your options",
    description:
      "Review available businesses and evaluate suitable solutions for your needs.",
  },
  {
    number: "03",
    title: "Connect for business",
    description:
      "Take the next step toward building reliable business relationships.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#F9F9FB] text-[#1A1A1A]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#EEF0FF] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 left-1/4 h-72 w-72 rounded-full bg-indigo-50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-[#EEF0FF] px-4 py-2 text-sm font-semibold text-[#4F46E5]">
              <span className="h-2 w-2 rounded-full bg-[#4F46E5]" />
              Business Services Directory
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
              Find the Right
              <span className="block text-[#4F46E5]">
                Services for Your Business
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#6B7280] sm:text-lg">
              Discover business services, explore professional solutions, and
              connect with service providers to support your business growth
              with Advixio.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
              >
                Explore Marketplace
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition hover:border-[#4F46E5] hover:text-[#4F46E5]"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#6B7280]">
              <span className="flex items-center gap-2">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-5 w-5 text-emerald-600"
                  aria-hidden="true"
                >
                  <path
                    d="m5 10 3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Multiple service categories
              </span>
              <span className="flex items-center gap-2">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-5 w-5 text-emerald-600"
                  aria-hidden="true"
                >
                  <path
                    d="m5 10 3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Business-focused discovery
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xl shadow-indigo-100/60 sm:p-6">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
                    Advixio Marketplace
                  </p>
                  <h2 className="mt-1 text-xl font-bold">Explore services</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#4F46E5]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m4.5 7.8 7.5 4.4 7.5-4.4M12 12.2V21"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-5">
                {[
                  { title: "Manufacturing", label: "Production", icon: "M" },
                  { title: "Logistics", label: "Transportation", icon: "L" },
                  { title: "Technology", label: "IT solutions", icon: "T" },
                  { title: "Consulting", label: "Business support", icon: "C" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#E5E7EB] bg-[#F9F9FB] p-4 transition hover:border-indigo-200 hover:bg-[#EEF0FF]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#4F46E5] shadow-sm">
                      {item.icon}
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-[#1A1A1A]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#4F46E5] p-4 text-white">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle
                      cx="10.8"
                      cy="10.8"
                      r="6.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="m16 16 4.2 4.2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Your business, better connected
                  </p>
                  <p className="mt-1 text-xs text-indigo-100">
                    Discover solutions for your requirements
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-16 hidden rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-lg sm:block">
              <p className="text-xs font-medium text-[#6B7280]">
                Built for businesses
              </p>
              <p className="mt-1 text-sm font-bold text-[#4F46E5]">
                One marketplace
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service categories */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4F46E5]">
              What you can explore
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Services for every business need
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#6B7280]">
              Explore key service categories and discover solutions that can
              help your business operate, grow, and scale.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#4F46E5] transition hover:text-[#4338CA]"
          >
            Browse marketplace
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.number}
              className="group flex h-full flex-col rounded-2xl border border-[#E5E7EB] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 sm:p-7"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF0FF] text-lg font-bold text-[#4F46E5] transition group-hover:bg-[#4F46E5] group-hover:text-white">
                  {service.number}
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-[#9CA3AF] transition group-hover:translate-x-1 group-hover:text-[#4F46E5]"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17 17 7M7 7h10v10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="mt-6 text-xl font-bold tracking-tight">
                {service.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-[#6B7280]">
                {service.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-[#E5E7EB] bg-[#F9F9FB] px-2.5 py-1.5 text-xs font-medium text-[#6B7280]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={service.href}
                className="mt-6 inline-flex items-center gap-2 border-t border-[#E5E7EB] pt-5 text-sm font-semibold text-[#4F46E5] transition hover:text-[#4338CA]"
              >
                Explore solutions
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm leading-6 text-[#6B7280]">
          Note: These are illustrative service categories. Available providers
          depend on the listings published on Advixio.
        </p>
      </section>

      {/* How it works */}
      <section className="border-y border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4F46E5]">
              Simple process
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              How Advixio helps your business
            </h2>
            <p className="mt-4 leading-7 text-[#6B7280]">
              Move from discovering a requirement to finding a potential
              business solution in three simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.number} className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF0FF] text-sm font-bold text-[#4F46E5]">
                  {benefit.number}
                </div>
                <h3 className="text-lg font-bold">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-[#4338CA] px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[40px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">
                Grow with Advixio
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to find the right business solution?
              </h2>
              <p className="mt-4 leading-7 text-indigo-100">
                Explore the marketplace to discover products, businesses, and
                solutions for your next requirement.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                 className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
