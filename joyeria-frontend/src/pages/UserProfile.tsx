import React, { useEffect, useState } from 'react';
import RevealSection from '../components/common/RevealSection';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import type { UserProfile as UserProfileData } from '../types';
import { getApiErrorMessage } from '../utils/apiErrors';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await api.get<UserProfileData>('/api/account/me');
        if (!cancelled) {
          setProfile(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
        }
      } catch {
        if (!cancelled) setError('Could not load your profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSaving(true);
    try {
      const { data } = await api.patch<UserProfileData>('/api/account/me', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setProfile(data);
      setMessage('Profile updated.');
    } catch {
      setError('Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    setPwError(null);
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwSaving(true);
    try {
      await api.post('/api/account/me/password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwMessage('Password changed.');
    } catch (err: unknown) {
      setPwError(getApiErrorMessage(err, 'Could not change password.'));
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="min-h-full font-sans">
      <Helmet>
        <title>Your profile — Joyeria MARR</title>
      </Helmet>
      <section className="max-w-2xl mx-auto py-16 px-6 md:px-8">
        <RevealSection>
          <h2 className="text-3xl font-bold text-marrGold mb-4">Your profile</h2>
          <p className="mb-8 text-muted">Update your name and password.</p>
        </RevealSection>

        {loading && <p className="text-marrGold animate-pulse">Loading…</p>}
        {!loading && profile && (
          <div className="space-y-10">
            <div className="surface-panel p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Email: <span className="font-medium text-gray-800 dark:text-gray-200">{profile.email}</span>
                <span className="ml-2 text-xs">(contact support to change)</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Role: <span className="font-medium text-gray-800 dark:text-gray-200">{profile.roleName}</span>
              </p>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label htmlFor="fn" className="label-marr">
                    First name
                  </label>
                  <input
                    id="fn"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="input-marr"
                  />
                </div>
                <div>
                  <label htmlFor="ln" className="label-marr">
                    Last name
                  </label>
                  <input
                    id="ln"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="input-marr"
                  />
                </div>
                {message && <p className="alert-success">{message}</p>}
                {error && <p className="alert-error">{error}</p>}
                <button type="submit" disabled={saving} className="btn-marr">
                  {saving ? 'Saving…' : 'Save profile'}
                </button>
              </form>
            </div>

            <div className="surface-panel p-6">
              <h3 className="text-lg font-bold text-marrGold mb-4">Change password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="cpw" className="label-marr">
                    Current password
                  </label>
                  <input
                    id="cpw"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="input-marr"
                  />
                </div>
                <div>
                  <label htmlFor="npw" className="label-marr">
                    New password
                  </label>
                  <input
                    id="npw"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="input-marr"
                  />
                </div>
                <div>
                  <label htmlFor="npw2" className="label-marr">
                    Confirm new password
                  </label>
                  <input
                    id="npw2"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input-marr"
                  />
                </div>
                {pwMessage && <p className="alert-success">{pwMessage}</p>}
                {pwError && <p className="alert-error">{pwError}</p>}
                <button type="submit" disabled={pwSaving} className="btn-marr">
                  {pwSaving ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
