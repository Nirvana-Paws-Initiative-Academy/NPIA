/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Heart, Mail, PawPrint, ShieldCheck } from "lucide-react";

const BG_IMAGE_URL = "/partner-network/pine-forest-bg.jpg";

const SERVICES = [
  "Partner Organization",
  "Veterinary / Clinic Partner",
  "Allied Individual",
  "Institutional Sponsorship",
  "Volunteer at NPIA",
  "Student Ambassador",
  "Adopt a Street Puppy",
  "Foster a Rescue",
  "Sanctuary Donation",
] as const;

interface QuickRouteBtnProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

const QuickRouteBtn: React.FC<QuickRouteBtnProps> = ({
  href,
  label,
  children,
}) => (
  <Link
    href={href}
    aria-label={label}
    title={label}
    className="w-8 h-8 rounded-xl border border-[#E2FFE4]/25 bg-[#152916] text-[#B2DCB3] flex items-center justify-center hover:bg-[#245736] hover:text-[#FAFFFD] transition-colors"
  >
    {children}
  </Link>
);

export default function ContactUsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brief = params.get("brief");
    const type = params.get("type");

    if (brief) {
      setMessage(brief);
    }
    if (type === "partner") {
      setSelected((prev) =>
        prev.includes("Partner Organization")
          ? prev
          : [...prev, "Partner Organization"]
      );
    } else if (type === "donate") {
      setSelected((prev) =>
        prev.includes("Sanctuary Donation")
          ? prev
          : [...prev, "Sanctuary Donation"]
      );
    }
  }, []);

  const toggleService = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          topics: selected,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        setErrorMsg(
          payload.error ||
            "Unable to deliver your message right now. You can also write directly to hello@npia.org.in."
        );
        return;
      }

      setSent(true);
    } catch {
      setErrorMsg(
        "Network error while sending. You can reach us directly at hello@npia.org.in."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="w-full min-h-[calc(100vh-76px)] bg-[#FAFFFD] p-3 sm:p-4 md:p-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="relative w-full min-h-[calc(100vh-116px)] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex flex-col justify-end">
        {/* Background Image */}
        <img
          src={BG_IMAGE_URL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-tr from-[#071309]/90 via-[#0B1C0E]/55 to-[#102412]/35 pointer-events-none"
        />

        {/* Content Layer */}
        <div className="relative z-10 w-full p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          {/* Headline Left */}
          <div className="max-w-xl shrink-0 space-y-3">
            <span className="inline-block rounded-full border border-[#E2FFE4]/30 bg-[#0B1C0E]/70 px-3.5 py-1 text-xs font-medium uppercase tracking-widest text-[#B2DCB3] backdrop-blur-md">
              NPIA. Contact &amp; Partner Desk
            </span>
            <h1 className="text-[#FAFFFD] text-3xl sm:text-4xl xl:text-5xl font-medium leading-tight drop-shadow-lg">
              Together for every street animal
              <br />
              in care and{" "}
              <span
                className="text-[#E2FFE4]"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                sanctuary
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#E2FFE4]/85 max-w-md leading-relaxed">
              Partner as an organization, collaborate as a vet, volunteer, foster,
              adopt, or connect directly with our team through one desk.
            </p>
          </div>

          {/* Forest Glass Contact Form Card Right */}
          <div className="w-full lg:w-[min(500px,48%)] shrink-0">
            <div className="rounded-2xl sm:rounded-3xl border border-[#E2FFE4]/25 bg-[#0B1C0E]/90 backdrop-blur-2xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4 text-[#FAFFFD]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FAFFFD]">
                    Say hello
                  </h2>
                  <a
                    href="mailto:hello@npia.org.in"
                    className="inline-flex items-center gap-1.5 text-xs text-[#B2DCB3] hover:text-[#FAFFFD] hover:underline mt-0.5"
                  >
                    <Mail size={12} aria-hidden="true" />
                    <span>hello@npia.org.in</span>
                  </a>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <QuickRouteBtn href="/partner-network" label="Partner Network">
                    <PawPrint size={14} aria-hidden="true" />
                  </QuickRouteBtn>
                  <QuickRouteBtn href="/donate" label="Donations">
                    <Heart size={14} aria-hidden="true" />
                  </QuickRouteBtn>
                  <QuickRouteBtn href="/roadmap" label="4-Stage Roadmap">
                    <Compass size={14} aria-hidden="true" />
                  </QuickRouteBtn>
                  <QuickRouteBtn href="/dpdp-policy" label="DPDP Act 2023">
                    <ShieldCheck size={14} aria-hidden="true" />
                  </QuickRouteBtn>
                </div>
              </div>

              <div className="h-px w-full bg-[#E2FFE4]/15" />

              {sent ? (
                <div className="flex flex-col items-center justify-center text-center py-8 gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#245736] border border-[#E2FFE4]/40 flex items-center justify-center text-xl text-[#E2FFE4] font-semibold">
                    ✓
                  </div>
                  <p className="text-base font-semibold text-[#FAFFFD]">
                    You&rsquo;re all set!
                  </p>
                  <p className="text-sm text-[#B2DCB3]">
                    Your message has been dispatched from hello@npia.org.in.
                    Expect a reply within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setMessage("");
                    }}
                    className="mt-1 text-xs font-medium text-[#E2FFE4] underline underline-offset-2 hover:text-white cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 min-w-0 text-sm px-3.5 py-2.5 rounded-xl border border-[#E2FFE4]/25 bg-[#152916]/80 text-[#FAFFFD] placeholder-[#B2DCB3]/60 focus:outline-none focus:ring-2 focus:ring-[#4AA552] focus:border-transparent transition"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 min-w-0 text-sm px-3.5 py-2.5 rounded-xl border border-[#E2FFE4]/25 bg-[#152916]/80 text-[#FAFFFD] placeholder-[#B2DCB3]/60 focus:outline-none focus:ring-2 focus:ring-[#4AA552] focus:border-transparent transition"
                    />
                  </div>

                  <textarea
                    name="message"
                    rows={3}
                    required
                    placeholder="Share how you'd like to collaborate, partner, volunteer, adopt, or support NPIA..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#E2FFE4]/25 bg-[#152916]/80 text-[#FAFFFD] placeholder-[#B2DCB3]/60 focus:outline-none focus:ring-2 focus:ring-[#4AA552] focus:border-transparent transition resize-none"
                  />

                  <div className="space-y-2">
                    <span className="block text-xs font-medium text-[#B2DCB3]">
                      I need help with...
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SERVICES.map((service) => {
                        const active = selected.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleService(service)}
                            className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              active
                                ? "bg-[#E2FFE4] text-[#102412] border-[#E2FFE4] font-semibold"
                                : "bg-[#152916]/75 text-[#E2FFE4]/90 border-[#E2FFE4]/20 hover:border-[#B2DCB3]/60"
                            }`}
                          >
                            {service}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {errorMsg && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-400/35 bg-red-950/60 px-3 py-2 text-xs text-red-200"
                    >
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-[#E2FFE4] hover:bg-[#FAFFFD] text-[#102412] text-sm font-semibold py-3 rounded-2xl transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {sending ? "Sending..." : "Send my message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
