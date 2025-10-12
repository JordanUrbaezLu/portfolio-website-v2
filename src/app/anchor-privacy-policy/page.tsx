"use client";
import { Background } from "@/components/layout/Background";
import { HeadshotProgress } from "@/components/ui/HeadshotProgress";

export default function AnchorPrivacyPage() {
  return (
    <div className="relative min-h-screen">
      <Background variant="anchor" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-8 flex items-center justify-center">
            <HeadshotProgress
              image="anchor"
              size={160}
              gap={8}
              border={2}
              trigger={true}
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 space-y-8 text-white/80">
          {/* Intro */}
          <p className="text-lg leading-relaxed">
            Your privacy and anonymity are fundamental to our mission. We
            believe seeking help should never come with shame or fear of
            judgment.
          </p>

          {/* Our Commitment */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Our Commitment to Anonymity
            </h2>
            <p className="leading-relaxed">
              This app was built with anonymity at its core. We don&apos;t track
              who you are, what you share, or who you talk to. Your struggles
              and conversations remain completely private.
            </p>
          </section>

          {/* What We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              What We Collect
            </h2>
            <p className="leading-relaxed mb-4">
              We collect only the minimum information necessary to make the app
              function:
            </p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>Firebase authentication (email for account recovery only)</li>
              <li>Anonymous messages and encouragement you choose to send</li>
              <li>
                Basic app usage data to prevent abuse and improve functionality
              </li>
            </ul>
            <p className="leading-relaxed mt-4">
              We never collect your real name, personal details, or link your
              identity to your activity in the app.
            </p>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              How We Use Information
            </h2>
            <p className="leading-relaxed mb-4">
              The information we collect is used solely to:
            </p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>Enable anonymous communication between users</li>
              <li>Deliver daily verses and prayer content</li>
              <li>Prevent spam, trolling, and abuse</li>
              <li>Maintain the technical operation of the app</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We never sell, share, or use your data for advertising or any
              other purpose.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your Data Security
            </h2>
            <p className="leading-relaxed">
              All data is stored securely using Firebase&apos;s enterprise-grade
              security. Messages and interactions are designed to be untraceable
              to your identity.
            </p>
          </section>

          {/* Your Control */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your Control
            </h2>
            <p className="leading-relaxed">
              You can delete your account at any time, which will remove all
              associated data. You have complete control over what you share and
              when.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-4 border-t border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have questions about privacy, please reach out:{" "}
              <a
                href="mailto:jrmoynihan99@gmail.com"
                className="text-blue-300 hover:text-blue-200 transition-colors underline underline-offset-2"
              >
                jrmoynihan99@gmail.com
              </a>
            </p>
          </section>
        </div>

        {/* Last Updated */}
        <p className="text-center text-sm text-white/40 mt-8">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
