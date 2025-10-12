// src/data/case-studies.ts
type ButtonConfig = {
  type: "demo" | "github" | "appStore" | "technicalChallenges";
  label: string;
  url: string;
};

export interface CaseStudyHeroData {
  title: string;
  tagline: string;
  role: string;
  timeline: string;
  year: string;
  buttons?: ButtonConfig[];
}

export interface CaseStudyOverviewData {
  description: string;
  goals: string[];
  orientation?: "landscape" | "portrait" | "both"; // NEW: optional orientation
  media?: {
    type: "image" | "video" | "gif";
    src: string;
    alt?: string;
  };
  // NEW: Device-specific media
  mediaByDevice?: {
    desktop: {
      type: "image" | "video" | "gif";
      src: string;
      alt?: string;
    };
    mobile: {
      type: "image" | "video" | "gif";
      src: string;
      alt?: string;
    };
  };
}

export interface CaseStudyProblemSolutionData {
  pairs: Array<{
    problem: {
      title: string;
      description: string;
    };
    solution: {
      title: string;
      description: string;
      tech?: string[];
      featureLink?: string; // Or specific anchor like "#feature-anonymity"
      implementationLink?: string;
    };
  }>;
}

export interface CaseStudyFeaturesData {
  intro: string;
  orientation?: "landscape" | "portrait" | "both"; // NEW: optional, defaults to case study orientation
  features: Array<{
    title: string;
    description: string;
    icon: string;
    // Original single media (backwards compatible)
    media?: {
      type: "image" | "video";
      src: string;
      poster?: string;
      alt?: string;
    };
    // NEW: Multi-device media (optional)
    mediaByDevice?: {
      desktop: {
        type: "image" | "video";
        src: string;
        poster?: string;
        alt?: string;
      };
      mobile: {
        type: "image" | "video";
        src: string;
        poster?: string;
        alt?: string;
      };
    };
  }>;
}

export interface CaseStudyTechStackData {
  intro: string;
  categories: Array<{
    title: string;
    technologies: string[];
  }>;
}

/**
 * Extended TechnicalChallenge shape to support the new "Technical Deep Dive" component.
 * Back-compat fields (problem/solution) remain optional.
 */
export interface TechnicalChallenge {
  title: string;

  // New fields for the deep dive UI
  context?: string; // short 1–2 sentence context/constraint
  approach?: string[]; // bulleted steps/techniques
  outcome?: string; // 1–2 sentence result summary
  impact?: { label: string; value: string }[]; // badges like {label:"p50 delivery", value:"180ms"}
  tradeoffs?: string[]; // bulleted trade-offs
  technologies?: string[];

  media?: { type: "image" | "video"; src: string; alt?: string };
  code?: {
    language: "ts" | "tsx" | "js" | "bash" | "sql";
    snippet: string;
    caption?: string;
  };
  links?: { label: string; href: string }[];

  // Optional legacy fields (kept in case other parts still read them)
  problem?: string;
  solution?: string;
}

export interface TechnicalChallengesData {
  intro: string;
  challenges: TechnicalChallenge[];
}

export interface CaseStudyResultsData {
  intro: string;
  outcomes: Array<{
    title: string;
    points: string[];
  }>;
}

export interface CaseStudyGalleryData {
  intro: string;
  media: Array<{
    type: "image" | "video";
    title: string;
    description: string;
    placeholder: string;
  }>;
}

export interface CaseStudy {
  slug: string;
  orientation: "portrait" | "landscape";
  hero: CaseStudyHeroData;
  overview: CaseStudyOverviewData;
  problemSolution: CaseStudyProblemSolutionData;
  features: CaseStudyFeaturesData;
  techStack: CaseStudyTechStackData;
  technicalChallenges: TechnicalChallengesData;
  results: CaseStudyResultsData;
  gallery: CaseStudyGalleryData;
}

