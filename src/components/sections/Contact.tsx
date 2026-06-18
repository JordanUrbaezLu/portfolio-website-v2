"use client";
import React, { useState } from "react";
import { Mail, Phone, Copy, Check, Send, ArrowUpRight } from "lucide-react";
import { MotionParallax } from "@/components/animations/MotionParallax";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { profile } from "@/data/profile";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function Contact({
  registry,
  footnote = `© ${new Date().getFullYear()} Jordan Urbaez-Lu. All rights reserved.`,
}: {
  registry: React.RefObject<Record<string, HTMLElement | null>>;
  footnote?: string;
}) {
  const [underlineActive, setUnderlineActive] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // No backend — open the visitor's mail client with a prefilled draft.
    const subject = encodeURIComponent(
      "Portfolio inquiry from " + formData.name
    );
    const body = encodeURIComponent(
      formData.message + "\n\n— " + formData.name + " (" + formData.email + ")"
    );
    window.location.href =
      "mailto:" + profile.email + "?subject=" + subject + "&body=" + body;

    setSubmitted(true);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable — silently ignore; the email is still visible.
    }
  };

  return (
    <Section
      id="contact"
      registry={registry}
      className="relative py-20 md:py-28 px-4 z-20"
    >
      <MotionParallax range={35}>
        {/* Section header reveal + underline animation */}
        <MotionReveal
          direction="up"
          delay={0}
          onViewportEnter={() => {
            setTimeout(() => setUnderlineActive(true), 300);
          }}
        >
          <SectionHeader
            eyebrow="Contact"
            activateUnderline={underlineActive}
            underlineDelay={80}
          >
            Let&rsquo;s build something
          </SectionHeader>
        </MotionReveal>

        <div className="mx-auto max-w-3xl">
          {/* Invite line */}
          <MotionReveal direction="up" delay={40}>
            <p className="mx-auto max-w-xl text-center text-lg font-light leading-relaxed text-white/70 md:text-xl">
              Hiring, collaborating, or just curious? I&rsquo;m{" "}
              <span className="text-aurora font-normal">
                open to new opportunities
              </span>{" "}
              and reply within a day.
            </p>
          </MotionReveal>

          {/* Direct contact row: email (with copy) + phone */}
          <MotionReveal direction="up" delay={100}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              {/* Email + copy */}
              <div className="group inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md transition-colors hover:border-indigo-300/30">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  <Mail size={16} className="text-indigo-300" />
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/55 transition-all hover:bg-white/[0.08] hover:text-white"
                >
                  {copied ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <span
                  aria-live="polite"
                  className={`pr-2 text-xs font-medium text-emerald-400 transition-opacity duration-200 ${
                    copied ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Copied
                </span>
              </div>

              {/* Phone */}
              <a
                href={profile.phoneHref}
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-indigo-300/30 hover:text-white"
              >
                <Phone size={16} className="text-teal-400" />
                {profile.phone}
              </a>
            </div>
          </MotionReveal>

          {/* Social links */}
          <MotionReveal direction="up" delay={160}>
            <div className="mt-6 flex justify-center">
              <SocialLinks />
            </div>
          </MotionReveal>

          {/* Contact form */}
          <MotionReveal direction="up" delay={220}>
            <Card glow padding="p-6 md:p-8" className="mt-12">
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                    <Check size={26} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Your draft is ready
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-white/60">
                    Your email client should have opened with the message
                    pre-filled. If it didn&rsquo;t, reach me directly at{" "}
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-indigo-300 underline-offset-2 hover:underline"
                    >
                      {profile.email}
                    </a>
                    .
                  </p>
                  <Button
                    as="button"
                    type="button"
                    variant="glass"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", message: "" });
                    }}
                  >
                    Send another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Name + Email */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-white/70"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-white placeholder-white/35 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400/70 ${
                          errors.name ? "border-rose-400/70" : "border-white/12"
                        }`}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p
                          id="name-error"
                          className="mt-1.5 text-sm text-rose-400"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-white/70"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-white placeholder-white/35 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400/70 ${
                          errors.email ? "border-rose-400/70" : "border-white/12"
                        }`}
                        placeholder="you@company.com"
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          className="mt-1.5 text-sm text-rose-400"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                      className={`w-full resize-y rounded-xl border bg-white/[0.04] px-4 py-3 text-white placeholder-white/35 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400/70 ${
                        errors.message ? "border-rose-400/70" : "border-white/12"
                      }`}
                      placeholder="Tell me about the role or project — and what success looks like."
                    />
                    {errors.message && (
                      <p
                        id="message-error"
                        className="mt-1.5 text-sm text-rose-400"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button — primary conversion moment */}
                  <Button
                    as="button"
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    <Send size={18} />
                    Send message
                  </Button>

                  <p className="flex items-center justify-center gap-1.5 text-center text-xs text-white/40">
                    Opens your email app with a ready-to-send draft
                    <ArrowUpRight size={13} />
                  </p>
                </form>
              )}
            </Card>
          </MotionReveal>

          {/* Footer */}
          <MotionReveal direction="up" delay={280}>
            <div className="mt-16 border-t border-white/10 pt-8 text-center">
              <p className="text-sm font-light text-white/40">{footnote}</p>
            </div>
          </MotionReveal>
        </div>
      </MotionParallax>
    </Section>
  );
}
