import { Link } from "react-router-dom";
import {
  FaRobot,
  FaChartLine,
  FaFileAlt,
  FaCheckCircle,
  FaArrowRight,
  FaSpellCheck,
  FaBullseye,
  FaUpload,
  FaMagic,
  FaClipboardCheck,
  FaBriefcase,
} from "react-icons/fa";

function Home() {
  const name = localStorage.getItem("name");

  const hour = new Date().getHours();

  let greeting = "Hello";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .hm-serif { font-family: 'Fraunces', serif; }
        .hm-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 via-slate-50 to-slate-50">

        {/* decorative background blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-32 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-16">

          <div className="lg:w-1/2">

            {name ? (
              <p className="text-lg font-semibold text-blue-600 mb-4">
                {greeting}, {name} 👋
              </p>
            ) : (
              <span className="hm-mono inline-flex items-center gap-2 bg-white text-blue-700 text-xs tracking-[0.1em] uppercase font-medium px-4 py-1.5 rounded-full mb-4 shadow-sm border border-blue-100">
                <FaCheckCircle className="text-blue-600" />
                Trusted by job seekers everywhere
              </span>
            )}

            <h1 className="hm-serif text-5xl lg:text-6xl font-semibold text-slate-900 leading-[1.05] tracking-tight">
              AI-powered
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                resume analyzer
              </span>
            </h1>

            <p className="text-slate-600 mt-6 text-lg leading-relaxed max-w-lg">
              Upload your resume and receive an AI-generated ATS score,
              personalized feedback, missing skills, grammar improvements,
              and recommended job roles in just a few seconds.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                to="/upload"
                className="group flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-300/50"
              >
                Analyze resume
                <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/history"
                className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl hover:border-slate-300 hover:shadow-md transition font-semibold"
              >
                View history
              </Link>

            </div>

            <div className="flex items-center gap-8 mt-12">
              <div>
                <p className="hm-serif text-3xl font-semibold text-slate-900">50K+</p>
                <p className="hm-mono text-[11px] tracking-wide text-slate-500 mt-1 uppercase">Resumes analyzed</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="hm-serif text-3xl font-semibold text-slate-900">92%</p>
                <p className="hm-mono text-[11px] tracking-wide text-slate-500 mt-1 uppercase">Avg. score boost</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="hm-serif text-3xl font-semibold text-slate-900">4.8/5</p>
                <p className="hm-mono text-[11px] tracking-wide text-slate-500 mt-1 uppercase">User rating</p>
              </div>
            </div>

          </div>

          {/* Right Side Card */}
          <div className="lg:w-1/2 flex justify-center">

            <div className="relative">

              {/* floating badge: grammar */}
              <div className="hidden md:flex absolute -top-7 -left-8 z-20 items-center gap-2 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 rotate-[-4deg] animate-[float_6s_ease-in-out_infinite]">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <FaSpellCheck className="text-indigo-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 leading-none">Grammar</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Clean</p>
                </div>
              </div>

              {/* floating badge: keyword match */}
              <div className="hidden md:flex absolute -bottom-7 -right-8 z-20 items-center gap-2 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 rotate-[3deg] animate-[float_7s_ease-in-out_infinite_0.5s]">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <FaBullseye className="text-green-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 leading-none">Keyword match</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Strong</p>
                </div>
              </div>

              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 w-96 border border-slate-100">

                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    Resume score
                  </h2>
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    Good
                  </span>
                </div>
                <p className="text-slate-400 text-xs mb-6">
                  Software_Engineer_Resume.pdf
                </p>

                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="60" fill="none" stroke="#DBEAFE" strokeWidth="14" />
                      <circle
                        cx="70" cy="70" r="60" fill="none"
                        stroke="url(#scoreGradient)" strokeWidth="14" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 60}
                        strokeDashoffset={2 * Math.PI * 60 * (1 - 0.82)}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="100%" stopColor="#4F46E5" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="hm-serif text-2xl font-semibold text-slate-900">
                        82
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5">
                    {[
                      { label: "Keyword match", value: 88, color: "bg-blue-500" },
                      { label: "Formatting", value: 95, color: "bg-green-500" },
                      { label: "Grammar", value: 72, color: "bg-amber-500" },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>{row.label}</span>
                          <span className="font-medium text-slate-700">{row.value}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${row.color}`}
                            style={{ width: `${row.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5">
                  <FaCheckCircle className="text-amber-500 shrink-0 mt-0.5 text-sm" />
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-900">2 grammar fixes</span> could
                    raise this score to 90+
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="text-center mb-14">
          <span className="hm-mono text-blue-600 font-semibold text-xs tracking-[0.15em] uppercase">
            The process
          </span>
          <h2 className="hm-serif text-3xl md:text-4xl font-semibold text-slate-900 mt-3">
            From upload to offer-ready, in three steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">

          <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-slate-200" />

          {[
            {
              icon: FaUpload,
              step: "01",
              title: "Upload your resume",
              desc: "Drop in a PDF or DOCX file — no formatting cleanup needed.",
            },
            {
              icon: FaMagic,
              step: "02",
              title: "AI analyzes it",
              desc: "We check formatting, keywords, grammar, and ATS compatibility in seconds.",
            },
            {
              icon: FaClipboardCheck,
              step: "03",
              title: "Get your report",
              desc: "See your score, what's missing, and exactly how to fix it.",
            },
          ].map((s, i) => (
            <div key={i} className="relative bg-white rounded-2xl border border-slate-100 shadow-sm p-7 text-center">
              <div className="hm-mono text-[11px] tracking-widest text-blue-400 mb-3">
                {s.step}
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
                <s.icon className="text-xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="text-center mb-16">
          <span className="hm-mono text-blue-600 font-semibold text-xs tracking-[0.15em] uppercase">
            Why choose us
          </span>
          <h2 className="hm-serif text-3xl md:text-4xl font-semibold text-slate-900 mt-3">
            Everything your resume needs
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Built to get you past applicant tracking systems and in
            front of a real recruiter.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 p-7">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 shadow-md shadow-blue-200 group-hover:scale-110 transition-transform">
              <FaRobot className="text-lg text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900">
              AI analysis
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Smart, actionable suggestions generated in seconds.
            </p>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-green-200 transition-all duration-300 p-7">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-5 shadow-md shadow-green-200 group-hover:scale-110 transition-transform">
              <FaChartLine className="text-lg text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900">
              ATS score
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              A compatibility score with clear tips to improve it.
            </p>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 p-7">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-5 shadow-md shadow-indigo-200 group-hover:scale-110 transition-transform">
              <FaBriefcase className="text-lg text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900">
              Job match scoring
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Paste a job description to see how well you match.
            </p>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-purple-200 transition-all duration-300 p-7">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-5 shadow-md shadow-purple-200 group-hover:scale-110 transition-transform">
              <FaFileAlt className="text-lg text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900">
              Resume history
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Access every past analysis anytime, anywhere.
            </p>
          </div>

        </div>

      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <span className="hm-mono text-blue-600 font-semibold text-xs tracking-[0.15em] uppercase">
            Questions
          </span>
          <h2 className="hm-serif text-3xl font-semibold text-slate-900 mt-3">
            Frequently asked
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "What file formats can I upload?",
              a: "PDF and DOCX are both supported. We recommend PDF for the most consistent formatting analysis.",
            },
            {
              q: "How long does analysis take?",
              a: "Most resumes are analyzed in under 30 seconds.",
            },
            {
              q: "Can I re-analyze after making edits?",
              a: "Yes — upload the updated version anytime and it's saved to your history so you can track your score over time.",
            },
            {
              q: "Is my resume data kept private?",
              a: "Your resumes are tied to your account and only visible to you.",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="group bg-white rounded-xl border border-slate-200 px-5 py-4 open:shadow-sm"
            >
              <summary className="flex items-center justify-between cursor-pointer font-medium text-slate-900 text-sm list-none">
                {item.q}
                <span className="text-blue-600 text-lg leading-none group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 px-10 py-16 text-center">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <h2 className="hm-serif text-3xl md:text-4xl font-semibold text-white relative">
            Ready to fix your resume?
          </h2>
          <p className="text-blue-100 mt-4 max-w-md mx-auto relative">
            Get your free AI-powered analysis in under a minute.
          </p>
          <Link
            to="/upload"
            className="relative inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl hover:bg-blue-50 transition font-semibold mt-8"
          >
            Analyze resume
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

    </div>
  );
}

export default Home;