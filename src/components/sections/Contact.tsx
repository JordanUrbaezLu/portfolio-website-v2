"use client";
import { useState } from "react";
import { SectionHead } from "@/components/ui/SectionHead";
import { askAbout, profile } from "@/data/profile";

interface Fields {
  name: string;
  email: string;
  message: string;
}
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", message: "" };

const inputBase =
  "w-full border bg-panel px-4 py-3 text-[0.9375rem] text-paper placeholder:text-faint focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper";

export function Contact() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [handedOff, setHandedOff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!fields.name.trim()) next.name = "Enter your name.";
    if (!fields.email.trim()) next.email = "Enter your email address.";
    else if (!/\S+@\S+\.\S+/.test(fields.email))
      next.email = "That address is missing an @ or a domain.";
    if (!fields.message.trim()) next.message = "Add a message.";
    else if (fields.message.trim().length < 10)
      next.message = "Add a little more — at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Fields]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const plainMessage = `${fields.message}\n\n— ${fields.name} (${fields.email})`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // No backend by design. Hand off to the visitor's mail client.
    //
    // There is no reliable way to detect whether a mailto: handler exists, so
    // this must never claim the message was sent. Plenty of desktop Gmail
    // users have no handler registered at all — for them the old "your email
    // app should be open" screen destroyed the draft and reported success.
    const subject = encodeURIComponent(`Portfolio enquiry from ${fields.name}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(
      plainMessage
    )}`;
    setHandedOff(true);
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(plainMessage);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 1800);
    } catch {
      // Clipboard blocked — the message is still in the box below.
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — the address is on screen either way.
    }
  };

  return (
    <section id="contact" data-island className="px-4 pt-28 md:px-5 md:pt-36">
      <div className="mx-auto max-w-[86rem]">
        <SectionHead code="Contact" title="Tell me what you're building" />

        <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_26rem]">
          {/* ── Direct routes first. The form is the slow path. ── */}
          <div>
            <p className="max-w-[46ch] text-[1.25rem] leading-relaxed text-paper">
              I&rsquo;m open to senior and staff frontend roles. Tell me what
              you&rsquo;re building and what fast has to mean for it. I reply
              within a day.
            </p>

            <dl className="mt-10 max-w-[34rem]">
              <div className="silkscreen flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
                <dt className="label w-20 shrink-0">Email</dt>
                <dd className="flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="link-underline text-[0.9375rem] text-paper"
                  >
                    {profile.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="border border-rule-lit px-2 py-1 transition-colors hover:bg-panel"
                  >
                    <span className="label !text-paper">
                      {copied ? "Copied" : "Copy"}
                    </span>
                  </button>
                </dd>
              </div>
              <div className="silkscreen flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
                <dt className="label w-20 shrink-0">Phone</dt>
                <dd>
                  <a
                    href={profile.phoneHref}
                    className="link-underline text-[0.9375rem] text-paper"
                  >
                    {profile.phone}
                  </a>
                </dd>
              </div>
              <div className="silkscreen flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
                <dt className="label w-20 shrink-0">Elsewhere</dt>
                <dd className="flex flex-wrap gap-5">
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[0.9375rem] text-paper"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[0.9375rem] text-paper"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[0.9375rem] text-paper"
                  >
                    Résumé ↗
                  </a>
                </dd>
              </div>
            </dl>

            {/* Give them a specific thing to open with, not a blank page. */}
            <div className="mt-12 max-w-[46rem]">
              <p className="label">Ask me about</p>
              <ul className="mt-5">
                {askAbout.map((item) => (
                  <li
                    key={item}
                    className="silkscreen flex gap-4 py-4 text-[0.9375rem] leading-relaxed text-dim"
                  >
                    <span aria-hidden className="text-faint">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── The form ── */}
          <div className="panel p-6 md:p-7">
            {handedOff ? (
              <div>
                <p className="label">Handed off</p>
                <h3 className="display-sm mt-3 text-xl text-paper">
                  If your mail app opened, the draft is in it
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-dim">
                  Nothing was sent from this page, and nothing here can tell
                  whether your browser had a mail handler. If no window
                  appeared, copy the message and send it to{" "}
                  <a
                    href={`mailto:${profile.email}`}
                    className="link-underline text-paper"
                  >
                    {profile.email}
                  </a>
                  .
                </p>

                {/* The draft is never destroyed — it stays here, selectable. */}
                <pre className="mt-5 max-h-40 overflow-auto whitespace-pre-wrap border border-rule bg-void p-4 text-[0.8125rem] leading-relaxed text-dim">
                  {plainMessage}
                </pre>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={copyMessage}
                    className="border border-field px-4 py-2.5 transition-colors hover:bg-panel-2"
                  >
                    <span className="label !text-paper">
                      {copiedMessage ? "Copied" : "Copy message"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHandedOff(false);
                      setFields(EMPTY);
                    }}
                    className="border border-rule px-4 py-2.5 transition-colors hover:bg-panel-2"
                  >
                    <span className="label">Start over</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="name" className="label block">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={fields.name}
                    onChange={change}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`${inputBase} mt-2 ${
                      errors.name ? "border-poor" : "border-field"
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-[0.8125rem] text-poor">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="label block">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={fields.email}
                    onChange={change}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`${inputBase} mt-2 ${
                      errors.email ? "border-poor" : "border-field"
                    }`}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-2 text-[0.8125rem] text-poor"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="label block">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={fields.message}
                    onChange={change}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    className={`${inputBase} mt-2 resize-y ${
                      errors.message ? "border-poor" : "border-field"
                    }`}
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="mt-2 text-[0.8125rem] text-poor"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-paper px-5 py-3.5 text-void transition-colors hover:bg-white"
                >
                  <span className="label !text-void">Open email draft</span>
                </button>
                <p className="label !normal-case !tracking-normal !text-faint">
                  This opens your own mail app with the message ready. Nothing
                  is sent from this page.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