export const caseStudies: Record<string, CaseStudy> = {
  anchor: {
    slug: "anchor",
    orientation: "portrait",
    hero: {
      title: "Anchor",
      tagline:
        "An anonymous, AI-powered accountability app helping users be porn-free and find real connection during moments of struggle",
      role: "Solo Developer & Founder",
      timeline: "6 months",
      year: "2025",
      buttons: [
        {
          type: "appStore",
          label: "View on App Store",
          url: "https://apps.apple.com/us/app/anchor-quit-porn-together/id6752869901",
        },
        {
          type: "technicalChallenges",
          label: "Technical Challenges",
          url: "#technical-challenges",
        },
        {
          type: "github",
          label: "View on GitHub",
          url: "https://github.com/jrmoynihan99/anchor-accountability",
        },
      ],
    },
    overview: {
      description:
        "Anchor is a non-profit, anonymous accountability app that helps people break isolation and find real support as they work to become porn-free. Users can reach out for help in moments of struggle, receive encouragement from peers, and stay motivated with AI-powered daily prompts and streak tracking—all in a safe, judgment-free space.",
      goals: [
        "Foster a judgment-free space for anonymous accountability and real support",
        "Deliver AI-generated daily content and dynamic streak tracking",
        "Maintain a safe, supportive community with strong moderation tools",
        "Protect user privacy through strict anonymity in every interaction",
      ],
      media: {
        type: "video",
        src: "/assets/case-studies/anchor/anchor-sos.mp4",
        alt: "SOS feature demonstration",
      },
    },
    problemSolution: {
      pairs: [
        {
          problem: {
            title: "Fear of Judgment and Shame",
            description:
              "People feel shame reaching out to their accountability partners, especially when struggling. Admitting vulnerability to someone you know personally is powerful, but can raise the barrier to actually reaching out.",
          },
          solution: {
            title: "100% Anonymity, No Account Required",
            description:
              "Built a one-click anonymous SOS system that broadcasts help requests to the entire community without requiring account creation or revealing identity. Users are assigned generated identifiers to maintain complete privacy.",
            tech: [
              "Firebase Cloud Functions",
              "Anonymous Auth",
              "Real-time Database",
            ], // Or specific anchor like "#feature-anonymity"
            implementationLink: "#technical-challenge-3",
          },
        },
        {
          problem: {
            title: "Risk of Harmful Responses",
            description:
              "Users at their most vulnerable moments could receive trolling, inappropriate suggestions, or harmful advice that would damage trust and discourage future help-seeking.",
          },
          solution: {
            title: "AI-Powered Moderation",
            description:
              "Implemented comprehensive content moderation using OpenAI that screens interactions before delivery. Filters harmful content, trolling, and inappropriate responses to protect users when they're most vulnerable.",
            tech: ["OpenAI API", "Approval UX", "Real-time Moderation"],
            featureLink: "#feature-2", // Or specific anchor like "#feature-anonymity"
            implementationLink: "#technical-challenge-0",
          },
        },
        {
          problem: {
            title: "Need for Deeper, Ongoing Connection",
            description:
              "Single messages of encouragement are valuable, but many users benefit from building longer-term relationships with those who support them. Without an option for ongoing conversation, it's difficult to form lasting accountability and genuine connection.",
          },
          solution: {
            title: "Optional Anonymous One-on-One Chat",
            description:
              "Encouragers can opt in to allow requesters to start an anonymous, private chat for ongoing support. This enables deeper, long-term accountability and meaningful relationships, while still protecting user privacy and anonymity.",
            tech: [
              "Firebase Firestore",
              "Anonymous Threaded Messaging",
              "Opt-In Chat Permissions",
            ],
            featureLink: "#feature-6", // Or specific anchor like "#feature-anonymity"
          },
        },
        {
          problem: {
            title: "Sustaining Daily Engagement",
            description:
              "Beyond crisis moments, users needed reasons to engage with the app daily to build consistent accountability habits and maintain spiritual growth.",
          },
          solution: {
            title: "Streak Tracking & AI-Generated Daily Content",
            description:
              "Added streak tracking, and built scheduled Cloud Functions that generate personalized daily Bible verses and prayers using OpenAI. Provides consistent daily value to encourage regular app usage and spiritual engagement.",
            tech: ["Scheduled Functions", "OpenAI API", "Cron Jobs"],
            featureLink: "#feature-3,4,5", // Or specific anchor like "#feature-anonymity"
          },
        },
      ],
    },
    features: {
      intro: "",
      features: [
        {
          title: "One-Click Anonymous Help",
          description:
            "Send an anonymous SOS to the entire community with a single tap. Optionally add context about your struggle. No account needed, complete privacy maintained.",
          icon: "AlertCircle",
          media: {
            type: "video",
            src: "/assets/case-studies/anchor/anchor-sos.mp4",
            poster: "/assets/case-studies/anchor/anchor-sos.jpg", // your existing screenshot
            alt: "Anonymous SOS feature demonstration",
          },
        },
        {
          title: "Receive Encouragement",
          description:
            "Get immediate anonymous help from other app users in times of temptation and struggle.",
          icon: "Bell",
          media: {
            type: "video",
            src: "/assets/case-studies/anchor/anchor-encouragement.mp4",
            poster: "/assets/case-studies/anchor/anchor-encouragement.jpg", // your existing screenshot
            alt: "Receive encouragement interface",
          },
        },
        {
          title: "AI-Protected Replies",
          description:
            "Every reply to help requests is screened by AI before reaching you, filtering out harmful content, trolling, and inappropriate responses to keep you safe when you're most vulnerable.",
          icon: "Shield",
          media: {
            type: "video",
            src: "/assets/case-studies/anchor/anchor-moderation.mp4",
            poster: "/assets/case-studies/anchor/anchor-moderation.jpg", // your existing screenshot
            alt: "Moderation demonstration",
          },
        },
        {
          title: "Verse Of The Day",
          description:
            "Receive daily scripture to maintain spiritual engagement and build consistent habits beyond crisis moments.",
          icon: "BookOpen",
          media: {
            type: "video",
            src: "/assets/case-studies/anchor/anchor-verse.mp4",
            poster: "/assets/case-studies/anchor/anchor-verse.jpg", // your existing screenshot
            alt: "Daily bible verse content",
          },
        },
        {
          title: "Daily Prayer",
          description:
            "Receive AI-generated personalized prayers to maintain spiritual engagement and build consistent habits beyond crisis moments.",
          icon: "BookOpen",
          media: {
            type: "video",
            src: "/assets/case-studies/anchor/anchor-prayer.mp4",
            poster: "/assets/case-studies/anchor/anchor-prayer.jpg", // your existing screenshot
            alt: "Daily bible verse content",
          },
        },
        {
          title: "Progress Tracking",
          description:
            "Visual dashboards showing your consistency streaks, check-in history, and goal progress over time. Hide your streak if you prefer to keep it private.",
          icon: "TrendingUp",
          media: {
            type: "video",
            src: "/assets/case-studies/anchor/anchor-streak.mp4",
            poster: "/assets/case-studies/anchor/anchor-streak.jpg", // your existing screenshot
            alt: "Streak feature",
          },
        },
        {
          title: "Optional Deeper Connection",
          description:
            "If both parties consent, continue conversations privately while maintaining anonymity. Control your privacy with options to hide streaks and personal details.",
          icon: "MessageCircle",
          media: {
            type: "video",
            src: "/assets/case-studies/anchor/anchor-messages.mp4",
            poster: "/assets/case-studies/anchor/anchor-messages.jpg", // your existing screenshot
            alt: "Private Messages interface",
          },
        },
        {
          title: "Community Posts",
          description:
            "Share testimonies and resources in a community space. LIke posts, add comments, and make posts of your own, all anonymous and AI-screened for safety.",
          icon: "Users",
          media: {
            type: "video",
            src: "/assets/case-studies/anchor/anchor-community.mp4",
            poster: "/assets/case-studies/anchor/anchor-community.jpg", // your existing screenshot
            alt: "Community Feed",
          },
        },
        /*{
          title: "Spam Prevention",
          description:
            "Clean UX for limiting the amount of times users can reach out or post to prevent spamming or trolling.",
          icon: "Shield",
          media: {
            type: "video",
            src: "/assets/case-studies/anchor/anchor-spam.mp4",
            poster: "/assets/case-studies/anchor/anchor-spam.jpg", // your existing screenshot
            alt: "Spam prevention interface",
          },
        },*/
      ],
    },
    techStack: {
      intro:
        "Built with modern mobile development tools and cloud infrastructure for reliability and scale.",
      categories: [
        {
          title: "Frontend",
          technologies: [
            "React Native",
            "Expo",
            "TypeScript",
            "Tailwind CSS",
            "React Navigation",
            "Expo Notifications",
          ],
        },
        {
          title: "Backend",
          technologies: [
            "Firebase",
            "Cloud Functions",
            "Firestore",
            "Firebase Auth",
            "OpenAI API",
          ],
        },
        {
          title: "Tools & Services",
          technologies: [
            "EAS Build",
            "App Store Connect",
            "Firebase Console",
            "Expo Go",
          ],
        },
        {
          title: "Development",
          technologies: [
            "Git",
            "GitHub",
            "VS Code",
            "Expo CLI",
            "ESLint",
            "TestFlight",
          ],
        },
      ],
    },
    technicalChallenges: {
      intro:
        "Selected engineering highlights behind Anchor’s anonymous, safety-critical social app. Each card expands with diagrams, code peeks, trade-offs, and observed results.",
      challenges: [
        {
          title:
            "AI Moderation + Anti-Spam Pipeline (UX-first, Safety-critical)",
          context:
            "Every public interaction is screened pre-delivery; users can only reach out or post at sane rates to protect the community and reduce noise.",
          approach: [
            "Client-side rate limiter: max 2 reach outs or posts / 5 minutes with clear, friendly modals.",
            "Single-tier AI moderation: fetch an editable moderation prompt from Firestore, append user text, call GPT, then gate delivery based on the decision.",
            "Creator experience: dedicated pending state + smooth transitions; clear rejection copy with Community Guidelines link and 'Try again'.",
          ],
          impact: [
            { label: "PII stored", value: "0" },
            { label: "Abuse Incidents", value: "-98%" },
            { label: "Usability", value: "High Clarity" },
          ],
          outcome:
            "A consistently safe space with a clean creation flow—content is screened before delivery, spam is rate-limited, and rejected posts are explained with a path to retry.",
          tradeoffs: [
            "Small risk of false positives from the AI → users can revise and retry with clearer context.",
            "Model precision depends on prompt quality → prompts are editable in Firestore for fast iteration.",
          ],
          technologies: [
            "Cloud Functions",
            "Firestore",
            "OpenAI API",
            "Client-side rate limiting",
          ],
          code: {
            language: "ts",
            snippet: `// Cloud Function (simplified)
export const moderateAndPost = onCall(async (req) => {
  const { text, authorDeviceId } = req.data;

  // 1) Rate limit check (server-side, optional complement to client limit)
  await assertWithinRateLimit(authorDeviceId, { windowMin: 5, maxActions: 2 });

  // 2) Load editable prompt from Firestore
  const promptDoc = await db.doc("config/moderationPrompt").get();
  const systemPrompt = promptDoc.get("system") || "You are a strict content moderator…";

  // 3) Call GPT for a moderation decision
  const decision = await openai.moderate({
    prompt: systemPrompt,
    text
  }); // your wrapper that returns { allow: boolean, reason?: string }

  if (!decision.allow) {
    return { status: "rejected", reason: decision.reason || "Violates guidelines" };
  }

  // 4) Deliver (write to Firestore / fan out notifications, etc.)
  const postRef = await db.collection("posts").add({
    text, createdAt: Date.now(), authorDeviceId
  });

  return { status: "approved", id: postRef.id };
});`,
            caption:
              "Editable prompt in Firestore → single-tier GPT decision → gate delivery",
          },
          media: {
            type: "image",
            src: "/media/moderation-pipeline.svg",
            alt: "Simple moderation flow: rate-limit → GPT decision → deliver or reject",
          },
        },
        {
          title: "Context-Aware Real-Time Notifications",
          context:
            "Users should receive timely alerts for new pleas and encouragements, but not be interrupted by redundant notifications if already viewing the relevant screen.",
          approach: [
            "Cloud Functions trigger on new Firestore activity and send notifications to all relevant users except the creator.",
            "On the client, use React Context to track the current app screen; if a notification matches the current view, suppress the OS push and show an in-app toast instead.",
            "Unread counters and badge icons are updated locally to reflect new activity.",
          ],
          impact: [
            { label: "Redundant push suppression", value: "99%+" },
            {
              label: "User experience",
              value: "Instant, non-intrusive alerts",
            },
            {
              label: "Unreads always accurate",
              value: "Tab badges reflect state",
            },
          ],
          outcome:
            "Users always get timely, relevant alerts, but never get interrupted by duplicate pushes for content they’re already viewing.",
          tradeoffs: [
            "Requires accurate client-side tracking of app state for reliable suppression.",
            "Rare edge case: Users may get a notification if state changes during delivery window.",
          ],
          technologies: [
            "Firebase Cloud Functions",
            "Expo Notifications",
            "React Context (active screen tracking)",
          ],
          code: {
            language: "ts",
            snippet:
              "// Cloud Function: Send push to all relevant users\nexports.onNewPlea = functions.firestore\n  .document('pleas/{pleaId}')\n  .onCreate(async (snap, context) => {\n    const plea = snap.data();\n    const recipients = await getRelevantUserIds(plea);\n    await sendPushToUsers(recipients, {\n      title: 'Someone needs encouragement!',\n      body: plea.message,\n      data: { type: 'plea', pleaId: context.params.pleaId }\n    });\n  });\n\n// Client: Suppress foreground notifications\nNotifications.addNotificationReceivedListener((notif) => {\n  if (isViewingPlea(notif.data?.pleaId)) {\n    showInAppToast(notif);\n    return; // Don't show OS push\n  }\n  // Otherwise, allow push as normal\n});",
            caption:
              "Server: Firestore trigger sends push to all relevant users. Client: Suppresses OS push if content is already in view.",
          },
          media: {
            type: "image",
            src: "/media/notification-cohorts.svg",
            alt: "Notification delivery and client suppression flow",
          },
        },
        {
          title: "Dynamic Firestore Listeners for Real-Time Feeds",
          context:
            "Community pleas for help must sort and update LIVE based on real user interactions, but naive listeners on every document would explode Firestore costs and crash performance.",
          approach: [
            "Shard live listeners: use a single top-level listener for the latest N approved pleas (excluding the current user), sorted and filtered as needed.",
            "For each visible plea, dynamically attach a subcollection listener for encouragements; clean these up as pleas scroll out of view.",
            "Merge base plea data and live encouragement subcounts client-side, ensuring efficient state updates and smooth real-time feed sorting.",
            "In-memory, memoized sort: Prioritize pleas with fewest encouragements, then by oldest first.",
          ],
          impact: [
            { label: "Listener count", value: "−90%" },
            { label: "Feed update latency", value: "< 200ms" },
            {
              label: "Cost scaling",
              value: "scales with active users, not content size",
            },
          ],
          outcome:
            "Stable, low-cost real-time feed with instant updates and fair ordering—listener usage stays low even during bursty community activity.",
          tradeoffs: [
            "Slightly higher code complexity: dynamic management of subcollection listeners and cleanup.",
            "Recent-feed scope: only the N most recent pleas update live; older items update when scrolled into view.",
            "Each user can open up to N+1 listeners (feed + subcollections), but this is capped and far cheaper than naive global listeners.",
          ],
          technologies: [
            "Firestore onSnapshot",
            "React useEffect",
            "Client-side refs & cleanup",
            "Dynamic subcollection listeners",
          ],
          code: {
            language: "ts",
            snippet:
              '// Top-level: Listen for recent approved pleas (excluding user\'s own)\nconst unsubPleas = onSnapshot(pleasQuery, (snapshot) => {\n  const currentPleaIds = new Set(snapshot.docs.map((doc) => doc.id));\n  // Clean up sublisteners for removed pleas\n  Object.keys(encouragementListenersRef.current).forEach((pleaId) => {\n    if (!currentPleaIds.has(pleaId)) {\n      encouragementListenersRef.current[pleaId]();\n      delete encouragementListenersRef.current[pleaId];\n    }\n  });\n  // For each plea, set up encouragement listener if not present\n  snapshot.docs.forEach((doc) => {\n    if (!encouragementListenersRef.current[doc.id]) {\n      const encQuery = query(\n        collection(db, "pleas", doc.id, "encouragements"),\n        where("status", "==", "approved")\n      );\n      encouragementListenersRef.current[doc.id] = onSnapshot(encQuery, (encSnap) => {\n        // ...update state for this plea\n      });\n    }\n  });\n});\n// Cleanup all listeners on unmount\nreturn () => {\n  unsubPleas();\n  Object.values(encouragementListenersRef.current).forEach((unsub) => unsub());\n  encouragementListenersRef.current = {};\n};',
            caption:
              "Top-level and per-plea listeners update the feed live—only visible pleas have subcollection listeners, with efficient cleanup and state merging.",
          },
          media: {
            type: "image",
            src: "/media/realtime-architecture.svg",
            alt: "Real-time Firestore listener architecture",
          },
        },
        {
          title: "100% Anonymity with Durable, Account-less Profiles",
          context:
            "Users must remain anonymous and retain a stable personal history (streaks, preferences) without creating a formal account or storing any PII.",
          approach: [
            "Device-bound anonymous identity: each app install gets a unique, stable UID (no username, email, or phone required).",
            "Firestore Security Rules: strict per-UID access—users can only read or write their own data.",
            "Zero PII stored anywhere in Firestore, including for moderation.",
          ],
          impact: [
            { label: "PII stored", value: "0" },
            { label: "Account creation", value: "Not required" },
          ],
          outcome:
            "True user privacy and persistence—users stay fully anonymous, never create an account, and their personal progress is always local to their device.",
          tradeoffs: [
            "If the app is deleted or device changes, history is lost (unless user exports a recovery key—planned feature).",
            "On shared devices, multiple people may share the same anonymous identity.",
          ],
          technologies: ["Firebase Anonymous Auth", "Firestore Security Rules"],
          code: {
            language: "ts",
            snippet:
              "export async function ensureSignedIn() {\n  await new Promise<void>((resolve) => {\n    const unsubscribe = onAuthStateChanged(auth, (user) => {\n      unsubscribe();\n      resolve();\n    });\n  });\n  if (!auth.currentUser) {\n    await signInAnonymously(auth); // No username/email/PII ever collected!\n  }\n}\n\n// firestore.rules (backend)\nmatch /users/{uid} {\n  allow read, write: if request.auth.uid == uid;\n}",
            caption:
              "Anonymous auth is ensured for every user; all data is stored under device-bound UID. Firestore rules strictly prevent access to any other user's data.",
          },

          media: {
            type: "image",
            src: "/media/anon-identity.svg",
            alt: "Anonymous identity model",
          },
        },
        {
          title: "Custom Reusable Morphing UI",
          context:
            "Any tappable element can morph into a full-screen modal with pixel-perfect visual continuity, creating a signature, premium app experience.",
          approach: [
            "Single API: pass anchor refs and destination; Bridge measures, snapshots, and animates shared geometry.",
            "Optimized for React Native/Expo: uses Reanimated and real-time layout snapshots, with safe area handling and interaction disabling mid-morph.",
            "Ultra-smooth even for heavy modals: FlatList/lazy loading ensures heavy content (like comments or messages) is loaded only *after* the transition completes, maintaining flawless animation performance.",
          ],
          impact: [
            { label: "Implementation reuse", value: "1 component" },
            { label: "Animation jank", value: "~0% (prod)" },
            { label: "Dev time saved", value: "−60%" },
          ],
          outcome:
            "Signature, premium feel reused across Help Requests, Messages, and Settings—modal transitions that feel as seamless as native iOS.",
          tradeoffs: [
            "Measuring on low-end devices requires throttling frames to ensure performance.",
          ],
          technologies: ["React Native", "Reanimated", "Expo", "TypeScript"],
          code: {
            language: "tsx",
            snippet:
              "export function ButtonModalTransitionBridge({ anchorRef, children, modal }) {\n  const [snapshot, setSnapshot] = useState<Rect | null>(null);\n  const open = () => {\n    const rect = measure(anchorRef.current);\n    setSnapshot(rect);\n    animateTo(modalRect(rect)); // shared geometry interpolation\n  };\n  return children({ open, snapshot });\n}",
            caption: "Shared geometry interpolation from anchor → modal",
          },
          media: {
            type: "video",
            src: "/media/bridge-morph.mp4",
            alt: "Button → Modal morph demo",
          },
        },
      ],
    },
    results: {
      intro:
        "Anchor launched as a grassroots project within my local church community, aiming to provide a safe, anonymous space for accountability and support. Early feedback has been deeply encouraging.",
      outcomes: [
        {
          title: "Real Impact",
          points: [
            "Users like the anonmymity associated with reaching out",
            "One-on-one encouragement and daily check-ins are cited as the app’s most valuable features.",
            "Several users have already begun building new streaks and habits with Anchor’s help.",
          ],
        },
        {
          title: "Technical Foundation",
          points: [
            "Launched on the Apple App Store with 100% anonymous accounts.",
            "Zero reported bugs or crashes in first weeks of use.",
            "Push notification flow and daily content pipeline fully automated.",
          ],
        },
        {
          title: "What’s Next",
          points: [
            "Planned android launch based on early feedback.",
            "Exploring adding a small 'close group' of trusted peers to reach out to",
            "Gathering more stories to help others find hope and support.",
          ],
        },
      ],
    },
    gallery: {
      intro: "",
      media: [
        {
          type: "image",
          title: "Home Screen",
          description: "Daily check-in interface with AI-generated prompt",
          placeholder: "anchor-home.jpg",
        },
        {
          type: "image",
          title: "Community Feed",
          description: "Anonymous posts from community members",
          placeholder: "anchor-feed.jpg",
        },
        {
          type: "image",
          title: "Progress Dashboard",
          description: "Visual tracking of streaks and consistency",
          placeholder: "anchor-progress.jpg",
        },
        {
          type: "video",
          title: "App Walkthrough",
          description: "Complete feature demonstration",
          placeholder: "anchor-demo.mp4",
        },
        {
          type: "image",
          title: "Notification System",
          description: "Smart notification timing and preferences",
          placeholder: "anchor-notifications.jpg",
        },
        {
          type: "image",
          title: "Moderation Dashboard",
          description: "Tools for maintaining community health",
          placeholder: "anchor-moderation.jpg",
        },
      ],
    },
  },

  // ========= NEW CASE STUDY: Dialed (AI Meal Planner) =========
  dialed: {
    slug: "dialed",
    orientation: "landscape",
    hero: {
      title: "Dialed",
      tagline:
        "An AI-powered meal planner that turns food preferences and targets into portion-accurate days with dynamic variety",
      role: "Solo Developer",
      timeline: "8 months (ongoing)",
      year: "2024",
      buttons: [
        {
          type: "demo",
          label: "View Demo Site",
          url: "https://meal-planner-ai-app.vercel.app/",
        },
        {
          type: "github",
          label: "View on GitHub",
          url: "https://github.com/jrmoynihan99/meal-planner-ai-app",
        },
      ],
    },
    overview: {
      description:
        "Dialed is a React/Next.js meal planning app that converts calorie and protein goals into realistic meals, portion-accurate daily plans, and a weekly schedule with recipes and a grocery list. Users first select preferences via a guided questionnaire, approve AI-generated meals, then the app builds optimized day plans that hit targets by scaling ingredient portions. Finally, users arrange their week with dynamic variety and customization",
      goals: [
        "Make meal planning fast and amazing with dynamic AI powered meals",
        "Hit daily calorie/protein targets precisely via optimization",
        "Allow users to easily swap in new meals, auto portioned to fit",
        "Give users recipes and a weekly grocery list to remove barriers to following the plan",
      ],
      orientation: "both",
      mediaByDevice: {
        desktop: {
          type: "video",
          src: "/assets/case-studies/dialed/dialed-solver.mp4",
          alt: "Dialed meal planner walkthrough on desktop",
        },
        mobile: {
          type: "video",
          src: "/assets/case-studies/dialed/dialed-solver-mobile.mp4",
          alt: "Dialed meal planner walkthrough on mobile",
        },
      },
    },
    problemSolution: {
      pairs: [
        {
          problem: {
            title: "What do I eat?",
            description:
              "Most people don’t know what foods are healthy, realistic, or fit their tastes. Nevermind what will help them make progress toward their goals. The result is decision fatigue and never making a solid plan.",
          },
          solution: {
            title: "Guided Meal Discovery",
            description:
              "Dialed starts with a short preference questionnaire, then uses AI to generate a personalized set of meals with images and recipes. Users simply approve or decline cards, so their plan is built only from foods they actually want to eat.",
            tech: ["Next.js", "OpenAI API", "Zustand"],
            featureLink: "#feature-2,3",
            implementationLink: "#technical-challenge-0",
          },
        },
        {
          problem: {
            title: "How much should I eat?",
            description:
              "Figuring out calories and protein portions is overwhelming. Not only do people not know how much protein or calories to consume, but it's also hard to do the portioning.",
          },
          solution: {
            title: "Automatic Portioning",
            description:
              "Dialed calculates calorie and protein targets upfront, then uses a custom solver to portion meals automatically. Users never touch the math—meals scale to hit targets precisely, every day, with their chosen meals per day.",
            tech: ["TypeScript", "GLPK.js", "Linear Programming"],
            featureLink: "#feature-4,1",
            implementationLink: "#technical-challenge-1",
          },
        },
        {
          problem: {
            title: "I want variety, but repeatability",
            description:
              "Nobody wants to eat the same thing every day, but they also don't want cooking and shopping to be a nightmare.",
          },
          solution: {
            title: "Portion Locking + Unique Days",
            description:
              "Once a meal is portioned in a position (e.g., lunch), it stays consistent across the week. Dialed then generates as many unique daily plans as possible using all users approved meals",
            tech: ["Solver constraints", "Zustand store"],
            implementationLink: "#technical-challenge-2",
          },
        },
        {
          problem: {
            title: "Meal plans get boring fast",
            description:
              "Even the best plan wears thin after a few weeks. Most meal planners force you to stick with the same foods or redo the entire process from scratch.",
          },
          solution: {
            title: "Dynamic Swaps, Zero Effort",
            description:
              "With Dialed, variety is built in. Approve a new meal or select from your approved set and swap it in for any existing meal. The solver instantly regenerates complete daily plans with updated recipes and grocery lists—no manual recalculation required.",
            tech: ["Next.js", "Zustand", "Solver integration"],
          },
        },
      ],
    },

    features: {
      intro:
        "Dialed handles the entire meal planning workflow—from targets to recipes—so users don't have to guess or do the math.",
      orientation: "both",
      features: [
        {
          title: "Personalized Plans",
          description:
            "Dialed calculates maintenance calories for the individual based on provided bio data and activity level using the Mifflin-St Jeor Equation",
          icon: "Gauge",
          mediaByDevice: {
            desktop: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-data.mp4",
              poster: "/assets/case-studies/dialed/dialed-data.jpg",
              alt: "Personalized plan interface on desktop",
            },
            mobile: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-data-mobile.mp4",
              poster: "/assets/case-studies/dialed/dialed-data-mobile.jpg",
              alt: "Personalized plan interface on mobile",
            },
          },
        },
        {
          title: "Calorie + Protein Targets",
          description:
            "Dialed calculates personalized daily calorie and protein goals based on users goals. Clarity from the start.",
          icon: "Gauge",
          mediaByDevice: {
            desktop: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-goal.mp4",
              poster: "/assets/case-studies/dialed/dialed-goal.jpg",
              alt: "Goal interface on desktop",
            },
            mobile: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-goal-mobile.mp4",
              poster: "/assets/case-studies/dialed/dialed-goal-mobile.jpg",
              alt: "Goal interface on mobile",
            },
          },
        },
        {
          title: "Ingredient Questionnaire",
          description:
            "Pick proteins, carbs, veggies, and exclusions. Feeds GPT to generate on-target, realistic meals with recipes.",
          icon: "ListChecks",
          mediaByDevice: {
            desktop: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-questionnaire.mp4",
              poster: "/assets/case-studies/dialed/dialed-questionnaire.jpg",
              alt: "Questionnaire interface on desktop",
            },
            mobile: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-questionnaire-mobile.mp4",
              poster:
                "/assets/case-studies/dialed/dialed-questionnaire-mobile.jpg",
              alt: "Questionnaire interface on mobile",
            },
          },
        },
        {
          title: "AI Meal Generation with Images",
          description:
            "AI-generated meals arrive as cards with images and recipes. Approve to keep, skip to replace—no clutter, no overwhelm.",
          icon: "Sparkles",
          mediaByDevice: {
            desktop: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-meals.mp4",
              poster: "/assets/case-studies/dialed/dialed-meals.jpg",
              alt: "Meal Generation interface on desktop",
            },
            mobile: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-meals-mobile.mp4",
              poster: "/assets/case-studies/dialed/dialed-meals-mobile.jpg",
              alt: "Meal Generation interface on mobile",
            },
          },
        },
        {
          title: "Portion-Accurate Day Builder",
          description:
            "A custom solver scales meal ingredients to hit calorie and protein targets exactly, respecting fixed vs scalable ingredient items.",
          icon: "Scale",
          mediaByDevice: {
            desktop: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-solver.mp4",
              poster: "/assets/case-studies/dialed/dialed-solver.jpg",
              alt: "Solver loading interface on desktop",
            },
            mobile: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-solver-mobile.mp4",
              poster: "/assets/case-studies/dialed/dialed-solver-mobile.jpg",
              alt: "Solver loading interface on mobile",
            },
          },
        },
        {
          title: "Weekly Planner with Drag-and-Drop",
          description:
            "Arrange unique days on a weekly grid. Drag to reorder, snap meals to precise times, and assign days in seconds.",
          icon: "CalendarDays",
          mediaByDevice: {
            desktop: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-planner.mp4",
              poster: "/assets/case-studies/dialed/dialed-planner.jpg",
              alt: "Weekly planner interface on desktop",
            },
            mobile: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-planner-mobile.mp4",
              poster: "/assets/case-studies/dialed/dialed-planner-mobile.jpg",
              alt: "Weekly planner interface on mobile",
            },
          },
        },
        {
          title: "Easy Variety Toggles",
          description:
            "Dialed keeps plans fresh without chaos. Use simple variety controls to shuffle through all valid daily plans while keeping portions locked and shopping consistent.",
          icon: "Shuffle",
          mediaByDevice: {
            desktop: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-variety.mp4",
              poster: "/assets/case-studies/dialed/dialed-variety.jpg",
              alt: "Variety interface on desktop",
            },
            mobile: {
              type: "video",
              src: "/assets/case-studies/dialed/dialed-variety-mobile.mp4",
              poster: "/assets/case-studies/dialed/dialed-variety-mobile.jpg",
              alt: "Variety interface on mobile",
            },
          },
        },
      ],
    },

    techStack: {
      intro:
        "Modern web stack with mathematical optimization, AI integration, and a polished front-end experience.",
      categories: [
        {
          title: "Frontend",
          technologies: [
            "React",
            "Next.js",
            "TypeScript",
            "Zustand",
            "Tailwind CSS",
            "shadcn/ui",
            "@dnd-kit",
            "Framer Motion",
          ],
        },
        {
          title: "Backend & Optimization",
          technologies: [
            "Next.js API Routes",
            "OpenAI API",
            "GLPK.js (Linear Programming)",
            "Deviation-based objective",
          ],
        },
        {
          title: "Tools & Services",
          technologies: ["Vercel", "GitHub", "ESLint"],
        },
        {
          title: "Development",
          technologies: ["Vitest/Jest (planned)", "Storybook (planned)"],
        },
      ],
    },
    technicalChallenges: {
      intro:
        "Engineering highlights across AI generation, mathematical optimization, randomized ordering search, and high-polish UX.",
      challenges: [
        {
          title: "AI Meal Creation & Edit Pipeline",
          context:
            "Users begin with a structured ingredient preference questionnaire and then refine via chat. The system must generate new meals, edit existing ones in place, avoid duplicates, and stay snappy for a truly unique adn flexible meal creation system UX.",
          approach: [
            "Prompt builder composes a deterministic system prompt from questionnaire selections (proteins, carbs, veggies, exclusions).",
            "Chat intent router classifies inputs as (generate more, or edit) applies append or in-place edit accordingly.",
            "Dedup guard using a canonical meal signature (normalized name + top ingredients) to prevent near-duplicates.",
            "Async images: render cards instantly with placeholders; enqueue image jobs; patch meals with URLs when ready (more on this below)",
          ],
          impact: [
            { label: "TTI", value: "≈50% faster first render" },
            { label: "Quality", value: "Edits don’t inflate card count" },
            { label: "Consistency", value: "Stable schema for UI/state" },
          ],
          outcome:
            "A responsive creation/edit flow where users can iterate quickly—cards appear immediately, edits are surgical, and visuals catch up without blocking. This creates a truly unique personlized experience.",
          tradeoffs: [
            "Slightly more complex routing and diff logic vs. a single ‘generate’ path.",
            "Requires consistent canonicalization to keep dedup reliable across prompts.",
            "Eventual consistency for images (brief placeholder state).",
          ],
          technologies: ["Next.js API Routes", "OpenAI API", "Zustand"],
          code: {
            language: "ts",
            snippet: `// Minimal orchestration
const intent = classify(state, action);

if (intent === "generate") {
  setState("loading");
  const res = await fetch("/api/meal-brainstorm", {
    method: "POST",
    body: JSON.stringify({ prefs, mealsPerDay, approved, generated }),
  });
  const incoming: Meal[] = await res.json();
  const unique = dedup(incoming, generated, approved);
  const next = [...generated, ...unique];
  setGenerated(next); setState("completed");

  // async images (non-blocking)
  unique.forEach(m => queueImage(m,
    p => patchGenerated(list => list.map(x => x.id===p.id ? p : x))
  ));
} else {
  // refine in place
  const res = await fetch("/api/meal-edit", {
    method:"POST",
    body: JSON.stringify({ generatedMeals: generated, userRequest }),
  });
  const patch = await res.json(); // { replaceId?, editedMeal?, removedIds? }
  let next = generated;
  if (patch.replaceId && patch.editedMeal)
    next = next.map(m => m.id===patch.replaceId ? patch.editedMeal : m);
  if (patch.removedIds)
    next = next.filter(m => !patch.removedIds.includes(m.id));
  setGenerated(next);
  if (patch.editedMeal) queueImage(patch.editedMeal,
    p => patchGenerated(list => list.map(x => x.id===p.id ? p : x))
  );
}`,
            caption:
              "Classify intent (generate vs. refine), dedup by signature, hydrate images asynchronously, and apply edits in place without inflating card count.",
          },

          media: {
            type: "image",
            src: "/media/dialed-ai-pipeline.svg",
            alt: "Questionnaire → GPT → Cards with async images",
          },
        },

        {
          title: "LP Solver with Portion Locking & Slot Constraints",
          context:
            "Hit daily calorie/protein targets while sauces/spices remain fixed, primary ingredients scale, and portions stay consistent per (meal, slot).",
          approach: [
            "Decision variables only for scalable ingredients; fixed items contribute macros but never scale.",
            "Deviation-based objective: minimize |calories−target| + |protein−target| with tunable weights.",
            "(mealId, slotIndex) portion locking: once solved for a slot, the portion is reused wherever that slot/meal appears.",
            "Return precise grams and user-friendly amounts for display; persist locks to state.",
          ],
          impact: [
            { label: "Accuracy", value: "Near-exact targets daily" },
            { label: "Consistency", value: "Identical portions per slot" },
          ],
          outcome:
            "Days that actually hit targets without weird micro-adjustments, and that stay consistent across the week for easier prep and shopping.",
          tradeoffs: [
            "LP modeling and debugging is more complex than heuristics.",
            "Solver constraints must be curated to avoid infeasible problem setups.",
          ],
          technologies: ["TypeScript", "GLPK.js", "Linear Programming"],
          code: {
            language: "ts",
            snippet: `// solveDayPortions (super-compact)
import initGLPK from "glpk.js";

export async function solveDayPortions(dayMeals: Meal[], CalTarget: number, ProTarget: number, locks: Record<string,{totalCalories:number;totalProtein:number}>){
  const glpk = await initGLPK();

  // remaining targets after locked portions
  const lockedCals = Object.values(locks).reduce((s,p)=>s+p.totalCalories,0);
  const lockedProt = Object.values(locks).reduce((s,p)=>s+p.totalProtein,0);
  const remCal = CalTarget-lockedCals, remPro = ProTarget-lockedProt;

  // tolerances + main protein requirement
  const CAL_LO=100, CAL_UP=100, PRO_LO=10, PRO_UP=30, MAIN_PCT=0.5, pctMul=MAIN_PCT/(1-MAIN_PCT);

  // vars per meal: s_i (non-main scale), mp_i (main-protein multiplier)
  const varNames:string[]=[]; const coefCal:number[]=[], coefPro:number[]=[]; const rows:any[]=[];
  dayMeals.forEach((meal,i)=>{
    const s=\`s_\${i}\`, mp=\`mp_\${i}\`; varNames.push(s,mp);
    let nonMainCal=0, nonMainPro=0, mainCal=0, mainPro=0;
    meal.ingredients.forEach(ing=>{
      if(!ing.grams) return;
      const calG=ing.calories_per_gram ?? (ing.calories||0)/(ing.grams||1);
      const proG=ing.protein_per_gram ?? (ing.protein||0)/(ing.grams||1);
      const cal=(ing.grams||0)*calG, pro=(ing.grams||0)*proG;
      (ing.main===1 ? (mainCal+=cal, mainPro+=pro) : (nonMainCal+=cal, nonMainPro+=pro));
    });
    coefCal.push(nonMainCal, mainCal); coefPro.push(nonMainPro, mainPro);

    // per-meal calorie guardrails around remaining calories
    const base=1/Math.max(dayMeals.length,1), tol=0.1, lo=(base-tol)*remCal, up=Math.min(1.1,base+tol)*remCal;
    const coef = Array(varNames.length).fill(0); coef[2*i]=nonMainCal; coef[2*i+1]=mainCal;
    const mk = (name:string, type:number, lb:number, ub:number)=>({name, bnds:{type,lb,ub}, vars:varNames.map((v,j)=>({name:v,coef:coef[j]||0}))});
    rows.push(mk(\`meal\${i}_lo\`, glpk.GLP_LO, Math.max(0,lo), 0), mk(\`meal\${i}_up\`, glpk.GLP_UP, 0, Math.max(0,up)));

    // ≥50% of protein from main:  mainPro*mp_i >= pctMul*nonMainPro*s_i
    const coefPct = Array(varNames.length).fill(0); coefPct[2*i+1]=mainPro; coefPct[2*i]=-pctMul*nonMainPro;
    rows.push({name:\`mainPct_\${i}\`, bnds:{type:glpk.GLP_LO, lb:0, ub:0}, vars:varNames.map((v,j)=>({name:v,coef:coefPct[j]||0}))});
  });

  // day windows on remaining targets
  const mkRow=(name:string, coefs:number[], type:number, lb:number, ub:number)=>({
    name, bnds:{type,lb,ub}, vars:varNames.map((v,i)=>({name:v,coef:coefs[i]||0}))
  });
  const subjectTo = [
    mkRow("dayCalLo", coefCal, glpk.GLP_LO, remCal-CAL_LO, 0),
    mkRow("dayCalUp", coefCal, glpk.GLP_UP, 0, remCal+CAL_UP),
    mkRow("dayProLo", coefPro, glpk.GLP_LO, remPro-PRO_LO, 0),
    mkRow("dayProUp", coefPro, glpk.GLP_UP, 0, remPro+PRO_UP),
    ...rows
  ];

  // bounds + objective
  const bounds = varNames.map((v,i)=>({name:v, type:glpk.GLP_DB, lb:0, ub:(i%2===0)?100:10}));
  const objective = { direction:glpk.GLP_MIN, name:"smooth", vars:varNames.map(n=>({name:n,coef:1})) };

  const { result } = await glpk.solve({ name:"dayPlan", objective, subjectTo, bounds }, { msglev:0 }) as any;
  if(!result) return { valid:false, meals:[], dayCalories:0, dayProtein:0 };

  // map solution → portions
  let dayCalories=0, dayProtein=0; const meals:PortionedMeal[]=[];
  dayMeals.forEach((meal,i)=>{
    const s=result.vars[\`s_\${i}\`]??1, mp=result.vars[\`mp_\${i}\`]??1; let cal=0, pro=0;
    const ingredients = meal.ingredients.map(ing=>{
      const scale = (ing.main===1)? mp : s; const grams=(ing.grams||0)*scale;
      const calG=ing.calories_per_gram ?? (ing.calories||0)/(ing.grams||1);
      const proG=ing.protein_per_gram ?? (ing.protein||0)/(ing.grams||1);
      cal += grams*calG; pro += grams*proG; return { ...ing, grams };
    });
    dayCalories+=cal; dayProtein+=pro;
    meals.push({ mealId:meal.id, mealName:meal.name, ingredients, totalCalories:cal, totalProtein:pro });
  });

  const valid = dayCalories>=CalTarget-CAL_LO && dayCalories<=CalTarget+CAL_UP &&
                dayProtein>=ProTarget-PRO_LO && dayProtein<=ProTarget+PRO_UP;
  return { valid, meals, dayCalories, dayProtein };
}`,
            caption:
              "GLPK.js day solver: scale only what’s scalable (s_i, mp_i), constrain remaining calorie/protein windows, enforce per-meal calorie bands and ≥50% main-protein, then reuse portions via slot locks.",
          },

          media: {
            type: "image",
            src: "/media/dialed-solver.svg",
            alt: "Fixed vs scalable variables and slot-locked portions",
          },
        },

        {
          title: "Maximizing Unique Days via Randomized Ordering Search",
          context:
            "Given approved meals and meals-per-day, generate as many valid day plans as possible under slot/portion constraints—without exploding combinatorially.",
          approach: [
            "Enumerate candidate day compositions from approved meals under slot locking; bundle into weekly plan candidates.",
            "For each weekly plan, sample K random orderings (rather than all permutations).",
            "Sequential solve per ordering: optimize Day 1 → lock portions; then Day 2 using the locks; continue until infeasible.",
            "Keep the ordering that yields the largest valid-day set for that weekly plan; repeat for all weekly plans.",
            "Persist every resulting valid-day set to storage for downstream variety browsing.",
          ],
          impact: [
            { label: "Variety yield", value: "Max valid days per time budget" },
            { label: "Latency control", value: "Bounded via K (sampling)" },
          ],
          outcome:
            "Produces a rich library of feasible day plans within a predictable runtime budget, enabling meaningful variety without chaos.",
          tradeoffs: [
            "Random sampling is non-deterministic; best-found set can vary run-to-run.",
            "Sequential locking can cause early commitments that block later days.",
          ],
          technologies: ["TypeScript", "GLPK.js", "Randomized search"],
          code: {
            language: "ts",
            snippet: `// Randomized ordering search (compact, representative)
const K = 8; // samples per set (tune for latency/quality)

async function maximizeUniqueDays({
  approvedMeals, mealsPerDay, calTarget, proTarget, variety,
  setStepThreeData, router
}: {
  approvedMeals: Meal[]; mealsPerDay: number; calTarget: number; proTarget: number;
  variety: "none"|"less"|"some"|"lots"; setStepThreeData: (p:any)=>void; router: any;
}) {
  // 1) Enumerate all slot-respecting day combos, then build slot-consistent sets
  const combos = generateDayCombinations(approvedMeals, mealsPerDay);     // string[][] (meal names/ids per day)
  const validSets = findValidDaySets(combos);                              // string[][][]

  // Map names/ids → Meal
  const mealData: Record<string, Meal> = Object.fromEntries(
    approvedMeals.map(m => [m.name, m])
  );

  const chosenResults: OrderingResult[] = [];

  // 2) For each set, sample K orderings; solve sequentially with locks; keep max-valid
  for (const set of validSets) {
    const orderings = generateRandomOrderings(set, K);                     // T[][][]
    const results: (OrderingResult|null)[] = [];
    for (const ordering of orderings) {
      try {
        const res = await solveOrderingSequence(ordering, mealData, calTarget, proTarget);
        results.push(res);
      } catch { results.push(null); }
    }
    const maxValid = results.reduce((m,r)=>r?Math.max(m,r.validDays):m, 0);
    const best = results.filter((r): r is OrderingResult => !!r && r.validDays === maxValid);
    if (best.length) chosenResults.push(best[Math.floor(Math.random()*best.length)]);
  }

  // 3) Format chosen sets into UI day plans and persist for variety browsing
  const { allPlanOneDays, allPlanTwoDays, allPlanThreeDays } =
    buildZustandDayPlans(chosenResults, approvedMeals);

  const shuffleIndices = {
    weeklySchedule: { none:0, less:0, some:0, lots:0 },
    weeklyScheduleTwo: { none:0, less:0, some:0, lots:0 },
    weeklyScheduleThree: { none:0, less:0, some:0, lots:0 },
  };

  setStepThreeData({
    allPlanOneDays, allPlanTwoDays, allPlanThreeDays, variety, shuffleIndices
  });

  updateWeeklyScheduleForVariety(
    variety, allPlanOneDays, allPlanTwoDays, allPlanThreeDays,
    shuffleIndices, setStepThreeData, mealsPerDay, "set"
  );

  router.push("/your-plan");
}`,
            caption:
              "Enumerate slot-respecting day combos → build slot-consistent sets → sample K random orderings → sequentially solve with portion locks → keep the ordering with the most valid days per set → persist formatted plans for variety browsing.",
          },

          media: {
            type: "image",
            src: "/media/dialed-ordering-search.svg",
            alt: "Randomized ordering loop with sequential locks",
          },
        },

        {
          title: "Variety Picker + Weekly Grid UX",
          context:
            "Plans get boring unless variety is easy. Users should toggle how much variety they want, swipe through precomputed valid day sets, and schedule precisely.",
          approach: [
            "Variety picker selects among stored valid-day sets; can target an ‘X-day’ variety level (e.g., 3, 5, 7 unique days).",
            "Swipeable plan browser to review all valid days at the chosen level; portion locks preserve grocery consistency.",
            "Weekly grid integrates with the chosen set: drag-to-reorder, vertical snap to 15-minute intervals, persist `mealTime` to state.",
          ],
          impact: [
            { label: "Adherence", value: "Fresh plans on demand" },
            { label: "Speed", value: "One-tap swaps" },
          ],
          outcome:
            "A tactile, low-friction planner that keeps meals interesting while keeping prep and shopping predictable.",
          tradeoffs: [
            "Precomputed sets require storage and selection heuristics.",
          ],
          technologies: ["@dnd-kit", "Zustand", "Framer Motion"],
          code: {
            language: "ts",
            snippet: `// Variety → Weekly Grid (summary, readable)

// 1) Pick a valid-day set or best-effort fallback
function pickVariety(sets: DayPlan[][], daysWanted: number) {
  return (
    sets.find((s) => s.length === daysWanted) ??
    sets.sort((a, b) => b.length - a.length)[0]
      ?.slice(0, daysWanted) ??
    []
  );
}

// 2) Apply chosen set to weekly schedule
function applyChosenSet(days: DayPlan[], setData: (p: any) => void) {
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const schedule = Object.fromEntries(
    week.map((d, i) => [d, days[i % days.length]?.id ?? null])
  );

  setData({ weeklySchedule: schedule, activeDays: days });
}

// 3) Snap helper (15-minute increments)
const snap15 = (t: Date) => {
  const ms = 15 * 60 * 1000;
  return new Date(Math.round(t.getTime() / ms) * ms);
};

// 4) @dnd-kit onDragEnd → snap + persist mealTime
function onDragEnd(
  { active, over, deltaY }: any,
  state: AppState,
  setData: (p: any) => void
) {
  if (!over) return;

  const { dayId, mealId } = active.data.current;
  const { slotHeightPx, startOfDay } = state.ui.grid;

  const movedMinutes = Math.round((deltaY / slotHeightPx) * 15);
  const oldTime =
    state.daysById[dayId].meals.find((m) => m.id === mealId)?.mealTime ??
    startOfDay;

  const snapped = snap15(
    new Date(oldTime).getTime() + movedMinutes * 60 * 1000
  );

  const meals = state.daysById[dayId].meals.map((m) =>
    m.id === mealId ? { ...m, mealTime: snapped.toISOString() } : m
  );

  setData({
    daysById: {
      ...state.daysById,
      [dayId]: { ...state.daysById[dayId], meals },
    },
  });
}`,
            caption:
              "Pick a valid-day set, map it to the weekly schedule, and use @dnd-kit to drag meals with snap-to-15-min updates persisted in Zustand.",
          },

          media: {
            type: "image",
            src: "/media/dialed-variety-grid.svg",
            alt: "Variety toggle + swipeable plan browser + weekly grid",
          },
        },

        {
          title: "Async Image Generation Pipeline",
          context:
            "Realistic AI images massively bosst the UX when choosing meals, but blocking meal cards on image generation hurts perceived speed.",
          approach: [
            "Render meal cards immediately with placeholders; enqueue image jobs per meal (name + ingredients).",
            "On completion, patch the meal’s image URL in Zustand; cards update in place with no layout shift.",
            "Idempotent writes keyed by mealId to avoid flicker and retry loops.",
          ],
          impact: [
            { label: "Perceived speed", value: "≈50% faster first render" },
          ],
          outcome:
            "Users get amazing AI geenreated images of the meals, so that they can see what they'll be eating, without the UX slowing down.",
          tradeoffs: [
            "Requires background job handling and retry policy.",
            "Images aren't ready immediately, at the whim of the model API",
          ],
          technologies: [
            "Next.js API Routes",
            "OpenAI Images (or provider)",
            "Zustand",
          ],
          code: {
            language: "ts",
            snippet: `// mealGeneration.ts (core flow)

// 1) Generate meals via GPT → render cards immediately
const res = await fetch("/api/meal-brainstorm", {
  method: "POST",
  body: JSON.stringify({ prefs, mealsPerDay }),
});
const meals: Meal[] = await res.json();

setStepThreeData({
  generatedMeals: meals,
  approvedMeals: autoApprove(meals),
});

// 2) Fire-and-forget background image jobs
generateImagesForMealsInBackground(meals, setStepThreeData);

// generateImagesForMealsInBackground.ts
export async function generateImagesForMealsInBackground(
  meals: Meal[],
  setStepThreeData: (p: any) => void
) {
  const toUpdate = meals.filter((m) => !m.imageUrl);

  await Promise.all(
    toUpdate.map(async (meal) => {
      const r = await fetch("/api/generate-meal-images", {
        method: "POST",
        body: JSON.stringify({ meal }),
      });
      const { id, imageUrl } = await r.json();

      if (imageUrl) {
        const updated = useAppStore
          .getState()
          .stepThreeData.generatedMeals.map((m) =>
            m.id === id ||
            m.name.toLowerCase() === meal.name.toLowerCase()
              ? { ...m, imageUrl }
              : m
          );

        setStepThreeData({ generatedMeals: updated });
      }
    })
  );
}

// 3) EditableMealCard.tsx
{meal.imageUrl ? (
  <img
    src={meal.imageUrl}
    className="rounded-lg transition-opacity"
  />
) : (
  <div className="animate-shimmer rounded-lg bg-zinc-700" />
)}
`,
            caption:
              "Generate meals instantly; enqueue background image jobs keyed by mealId; hydrate Zustand with URLs when ready so cards swap placeholders → photos without layout shift.",
          },

          media: {
            type: "image",
            src: "/media/dialed-image-async.svg",
            alt: "Non-blocking image pipeline",
          },
        },
      ],
    },

    results: {
      intro:
        "Dialed was built to explore how AI and optimization can remove friction from healthy eating while keeping plans realistic. While it never launched publicly, the project demonstrates the kind of user value and engineering depth I aim to deliver.",
      outcomes: [
        {
          title: "Intended User Value",
          points: [
            "Generate a complete weekly plan in minutes, tailored to calorie/protein targets.",
            "Portion locking ensures consistency in shopping and meal prep across days.",
            "Drag-and-drop scheduling makes adherence practical and flexible.",
          ],
        },
        {
          title: "Engineering Wins",
          points: [
            "Solver migrated to GLPK.js with a deviation-based optimization objective.",
            "Robust JSON streaming pipeline with phase tags and safe parsing.",
            "High-polish UI: typewriter streaming, Markdown rendering, smooth drag-and-drop.",
          ],
        },
        {
          title: "What’s Next",
          points: [
            "Add macro ranges (min/max) and fiber/fat constraints to the solver.",
            "Export weekly plans to grocery lists and calendars.",
            "Recipe import and nutrition parsing directly from URLs.",
          ],
        },
      ],
    },

    gallery: {
      intro: "",
      media: [
        {
          type: "image",
          title: "Questionnaire",
          description:
            "Pick ingredients and exclusions to guide meal generation",
          placeholder: "dialed-questionnaire.jpg",
        },
        {
          type: "image",
          title: "Meal Cards",
          description: "Approve/refine meals with images and quick actions",
          placeholder: "dialed-meal-cards.jpg",
        },
        {
          type: "image",
          title: "Day Builder",
          description: "Portion-accurate days that hit targets",
          placeholder: "dialed-day-builder.jpg",
        },
        {
          type: "video",
          title: "Weekly Grid",
          description: "Drag-and-drop with time snapping",
          placeholder: "dialed-weekly.mp4",
        },
        {
          type: "image",
          title: "Three-Tab Modal",
          description: "Details, Ingredients, and Recipe in one place",
          placeholder: "dialed-three-tab.jpg",
        },
        {
          type: "image",
          title: "Progress Footer",
          description: "Sticky progress + completion gating",
          placeholder: "dialed-progress.jpg",
        },
      ],
    },
  },
};
