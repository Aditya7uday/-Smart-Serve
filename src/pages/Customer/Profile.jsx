import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/FormInput';
import { isValidPhone } from '../../utils/validators';
import { UserCircle, Key, Loader2, CheckCircle2, Link } from 'lucide-react';

export function Profile() {
  const { state: authState, dispatch } = useAuth();
  const { addToast } = useToast();
  const user = authState.user;

  const [profileData, setProfileData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  const validateProfileField = (name, data) => {
    if (name === 'name' && !data.name.trim()) return 'Full name is required';
    if (name === 'phone' && data.phone.trim() && !isValidPhone(data.phone)) return 'Enter a valid 10-digit mobile number';
    return undefined;
  };

  const handleProfileBlur = (e) => {
    const { name } = e.target;
    setProfileErrors(prev => ({ ...prev, [name]: validateProfileField(name, profileData) }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const errs = {};
    const nameErr = validateProfileField('name', profileData);
    const phoneErr = validateProfileField('phone', profileData);
    if (nameErr) errs.name = nameErr;
    if (phoneErr) errs.phone = phoneErr;
    setProfileErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setProfileLoading(true);
    try {
      const updated = await authService.updateProfile({ name: profileData.name.trim(), phone: profileData.phone.trim() });
      dispatch({ type: 'LOGIN', payload: { ...user, ...updated } });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePwField = (name, data) => {
    if (name === 'currentPassword' && !data.currentPassword) return 'Required';
    if (name === 'newPassword' && data.newPassword.length < 6) return 'Password must be at least 6 characters';
    if (name === 'confirmPassword' && data.newPassword !== data.confirmPassword) return "Passwords don't match";
    return undefined;
  };

  const handlePwBlur = (e) => {
    const { name } = e.target;
    setPwErrors(prev => ({ ...prev, [name]: validatePwField(name, pwData) }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = {};
    ['currentPassword', 'newPassword', 'confirmPassword'].forEach(name => {
      const err = validatePwField(name, pwData);
      if (err) errs[name] = err;
    });
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPwLoading(true);
    await new Promise(r => setTimeout(r, 800));
    addToast('Password changed successfully! (simulated)', 'success');
    setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPwLoading(false);
  };

  return (
    <div className="py-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-dark-text">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <UserCircle className="w-10 h-10 text-primary-orange" />
          </div>
          <div>
            <p className="font-bold text-lg text-dark-text">{user?.name}</p>
            <p className="text-secondary-gray text-sm capitalize">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4" noValidate>
          <FormInput label="Full Name" id="profile-name" name="name" value={profileData.name} onChange={e => { setProfileData(p => ({ ...p, name: e.target.value })); setProfileErrors(p => ({ ...p, name: undefined })); }} onBlur={handleProfileBlur} error={profileErrors.name} required />
          <FormInput label="Email Address" id="profile-email" type="email" value={user?.email || ''} disabled />
          <FormInput label="Phone" id="profile-phone" name="phone" type="tel" value={profileData.phone} onChange={e => { setProfileData(p => ({ ...p, phone: e.target.value })); setProfileErrors(p => ({ ...p, phone: undefined })); }} onBlur={handleProfileBlur} placeholder="Used to prefill payments" error={profileErrors.phone} />
          <button type="submit" disabled={profileLoading} className="w-full py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
            {profileLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Key className="w-5 h-5 text-secondary-gray" />
          </div>
          <div>
            <h2 className="font-bold text-dark-text">Change Password</h2>
            <p className="text-xs text-secondary-gray">Simulated — no actual change occurs</p>
          </div>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4" noValidate>
          <FormInput label="Current Password" id="current-pw" name="currentPassword" type="password" value={pwData.currentPassword} onChange={e => { setPwData(p => ({ ...p, currentPassword: e.target.value })); setPwErrors(p => ({ ...p, currentPassword: undefined })); }} onBlur={handlePwBlur} error={pwErrors.currentPassword} required />
          <FormInput label="New Password" id="new-pw" name="newPassword" type="password" value={pwData.newPassword} onChange={e => { setPwData(p => ({ ...p, newPassword: e.target.value })); setPwErrors(p => ({ ...p, newPassword: undefined })); }} onBlur={handlePwBlur} error={pwErrors.newPassword} required />
          <FormInput label="Confirm New Password" id="confirm-pw" name="confirmPassword" type="password" value={pwData.confirmPassword} onChange={e => { setPwData(p => ({ ...p, confirmPassword: e.target.value })); setPwErrors(p => ({ ...p, confirmPassword: undefined })); }} onBlur={handlePwBlur} error={pwErrors.confirmPassword} required />
          <button type="submit" disabled={pwLoading} className="w-full py-3 bg-dark-text text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
            {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
