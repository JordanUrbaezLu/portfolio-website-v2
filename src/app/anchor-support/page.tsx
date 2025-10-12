"use client";
import { Mail } from "lucide-react";
import { Background } from "@/components/layout/Background";
import { HeadshotProgress } from "@/components/ui/HeadshotProgress";

export default function AnchorSupportPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <Background variant="anchor" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Logo/Icon */}
        <div className="mb-8 flex items-center justify-center">
          <HeadshotProgress
            image="anchor"
            size={160}
            gap={8}
            border={2}
            trigger={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Anchor Support
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/70 mb-12 max-w-lg mx-auto">
          Need help or have questions? I&apos;m here to support you on your
          journey.
        </p>

        {/* Contact Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 hover:bg-white/[0.08] transition-all">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-white/70" />
            <h2 className="text-xl font-semibold text-white">Get in Touch</h2>
          </div>

          <a
            href="mailto:jrmoynihan99@gmail.com"
            className="inline-block text-2xl md:text-3xl font-medium text-blue-300 hover:text-blue-200 transition-colors underline underline-offset-4"
          >
            jrmoynihan99@gmail.com
          </a>

          <p className="mt-6 text-sm text-white/50">
            I typically respond within 24-48 hours
          </p>
        </div>

        {/* Additional Info */}
        <p className="mt-8 text-sm text-white/40">
          Your privacy and well-being matter. All communications are
          confidential.
        </p>
      </div>
    </div>
  );
}
