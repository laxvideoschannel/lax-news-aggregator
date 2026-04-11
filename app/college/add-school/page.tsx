'use client';

import Link from 'next/link';
import { useState } from 'react';

type FormState = {
  schoolName: string;
  nickname: string;
  conference: string;
  city: string;
  state: string;
  mainSiteUrl: string;
  lacrosseSiteUrl: string;
  scheduleUrl: string;
  rosterUrl: string;
  submitterName: string;
  submitterEmail: string;
  notes: string;
};

const EMPTY: FormState = {
  schoolName: '',
  nickname: '',
  conference: '',
  city: '',
  state: '',
  mainSiteUrl: '',
  lacrosseSiteUrl: '',
  scheduleUrl: '',
  rosterUrl: '',
  submitterName: '',
  submitterEmail: '',
  notes: '',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontFamily: 'var(--font-body)',
  fontSize: '15px',
  padding: '12px 16px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-accent)',
  fontSize: '12px',
  letterSpacing: '0.18em',
  color: 'var(--text-muted)',
  display: 'block',
  marginBottom: '6px',
};

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (name: keyof FormState, val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: 'var(--primary)', marginLeft: 4 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}

export default function AddSchoolPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (name: keyof FormState, val: string) =>
    setForm((p) => ({ ...p, [name]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/school-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitting(false);
      setSubmitted(true);
    } catch {
      setSubmitting(false);
      alert('Submission failed — please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '80px 0 120px', maxWidth: '640px' }}>
        <div className="section-tag" style={{ marginBottom: '16px' }}>SUBMISSION RECEIVED</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.9, marginBottom: '24px' }}>
          THANKS FOR<br /><span style={{ color: 'var(--primary)' }}>SUBMITTING!</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
          We&apos;ve received your submission for <strong style={{ color: 'var(--text)' }}>{form.schoolName}</strong>. Our team will review the info and get the school hub set up. You&apos;ll hear back at {form.submitterEmail} once it goes live.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/college" className="btn-primary">Back to College Hub →</Link>
          <button onClick={() => { setForm(EMPTY); setSubmitted(false); }} className="btn-outline" style={{ cursor: 'pointer' }}>
            Submit Another School
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section style={{ background: 'color-mix(in srgb, var(--team-surface) 28%, var(--bg))', padding: '56px 0 42px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <Link href="/college" style={{ fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.14em', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
            ← BACK TO COLLEGE HUB
          </Link>
          <div className="section-tag" style={{ marginBottom: '12px' }}>SCHOOL DIRECTORY</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 0.9, marginBottom: '16px' }}>
            ADD YOUR<br /><span style={{ color: 'var(--primary)' }}>SCHOOL</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, maxWidth: '600px' }}>
            Know a college lacrosse program that should have its own hub? Fill out the form below and we&apos;ll build a team page with schedule, roster, and watch links.
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '56px 0 100px' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '40px' }}>

              {/* School Info */}
              <div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                  SCHOOL INFORMATION
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="School Name" name="schoolName" value={form.schoolName} onChange={set} placeholder="e.g. Johns Hopkins" required />
                  <Field label="Team Nickname" name="nickname" value={form.nickname} onChange={set} placeholder="e.g. Blue Jays" required />
                  <Field label="Conference" name="conference" value={form.conference} onChange={set} placeholder="e.g. Patriot League" required />
                  <div />
                  <Field label="City" name="city" value={form.city} onChange={set} placeholder="e.g. Baltimore" required />
                  <Field label="State" name="state" value={form.state} onChange={set} placeholder="e.g. MD" required />
                </div>
              </div>

              {/* Links */}
              <div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                  OFFICIAL LINKS
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <Field label="Main School Athletics Site" name="mainSiteUrl" value={form.mainSiteUrl} onChange={set} placeholder="https://hopkinssports.com" type="url" />
                  <Field label="Men's Lacrosse Team Page" name="lacrosseSiteUrl" value={form.lacrosseSiteUrl} onChange={set} placeholder="https://hopkinssports.com/sports/mens-lacrosse" type="url" required />
                  <Field label="Schedule Page URL" name="scheduleUrl" value={form.scheduleUrl} onChange={set} placeholder="https://hopkinssports.com/sports/mens-lacrosse/schedule" type="url" />
                  <Field label="Roster Page URL" name="rosterUrl" value={form.rosterUrl} onChange={set} placeholder="https://hopkinssports.com/sports/mens-lacrosse/roster" type="url" />
                </div>
              </div>

              {/* Submitter */}
              <div>
                <div style={{ fontFamily: 'var(--font-acc)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-accent)' }}>
                  YOUR INFO
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Your Name" name="submitterName" value={form.submitterName} onChange={set} placeholder="First Last" />
                  <Field label="Your Email" name="submitterEmail" value={form.submitterEmail} onChange={set} placeholder="you@example.com" type="email" required />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>ANYTHING ELSE WE SHOULD KNOW?</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Notable players, key games, social links, YouTube channels, etc."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'SUBMITTING…' : 'SUBMIT SCHOOL →'}
                </button>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Fields marked <span style={{ color: 'var(--primary)' }}>*</span> are required
                </span>
              </div>

            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
