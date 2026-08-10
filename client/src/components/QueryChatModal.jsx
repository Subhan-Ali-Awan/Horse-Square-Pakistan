import React, { useState } from 'react';
import { Send, CheckCircle, Clock, User, ShieldCheck, MessageSquare, X } from 'lucide-react';
import { Modal } from './Modal';
import { getApiUrl } from '../config/api';

export const QueryChatModal = ({ isOpen, onClose, query, currentUser, token, onQueryUpdated }) => {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState(false);

  if (!query) return null;

  const isAdmin = currentUser?.role === 'admin';

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSending(true);
    try {
      const res = await fetch(getApiUrl(`/api/contact/${query._id}/reply`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText('');
        if (onQueryUpdated) onQueryUpdated(data.data);
      } else {
        alert(data.message || 'Failed to send reply');
      }
    } catch (err) {
      alert('Server error while sending reply');
    } finally {
      setSending(false);
    }
  };

  const handleMarkResolved = async () => {
    setResolving(true);
    try {
      const res = await fetch(getApiUrl(`/api/contact/${query._id}/resolve`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        if (onQueryUpdated) onQueryUpdated(data.data);
      } else {
        alert(data.message || 'Failed to resolve query');
      }
    } catch (err) {
      alert('Server error while resolving query');
    } finally {
      setResolving(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      new: 'bg-amber-100 text-amber-900 border-amber-300',
      read: 'bg-blue-100 text-blue-900 border-blue-300',
      in_progress: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      resolved: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    };
    const labels = {
      new: 'New Inquiry',
      read: 'Read by Admin',
      in_progress: 'In Progress',
      resolved: 'Resolved',
    };
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${map[status] || map.new}`}>
        {status === 'resolved' ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
        {labels[status] || status}
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="max-w-2xl">
      <div className="space-y-4 min-w-0">

        {/* Chat Header with Close Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4 min-w-0">
          <div className="flex-1 min-w-0 pr-8 sm:pr-0">
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">{query.subject || 'General Inquiry'}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
              From: <strong className="text-slate-800">{query.name}</strong> {query.email ? `(${query.email})` : ''} {query.phone ? `· 📞 ${query.phone}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
            {getStatusBadge(query.status)}
            {query.status !== 'resolved' && (
              <button
                onClick={handleMarkResolved}
                disabled={resolving}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {resolving ? 'Resolving...' : 'Mark Resolved'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="max-h-[360px] sm:max-h-[380px] overflow-y-auto space-y-4 pr-1 sm:pr-2 p-2 bg-slate-50/50 rounded-2xl border border-slate-100 min-w-0">

          {/* Initial Message from User */}
          <div className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} space-y-1 min-w-0`}>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-500 px-1 min-w-0">
              <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{query.name} {!isAdmin ? '(You - Original Query)' : '(User Inquiry)'}</span>
              <span>•</span>
              <span className="font-normal text-slate-400">
                {new Date(query.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className={`p-3.5 sm:p-4 rounded-2xl shadow-sm text-xs leading-relaxed max-w-[92%] sm:max-w-[85%] break-words ${!isAdmin
              ? 'bg-amber-100 text-slate-900 border border-amber-300 rounded-tr-none font-medium'
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-normal'
              }`}>
              {query.message}
            </div>
          </div>

          {/* Reply Messages Thread */}
          {query.replies && query.replies.map((reply, idx) => {
            const isFromAdmin = reply.sender === 'admin';
            const isMe = reply.sender === (isAdmin ? 'admin' : 'user');

            return (
              <div
                key={idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 min-w-0`}
              >
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-500 px-1 min-w-0">
                  {isFromAdmin ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-slate-900 font-extrabold truncate">{reply.senderName || 'Support Admin'} {isMe ? '(You)' : ''}</span>
                      <span>•</span>
                      <span className="font-normal text-slate-400">
                        {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-slate-900 font-extrabold truncate">{reply.senderName || query.name} {isMe ? '(You)' : ''}</span>
                      <span>•</span>
                      <span className="font-normal text-slate-400">
                        {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </>
                  )}
                </div>

                <div
                  className={`p-3.5 sm:p-4 rounded-2xl shadow-sm text-xs leading-relaxed max-w-[92%] sm:max-w-[85%] break-words ${isFromAdmin
                    ? 'bg-[#0F172A] text-white border border-slate-800 ' + (isMe ? 'rounded-tr-none' : 'rounded-tl-none')
                    : 'bg-amber-100 text-slate-900 border border-amber-300 ' + (isMe ? 'rounded-tr-none font-medium' : 'rounded-tl-none')
                    }`}
                >
                  {reply.message}
                </div>
              </div>
            );
          })}

        </div>

        {/* Reply Input Box */}
        {query.status === 'resolved' ? (
          <div className="bg-emerald-50 text-emerald-900 p-3 sm:p-4 rounded-2xl border border-emerald-200 text-center flex items-center justify-center gap-2 text-xs font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>This query has been marked as resolved. You can still read the entire conversation thread above.</span>
          </div>
        ) : (
          <form onSubmit={handleSendReply} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 sm:gap-3 pt-2">
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isAdmin ? 'Reply as Admin Support' : 'Reply to Admin Support'}
              </label>
              <textarea
                rows="2"
                required
                placeholder={isAdmin ? "Type your official response..." : "Type your reply back..."}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="py-3 px-5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        )}

      </div>
    </Modal>
  );
};
