import React, { useState } from 'react';
import { Users, Bug, MessageSquare, CheckCircle2 } from 'lucide-react';

export const CommunitySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contribute' | 'report' | 'feedback'>('contribute');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="community" className="py-20 bg-[#080F1C] relative border-t border-[#1F314D]/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#35D5F2] bg-[#101B2D] border border-[#1F314D] px-3 py-1 rounded-full">
            Community & Collaboration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F7FC] mt-4 tracking-tight">
            Build With Us & Keep Documentation Honest
          </h2>
          <p className="text-base text-[#9AAAC0] mt-3">
            Whether you are spotting a technical errata in a Wireshark filter or proposing a new defensive module, community contributions make this platform better.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-[#101B2D] border border-[#1F314D] rounded-xl space-x-2">
            <button
              onClick={() => setActiveTab('contribute')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'contribute'
                  ? 'bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] shadow-md'
                  : 'text-[#9AAAC0] hover:text-[#F3F7FC]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Become a Contributor</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'report'
                  ? 'bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] shadow-md'
                  : 'text-[#9AAAC0] hover:text-[#F3F7FC]'
              }`}
            >
              <Bug className="w-4 h-4" />
              <span>Report Bug or Errata</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'feedback'
                  ? 'bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] shadow-md'
                  : 'text-[#9AAAC0] hover:text-[#F3F7FC]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Student Feedback</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#101B2D] border border-[#1F314D] rounded-2xl p-6 sm:p-10 shadow-xl relative">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#35D5F2] mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-[#F3F7FC]">Submission Received</h3>
              <p className="text-sm text-[#9AAAC0] max-w-md mx-auto">
                Thank you for helping us maintain the integrity of this laboratory! We review all submissions thoroughly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {activeTab === 'contribute' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#9AAAC0] mb-1.5">Your Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Ada Lovelace"
                        className="w-full bg-[#080F1C] border border-[#1F314D] rounded-xl px-4 py-2.5 text-sm text-[#F3F7FC] focus:outline-none focus:border-[#35D5F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#9AAAC0] mb-1.5">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="ada@example.com"
                        className="w-full bg-[#080F1C] border border-[#1F314D] rounded-xl px-4 py-2.5 text-sm text-[#F3F7FC] focus:outline-none focus:border-[#35D5F2]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#9AAAC0] mb-1.5">GitHub Profile Link</label>
                    <input
                      required
                      type="url"
                      placeholder="https://github.com/username"
                      className="w-full bg-[#080F1C] border border-[#1F314D] rounded-xl px-4 py-2.5 text-sm text-[#F3F7FC] focus:outline-none focus:border-[#35D5F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#9AAAC0] mb-1.5">Interest Area & Proposal</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe what area you'd like to help with (e.g. firmware development, defensive Wireshark tutorials, documentation review)..."
                      className="w-full bg-[#080F1C] border border-[#1F314D] rounded-xl p-4 text-sm text-[#F3F7FC] focus:outline-none focus:border-[#35D5F2]"
                    />
                  </div>
                </>
              )}

              {activeTab === 'report' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#9AAAC0] mb-1.5">Issue Type</label>
                      <select className="w-full bg-[#080F1C] border border-[#1F314D] rounded-xl px-4 py-2.5 text-sm text-[#F3F7FC] focus:outline-none focus:border-[#35D5F2]">
                        <option>Documentation Errata / Typo</option>
                        <option>Firmware Code Bug</option>
                        <option>Wireshark Filter Clarification</option>
                        <option>Web Platform UI Defect</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#9AAAC0] mb-1.5">Affected Module / Lesson</label>
                      <input
                        type="text"
                        placeholder="e.g. Module 1, Lesson 2"
                        className="w-full bg-[#080F1C] border border-[#1F314D] rounded-xl px-4 py-2.5 text-sm text-[#F3F7FC] focus:outline-none focus:border-[#35D5F2]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#9AAAC0] mb-1.5">Description & Suggested Fix</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Detail the issue and provide the exact suggested correction..."
                      className="w-full bg-[#080F1C] border border-[#1F314D] rounded-xl p-4 text-sm text-[#F3F7FC] focus:outline-none focus:border-[#35D5F2]"
                    />
                  </div>
                </>
              )}

              {activeTab === 'feedback' && (
                <>
                  <div>
                    <label className="block text-xs font-mono text-[#9AAAC0] mb-1.5">Overall Learning Experience</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your thoughts on the course structure, hands-on lab clarity, and learning pace..."
                      className="w-full bg-[#080F1C] border border-[#1F314D] rounded-xl p-4 text-sm text-[#F3F7FC] focus:outline-none focus:border-[#35D5F2]"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#9AAAC0]">
                  Transmitted directly to our open-source triage queue.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] font-bold text-sm hover:brightness-110 transition-all cursor-pointer"
                >
                  Submit Form
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
