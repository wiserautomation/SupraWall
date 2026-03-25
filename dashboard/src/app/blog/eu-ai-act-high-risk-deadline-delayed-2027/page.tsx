import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Clock,
  AlertTriangle,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title:
    'EU AI Act High-Risk Deadline Delayed to 2027: What AI Agent Teams Must Do Now | SupraWall',
  description:
    'EU Parliament backed fixed 2027-2028 deadlines for high-risk AI. But Article 12 transparency and audit logging requirements still apply from August 2026.',
  keywords: [
    'EU AI Act delay 2027',
    'EU AI Act high-risk deadline',
    'AI Act compliance timeline',
    'EU AI Act August 2026',
    'Article 12 audit logging',
    'AI agent compliance',
  ],
  alternates: {
    canonical: 'https://www.supra-wall.com/blog/eu-ai-act-high-risk-deadline-delayed-2027',
  },
  openGraph: {
    title:
      'EU AI Act High-Risk Deadline Delayed to 2027: What AI Agent Teams Must Do Now',
    description:
      'EU Parliament backed fixed 2027-2028 deadlines for high-risk AI. But Article 12 transparency and audit logging requirements still apply from August 2026.',
    url: 'https://www.supra-wall.com/blog/eu-ai-act-high-risk-deadline-delayed-2027',
    type: 'article',
    images: [
      {
        url: 'https://www.supra-wall.com/og-eu-ai-act-delay.png',
        width: 1200,
        height: 630,
        alt: 'EU AI Act Deadline Delay 2027',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'EU AI Act High-Risk Deadline Delayed to 2027: What AI Agent Teams Must Do Now',
    description:
      'EU Parliament backed fixed 2027-2028 deadlines for high-risk AI. But Article 12 transparency and audit logging requirements still apply from August 2026.',
    images: ['https://www.supra-wall.com/og-eu-ai-act-delay.png'],
  },
};

export default function EUIAActDelayPost() {
  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline:
      'EU AI Act High-Risk Deadline Delayed to 2027: What AI Agent Teams Must Do Now',
    description:
      'EU Parliament backed fixed 2027-2028 deadlines for high-risk AI. But Article 12 transparency and audit logging requirements still apply from August 2026.',
    image: 'https://www.supra-wall.com/og-eu-ai-act-delay.png',
    datePublished: '2026-03-25T00:00:00Z',
    dateModified: '2026-03-25T00:00:00Z',
    author: {
      '@type': 'Organization',
      name: 'SupraWall',
      url: 'https://www.supra-wall.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SupraWall',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.supra-wall.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.supra-wall.com/blog/eu-ai-act-high-risk-deadline-delayed-2027',
    },
    genre: 'Regulatory Analysis',
    keywords:
      'EU AI Act delay, high-risk deadline, Article 12, audit logging, AI compliance',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Has the EU AI Act been delayed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, the EU Parliament joint committee backed fixed 2027-2028 deadlines for high-risk AI systems. On March 18, 2026, the joint committee voted 101 in favor of this timeline shift.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which EU AI Act deadlines still apply in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Article 12 transparency and record-keeping requirements still apply from August 2, 2026. Additionally, Article 14 human oversight requirements remain on the original August 2, 2026 deadline.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does Article 12 of the EU AI Act require?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Article 12 mandates automatic logging of AI system operations, creating traceable and tamper-evident records of all decisions made by high-risk AI systems, with time-stamped action records for audit purposes.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the EU AI Act affect AI agents?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Autonomous agents that make consequential decisions or take independent actions fall under high-risk AI classification, triggering requirements for human oversight, audit logging, and comprehensive documentation.',
        },
      },
      {
        '@type': 'Question',
        name: 'What should AI teams do now to prepare for EU AI Act compliance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start implementing audit logging, human-in-the-loop governance mechanisms, and compliance documentation immediately. Taking action before August 2, 2026 gives you a five-month head start on competitors.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does SupraWall help with EU AI Act compliance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SupraWall provides runtime audit logging, one-click PDF compliance exports, a time-travel audit view for investigation, human-in-the-loop middleware for approval workflows, and policy-driven risk management—all specifically designed for EU AI Act requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the penalties for EU AI Act non-compliance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fines for EU AI Act violations can reach up to €35 million or 7% of a company\'s global annual turnover, whichever is higher. Given that GDPR fines increased 22% year-over-year in 2025, AI compliance penalties are expected to escalate rapidly.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="pt-40 pb-32 px-6">
        <article className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <section className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-[10px] font-black text-amber-400 tracking-[0.2em] uppercase">
              Regulatory Analysis • EU AI Act
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
              EU AI Act Deadline{' '}
              <span className="text-amber-400">Delayed</span> to 2027: What
              Teams Must Do <span className="text-emerald-500">Now</span>
            </h1>

            <div className="border-l-4 border-emerald-500 pl-8">
              <p className="text-xl md:text-2xl text-neutral-300 leading-snug font-medium italic">
                On March 18, 2026, the EU Parliament's joint committee adopted a
                report backing fixed 2027–2028 deadlines for high-risk AI system
                compliance, with 101 votes in favor. However, the delay does not
                apply to all obligations — Article 12 transparency and
                record-keeping requirements still take effect on August 2, 2026.
                Companies that start implementing audit logging and governance now
                have a five-month head start on competitors who mistake the delay
                for a reprieve.
              </p>
            </div>

            <p className="text-lg text-neutral-400 leading-relaxed">
              The deadline shifted, but the obligation didn't. This distinction
              could mean the difference between compliance leadership and
              regulatory scramble for your organization.
            </p>
          </section>

          {/* Breaking: What Changed */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4 flex-1">
                Breaking: What Changed on March 18, 2026
              </h2>
            </div>

            <div className="prose prose-invert prose-emerald max-w-none space-y-6">
              <p className="text-lg text-neutral-400 leading-relaxed">
                The European Parliament's joint committee on artificial
                intelligence voted decisively to reshape the timeline for EU AI
                Act enforcement. On March 18, 2026, with 101 members voting in
                favor, the committee backed a report establishing fixed
                2027–2028 deadlines for high-risk AI system compliance. This
                action followed the Commission's March 12 publication of
                implementation rules for general-purpose AI model supervision,
                with feedback closing April 9.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                The report is tabled for a March 26 European Parliament plenary
                debate, where the full chamber will weigh in before a final vote.
                While the extension provides breathing room for implementation of
                the most complex requirements—risk assessments, documentation,
                conformity procedures—it does <span className="text-emerald-500 font-semibold">not</span> suspend
                immediate obligations. Article 12 (transparency and record-keeping)
                and Article 14 (human oversight) deadlines remain locked at August
                2, 2026.
              </p>

              <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.05] border border-white/5">
                <div className="min-w-fit pt-1">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div className="space-y-3">
                  <h4 className="font-black text-white uppercase tracking-tight">
                    Key Dates Timeline
                  </h4>
                  <ul className="text-neutral-300 space-y-2 text-sm">
                    <li>
                      <strong>March 12, 2026:</strong> Commission publishes
                      implementation rules for GP model supervision
                    </li>
                    <li>
                      <strong>March 18, 2026:</strong> Joint committee votes 101
                      in favor of 2027-2028 timeline
                    </li>
                    <li>
                      <strong>March 26, 2026:</strong> European Parliament plenary
                      debate and vote
                    </li>
                    <li>
                      <strong>August 2, 2026:</strong> Article 12 &amp; 14
                      deadlines remain active
                    </li>
                    <li>
                      <strong>April 9, 2026:</strong> Feedback closes on
                      implementation rules
                    </li>
                    <li>
                      <strong>December 2027 – Mid 2028:</strong> Full high-risk AI
                      compliance deadline (new timeline)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* What Changed vs What Stayed */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
              What Changed vs. What Stayed
            </h2>

            <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-neutral-900/50">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left font-black text-white uppercase tracking-tight">
                      Obligation
                    </th>
                    <th className="px-6 py-4 text-left font-black text-white uppercase tracking-tight">
                      Original Deadline
                    </th>
                    <th className="px-6 py-4 text-left font-black text-white uppercase tracking-tight">
                      New Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      High-risk AI classification requirements
                    </td>
                    <td className="px-6 py-4 text-neutral-400">August 2, 2026</td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400 font-semibold">
                        Delayed → 2027
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      Article 12: Transparency &amp; record-keeping
                    </td>
                    <td className="px-6 py-4 text-neutral-400">August 2, 2026</td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-500 font-semibold">
                        STILL ACTIVE → August 2, 2026
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      Article 14: Human oversight requirements
                    </td>
                    <td className="px-6 py-4 text-neutral-400">August 2, 2026</td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-500 font-semibold">
                        STILL ACTIVE → August 2, 2026
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      General-purpose AI model rules
                    </td>
                    <td className="px-6 py-4 text-neutral-400">August 2, 2025</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">
                      Already in effect
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      Full high-risk compliance
                    </td>
                    <td className="px-6 py-4 text-neutral-400">August 2, 2027</td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400 font-semibold">
                        New timeline: Dec 2027 – Mid 2028
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      AI Liability Directive
                    </td>
                    <td className="px-6 py-4 text-neutral-400">TBD</td>
                    <td className="px-6 py-4 text-neutral-400">
                      Progressing separately
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-lg text-neutral-400 leading-relaxed">
              The critical insight: while the full high-risk compliance window
              extends to December 2027 at earliest, the foundation-level
              requirements—audit logging, human oversight, transparency
              documentation—must be operational five months earlier. Organizations
              that conflate "delay" with "optional" will find themselves rushing to
              implement core systems in the final months before August 2026.
            </p>
          </section>

          {/* Why Delayed Does Not Mean Relax */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4 flex-1">
                Why "Delayed" Does Not Mean "Relax"
              </h2>
            </div>

            <div className="prose prose-invert prose-emerald max-w-none space-y-6">
              <p className="text-lg text-neutral-400 leading-relaxed">
                The narrative around the March 18 decision has been one of
                "relief" and "extension." Industry voices have framed it as a
                reprieve for the most complex implementation tasks. This
                interpretation misses a critical detail: the deadline extension
                applies <span className="text-rose-400 font-semibold">only to specific high-risk classification and
                conformity requirements</span>, not to the transparency and
                governance obligations that form the foundation of EU AI Act
                enforcement.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                Article 12 requires automatic logging and traceable records.
                Article 14 mandates human oversight mechanisms for consequential
                decisions. Both remain due on August 2, 2026—the original date.
                These are not nice-to-have documentation tasks; they are the core
                auditable controls that regulators will verify first.
              </p>

              <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.05] border border-white/5">
                <div className="min-w-fit pt-1">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                </div>
                <div className="space-y-3">
                  <h4 className="font-black text-white uppercase tracking-tight">
                    The Compliance Precedent
                  </h4>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    GDPR fines totaled €1.2 billion in 2025—a 22% year-over-year
                    increase. AI processing is now one of the top three
                    fastest-growing triggers for GDPR penalties. The EU has
                    demonstrated aggressive enforcement of transparency and
                    record-keeping obligations under data protection law. The
                    same enforcement posture will apply to Article 12 and Article
                    14 of the AI Act. Organizations that treat the August 2
                    deadline as "soft" will be the first to face sanctions.
                  </p>
                </div>
              </div>

              <p className="text-lg text-neutral-400 leading-relaxed">
                The window of time separating "prepared" from "scrambling"
                organizations is not 18 months (to December 2027); it's 5 months
                (to August 2026). That's the delta between leadership and
                liability. Unlike competitors who read the delay as a reason to
                pause, organizations implementing audit logging and HITL
                governance now will have a production-tested Compliance OS by
                August 2026 and will be positioned to shift focus to the more
                complex conformity and risk assessment phases without
                firefighting.
              </p>
            </div>
          </section>

          {/* Article 12: Transparency & Record-Keeping */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-500" />
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4 flex-1">
                Article 12: What You Must Implement by August 2, 2026
              </h2>
            </div>

            <div className="prose prose-invert prose-emerald max-w-none space-y-6">
              <p className="text-lg text-neutral-400 leading-relaxed">
                Article 12 of the EU AI Act mandates that high-risk AI systems
                maintain automatic, tamper-evident logs of all operations and
                decisions. This is not a reporting mechanism added after the fact;
                it is a real-time operational requirement built into system
                architecture.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                <strong>Automatic logging:</strong> Every decision made by a
                high-risk AI system must be recorded as it happens. This includes
                inputs, model outputs, confidence scores, post-processing
                decisions, and final actions taken. No sampling. No aggregation.
                Complete fidelity.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                <strong>Traceable records:</strong> The logged data must form an
                auditable chain of evidence. It must be possible to reconstruct
                the exact sequence of events that led to any given AI system
                decision. This requires immutable timestamps, cryptographic
                signatures, and organizational controls that prevent tampering or
                deletion.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                <strong>Time-stamped action records:</strong> Not only must the
                AI system log its outputs; the organization must log what humans
                did with those outputs. Was the AI recommendation accepted,
                rejected, or modified? By whom? When? This intersection of AI
                output and human action is the auditable trail regulators will
                examine first.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                <strong>Investigation-ready format:</strong> The logs must be
                queryable and analyzable. Given a timestamp or a decision ID, an
                auditor or compliance officer must be able to retrieve the full
                context—input data, model version, user who initiated the action,
                and outcome—without writing custom scripts or hiring data
                engineers. This is where a time-travel audit view becomes
                essential: the ability to step backward through system state at
                any point in time to understand what happened and why.
              </p>

              <Link href="/eu-ai-act/article-12" className="inline-block">
                <span className="text-emerald-500 font-semibold hover:text-emerald-400 transition">
                  Deep dive into Article 12 requirements →
                </span>
              </Link>
            </div>
          </section>

          {/* Article 14: Human Oversight */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-500" />
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4 flex-1">
                Article 14: Human Oversight Requirements
              </h2>
            </div>

            <div className="prose prose-invert prose-emerald max-w-none space-y-6">
              <p className="text-lg text-neutral-400 leading-relaxed">
                Article 14 mandates human oversight for high-risk AI systems that
                make or support decisions affecting fundamental rights. For
                autonomous AI agents, this means every consequential action must
                have a human in the loop—not after-the-fact, but integrated into
                the decision workflow.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                <strong>Consequential decisions:</strong> Those affecting
                employment, education, credit, legal status, or safety.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                <strong>Human oversight mechanisms:</strong> The human reviewer
                must have sufficient information and time to understand the AI's
                reasoning and override it. They cannot be a checkbox. They cannot
                be informed only after the fact. The control must be live and
                binding.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                <strong>Competence and authority:</strong> The human must be
                trained and empowered to override the AI. If the reviewer is a
                junior staff member with no authority to block decisions, the
                control fails the regulatory test.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                <strong>Autonomous agents:</strong> Multi-step autonomous agents
                that take independent actions—especially those that trigger
                irreversible outcomes (fund transfers, service terminations,
                access revocations)—are prime candidates for human oversight. A
                rogue agent that executes a sequence of decisions without human
                checkpoint creates liability at every step.
              </p>

              <p className="text-lg text-neutral-400 leading-relaxed">
                SupraWall's human-in-the-loop middleware integrates approval
                workflows directly into agent execution. When an agent encounters
                a high-risk action, it pauses and sends a request to Slack or
                Teams for immediate human review. The human can approve, reject,
                or request modification. The decision is logged. The agent
                proceeds only with explicit authorization. This satisfies both
                Article 14's oversight requirement and Article 12's logging
                mandate.
              </p>

              <Link href="/features/human-in-the-loop" className="inline-block">
                <span className="text-emerald-500 font-semibold hover:text-emerald-400 transition">
                  Explore HITL governance →
                </span>
              </Link>
            </div>
          </section>

          {/* Compliance Checklist */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4 flex-1">
                5-Step Compliance Checklist: Before August 2, 2026
              </h2>
            </div>

            <div className="prose prose-invert prose-emerald max-w-none space-y-6">
              <ol className="list-decimal list-inside space-y-6 text-lg text-neutral-400 leading-relaxed">
                <li>
                  <strong className="text-white">Inventory all AI agents in production and classify risk levels.</strong>
                  <p className="mt-2">
                    List every AI system currently running. Determine which
                    decisions fall under high-risk categories: employment,
                    education, credit, legal status, safety. Document your
                    classification rationale. This is your first regulatory
                    submission artifact.
                  </p>
                </li>
                <li>
                  <strong className="text-white">Implement runtime audit logging for every agent action (Article 12).</strong>
                  <p className="mt-2">
                    Deploy logging infrastructure that captures inputs, model
                    outputs, and final actions in real time. Ensure logs are
                    tamper-evident and time-stamped. SupraWall's Compliance OS
                    automates this: every action is logged with immutable
                    timestamps and metadata. No custom engineering required.
                  </p>
                </li>
                <li>
                  <strong className="text-white">Add human oversight gates for high-risk decisions (Article 14).</strong>
                  <p className="mt-2">
                    Identify the decisions within your agent workflows that
                    require human judgment. For each, insert a checkpoint where
                    humans review and approve or reject the agent's proposed
                    action. Connect this to your team's communication platform
                    (Slack, Teams, email). Ensure the human has time and
                    authority to make an informed decision.
                  </p>
                </li>
                <li>
                  <strong className="text-white">Document data processing purposes and PII handling (GDPR alignment).</strong>
                  <p className="mt-2">
                    Create a data processing addendum that describes what
                    personal data your AI system processes, why, for how long,
                    and with what safeguards. Include records of data subject
                    consent (if applicable). Align this with your existing GDPR
                    documentation. The EU AI Act layers on top of GDPR; if you
                    can't document GDPR compliance, you cannot claim AI Act
                    compliance.
                  </p>
                </li>
                <li>
                  <strong className="text-white">Generate compliance reports and test export workflows.</strong>
                  <p className="mt-2">
                    Practice creating the compliance reports that regulators will
                    request: audit logs, decision trees, human oversight
                    checkpoints, data handling procedures. Verify that your
                    systems can export this data in formats auditors expect (PDF,
                    CSV, SQL dumps). Test the export process end-to-end to
                    identify missing data or format errors before August 2.
                  </p>
                </li>
              </ol>
            </div>
          </section>

          {/* Feature Mapping */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
              How SupraWall Maps to EU AI Act Requirements
            </h2>

            <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-neutral-900/50">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left font-black text-white uppercase tracking-tight">
                      EU AI Act Requirement
                    </th>
                    <th className="px-6 py-4 text-left font-black text-white uppercase tracking-tight">
                      SupraWall Feature
                    </th>
                    <th className="px-6 py-4 text-left font-black text-white uppercase tracking-tight">
                      Implementation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      Article 12: Automatic logging
                    </td>
                    <td className="px-6 py-4 text-neutral-300">Audit Trail</td>
                    <td className="px-6 py-4 text-neutral-400 text-sm">
                      Tamper-evident, time-travel view of every action
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      Article 12: Record-keeping
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      Compliance Export
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-sm">
                      One-click PDF/CSV regulatory reports
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      Article 14: Human oversight
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      HITL Middleware
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-sm">
                      Slack/Teams approval workflows with binding authority
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      GDPR Article 25: Data protection
                    </td>
                    <td className="px-6 py-4 text-neutral-300">PII Shield</td>
                    <td className="px-6 py-4 text-neutral-400 text-sm">
                      Automatic PII scrubbing and minimization
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">
                      Risk management
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      Policy Engine
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-sm">
                      Configurable security and governance policies
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-lg text-neutral-400 leading-relaxed">
              Unlike point solutions (Arcjet for edge filtering, Galileo for
              model evaluation), SupraWall provides a unified Compliance OS that
              addresses the full EU AI Act requirement stack out of the box. No
              integrations. No custom middleware. No compliance gaps. Deploy once,
              stay compliant across audit logging, governance, and record-keeping.
            </p>
          </section>

          {/* FAQ Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className="border-l-4 border-emerald-500 pl-8 py-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                  Has the EU AI Act been delayed?
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Yes, the EU Parliament joint committee backed fixed 2027-2028
                  deadlines for high-risk AI systems. On March 18, 2026, the
                  joint committee voted 101 in favor of this timeline shift. The
                  report will go to the full Parliament for debate and vote on
                  March 26, 2026.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="border-l-4 border-emerald-500 pl-8 py-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                  Which EU AI Act deadlines still apply in 2026?
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Article 12 transparency and record-keeping requirements still
                  apply from August 2, 2026. Additionally, Article 14 human
                  oversight requirements remain on the original August 2, 2026
                  deadline. These foundational compliance obligations are not
                  delayed.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="border-l-4 border-emerald-500 pl-8 py-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                  What does Article 12 of the EU AI Act require?
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Article 12 mandates automatic logging of AI system operations,
                  creating traceable and tamper-evident records of all decisions
                  made by high-risk AI systems. These records must include
                  time-stamped action records showing inputs, outputs, and
                  outcomes for audit purposes.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="border-l-4 border-emerald-500 pl-8 py-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                  How does the EU AI Act affect AI agents?
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Autonomous agents that make consequential decisions or take
                  independent actions fall under high-risk AI classification,
                  triggering requirements for human oversight, audit logging, and
                  comprehensive documentation. Multi-step agents that execute
                  irreversible actions are particularly subject to strict HITL
                  requirements.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className="border-l-4 border-emerald-500 pl-8 py-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                  What should AI teams do now to prepare for EU AI Act
                  compliance?
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Start implementing audit logging, human-in-the-loop governance
                  mechanisms, and compliance documentation immediately. Taking
                  action before August 2, 2026 gives you a five-month head start
                  on competitors and allows you to test your systems in
                  production before the deadline.
                </p>
              </div>

              {/* FAQ 6 */}
              <div className="border-l-4 border-emerald-500 pl-8 py-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                  How does SupraWall help with EU AI Act compliance?
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  SupraWall provides runtime audit logging, one-click PDF
                  compliance exports, a time-travel audit view for investigation,
                  human-in-the-loop middleware for approval workflows, and
                  policy-driven risk management—all specifically designed for EU
                  AI Act requirements. Unlike point solutions, it's a unified
                  Compliance OS covering the full requirement stack.
                </p>
              </div>

              {/* FAQ 7 */}
              <div className="border-l-4 border-emerald-500 pl-8 py-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                  What are the penalties for EU AI Act non-compliance?
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Fines for EU AI Act violations can reach up to €35 million or
                  7% of a company's global annual turnover, whichever is higher.
                  Given that GDPR fines increased 22% year-over-year in 2025, AI
                  compliance penalties are expected to escalate rapidly as
                  enforcement matures.
                </p>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="space-y-8">
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
              Related Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/eu-ai-act/article-12">
                <div className="group p-8 rounded-3xl bg-white/[0.05] border border-white/5 hover:border-emerald-500/30 transition cursor-pointer h-full">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-emerald-400 transition">
                    EU AI Act Article 12 Deep Dive
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    Complete breakdown of transparency, record-keeping, and
                    audit logging requirements.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm group-hover:gap-3 transition">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              <Link href="/learn/eu-ai-act-compliance-ai-agents">
                <div className="group p-8 rounded-3xl bg-white/[0.05] border border-white/5 hover:border-emerald-500/30 transition cursor-pointer h-full">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-emerald-400 transition">
                    EU AI Act Compliance for AI Agents
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    How autonomous agents trigger high-risk classifications and
                    HITL requirements.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm group-hover:gap-3 transition">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              <Link href="/learn/eu-ai-act-august-2026-deadline">
                <div className="group p-8 rounded-3xl bg-white/[0.05] border border-white/5 hover:border-emerald-500/30 transition cursor-pointer h-full">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-emerald-400 transition">
                    August 2026 Deadline Guide
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    Practical roadmap for meeting Article 12 and Article 14
                    requirements.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm group-hover:gap-3 transition">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-emerald-600 rounded-[3rem] p-12 space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black uppercase italic leading-tight">
                Start Your Compliance Journey Today
              </h2>
              <p className="text-lg text-emerald-50 leading-relaxed max-w-2xl">
                The deadline shifted, but the obligation didn't. Implement audit
                logging, human oversight, and governance before August 2, 2026.
                SupraWall's Compliance OS gives you everything you need—out of
                the box.
              </p>
            </div>

            <Link href="/login">
              <button className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-emerald-600 font-black uppercase tracking-wide hover:bg-emerald-50 transition">
                Get Started with SupraWall <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </section>

          {/* Internal Links Summary */}
          <section className="pt-8 border-t border-white/10">
            <p className="text-sm text-neutral-500 leading-relaxed">
              Resources referenced:
              <Link href="/eu-ai-act/article-12" className="text-emerald-500">
                {' '}
                Article 12
              </Link>
              ,{' '}
              <Link href="/eu-ai-act/article-14" className="text-emerald-500">
                Article 14
              </Link>
              ,{' '}
              <Link href="/learn/eu-ai-act-compliance-ai-agents" className="text-emerald-500">
                AI Agents Guide
              </Link>
              ,{' '}
              <Link href="/learn/eu-ai-act-august-2026-deadline" className="text-emerald-500">
                August 2026 Deadline
              </Link>
              ,{' '}
              <Link href="/features/human-in-the-loop" className="text-emerald-500">
                HITL Governance
              </Link>
              ,{' '}
              <Link href="/compliance" className="text-emerald-500">
                Compliance Center
              </Link>
              .
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
