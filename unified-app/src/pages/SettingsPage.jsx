import React from 'react';
import {
  disconnectGitHubSession,
  disconnectGitHubSyncSettings,
  GITHUB_SYNC_TARGETS,
  getGitHubSyncSession,
  listGitHubSyncRepos,
  mergeCodeLabProgress,
  normalizeGitHubSyncSettings,
  pullGitHubProgress,
  readGitHubSyncSettings,
  startGitHubSignIn,
  summarizeProgressDocument,
  syncCodeLabProgressToGitHub,
  writeGitHubSyncSettings,
} from '../data/githubProgressSync.js';
import {
  CODE_LAB_PROGRESS_EVENT,
  exportCodeLabProgressJson,
  importCodeLabProgressJson,
  readCodeLabProgress,
  writeCodeLabProgress,
} from '../data/codeLabProgress.js';

function Field({ label, children }) {
  return (
    <label className="ua-settings-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function StatusLine({ status }) {
  if (!status) return null;
  return <p className={`ua-settings-status ${status.kind || 'neutral'}`}>{status.message}</p>;
}

export default function SettingsPage() {
  const [settings, setSettings] = React.useState(() => readGitHubSyncSettings());
  const [localSummary, setLocalSummary] = React.useState(() => summarizeProgressDocument(readCodeLabProgress()));
  const [session, setSession] = React.useState(null);
  const [repos, setRepos] = React.useState([]);
  const [status, setStatus] = React.useState(null);
  const [busy, setBusy] = React.useState('');
  const importInputRef = React.useRef(null);

  const updateSettings = (patch) => {
    setSettings((current) => normalizeGitHubSyncSettings({ ...current, ...patch }));
  };

  const refreshLocalSummary = React.useCallback(() => {
    setLocalSummary(summarizeProgressDocument(readCodeLabProgress()));
  }, []);

  React.useEffect(() => {
    refreshLocalSummary();
    window.addEventListener(CODE_LAB_PROGRESS_EVENT, refreshLocalSummary);
    return () => {
      window.removeEventListener(CODE_LAB_PROGRESS_EVENT, refreshLocalSummary);
    };
  }, [refreshLocalSummary]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('githubSync') === 'connected') {
      setStatus({ kind: 'success', message: 'GitHub connected. Save a target, then sync progress.' });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  async function run(action, label) {
    setBusy(label);
    try {
      await action();
    } catch (error) {
      setStatus({ kind: 'error', message: error.message || 'GitHub sync failed.' });
    } finally {
      setBusy('');
    }
  }

  function saveSettings(patch = {}) {
    const next = writeGitHubSyncSettings({ ...settings, ...patch });
    setSettings(next);
    setStatus({ kind: 'success', message: 'Settings saved locally.' });
  }

  async function checkSession() {
    await run(async () => {
      const payload = await getGitHubSyncSession(settings);
      setSession(payload.user || null);
      setStatus({ kind: 'success', message: payload.user ? `Signed in as ${payload.user.login}.` : 'GitHub session active.' });
    }, 'session');
  }

  async function loadRepos() {
    await run(async () => {
      const nextRepos = await listGitHubSyncRepos(settings);
      setRepos(nextRepos);
      setStatus({ kind: 'success', message: `Loaded ${nextRepos.length} repositories.` });
    }, 'repos');
  }

  async function pullRemote() {
    await run(async () => {
      const normalized = writeGitHubSyncSettings({ ...settings, enabled: true });
      setSettings(normalized);
      const remote = await pullGitHubProgress(normalized);
      const merged = mergeCodeLabProgress(readCodeLabProgress(), remote.envelope.progress);
      writeCodeLabProgress(merged);
      refreshLocalSummary();
      setStatus({ kind: 'success', message: `Pulled remote progress. ${summarizeProgressDocument(merged).passedCount} passed exercises are now local.` });
    }, 'pull');
  }

  async function syncNow() {
    await run(async () => {
      const normalized = writeGitHubSyncSettings({ ...settings, enabled: true });
      setSettings(normalized);
      const result = await syncCodeLabProgressToGitHub({ settings: normalized });
      setSettings(result.settings);
      setLocalSummary(result.summary);
      setStatus({ kind: 'success', message: `Synced ${result.summary.passedCount} passed exercises.` });
    }, 'sync');
  }

  async function disconnect() {
    await run(async () => {
      try {
        if (settings.storageUrl) await disconnectGitHubSession(settings);
      } catch {
        // Local disconnect still matters if the remote session is already gone.
      }
      const next = disconnectGitHubSyncSettings();
      setSettings(next);
      setSession(null);
      setStatus({ kind: 'neutral', message: 'GitHub sync disconnected locally.' });
    }, 'disconnect');
  }

  function exportLocalProgress() {
    const blob = new Blob([exportCodeLabProgressJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ml-animations-code-lab-progress.json';
    link.click();
    URL.revokeObjectURL(url);
    setStatus({ kind: 'success', message: 'Progress JSON exported.' });
  }

  async function importLocalProgress(event) {
    const [file] = Array.from(event.target.files || []);
    if (!file) return;

    try {
      const nextProgress = importCodeLabProgressJson(await file.text());
      setLocalSummary(summarizeProgressDocument(nextProgress));
      setStatus({ kind: 'success', message: 'Progress JSON imported.' });
    } catch {
      setStatus({ kind: 'error', message: 'Import failed. Choose a valid progress JSON file.' });
    } finally {
      event.target.value = '';
    }
  }

  const selectedRepo = settings.owner && settings.repo ? `${settings.owner}/${settings.repo}` : '';
  const canUseStorage = Boolean(settings.storageUrl);
  const canRepoSync = settings.target !== GITHUB_SYNC_TARGETS.repo || (settings.owner && settings.repo && settings.path);
  const canGistSync = settings.target !== GITHUB_SYNC_TARGETS.gist || settings.gistFilename;
  const canSync = canUseStorage && canRepoSync && canGistSync;

  return (
    <div className="ua-animation-page ua-settings-page">
      <header className="ua-animation-header">
        <div className="ds-eyebrow">
          <span>Settings</span>
          <span className="sep">/</span>
          <span>Progress sync</span>
          <span className="right">{localSummary.passedCount} passed locally</span>
        </div>
        <h1 className="ds-title">Progress Settings</h1>
        <p className="ds-subtitle">
          Keep code-lab progress local, or sync pass metadata to a GitHub repository file or private Gist.
        </p>
      </header>

      <section className="ds-panel ua-settings-grid">
        <div className="ua-settings-main">
          <div className="ua-settings-section-head">
            <div>
              <h2>GitHub Sync</h2>
              <p>No exercise source code is stored. Only passed exercise metadata is synced.</p>
            </div>
          </div>

          <div className="ua-settings-form">
            <Field label="GitHub Storage URL">
              <input
                value={settings.storageUrl}
                onChange={(event) => updateSettings({ storageUrl: event.target.value })}
                placeholder="https://your-github-storage.example.com"
              />
            </Field>

            <Field label="Storage target">
              <select
                value={settings.target}
                onChange={(event) => updateSettings({ target: event.target.value })}
              >
                <option value={GITHUB_SYNC_TARGETS.repo}>Repository file</option>
                <option value={GITHUB_SYNC_TARGETS.gist}>Private Gist</option>
              </select>
            </Field>

            {settings.target === GITHUB_SYNC_TARGETS.repo ? (
              <>
                <Field label="Repository">
                  <div className="ua-settings-inline">
                    <input
                      value={selectedRepo}
                      onChange={(event) => {
                        const [owner = '', repo = ''] = event.target.value.split('/');
                        updateSettings({ owner, repo });
                      }}
                      placeholder="owner/repo"
                    />
                    <button type="button" onClick={loadRepos} disabled={!canUseStorage || busy === 'repos'}>
                      Load
                    </button>
                  </div>
                </Field>

                {repos.length > 0 && (
                  <Field label="Choose repo">
                    <select
                      value={selectedRepo}
                      onChange={(event) => {
                        const repo = repos.find((candidate) => candidate.fullName === event.target.value);
                        if (!repo) return;
                        updateSettings({
                          owner: repo.owner,
                          repo: repo.name,
                          branch: repo.defaultBranch || settings.branch,
                        });
                      }}
                    >
                      <option value="">Select a repository</option>
                      {repos.map((repo) => (
                        <option key={repo.fullName} value={repo.fullName}>
                          {repo.fullName}{repo.private ? ' (private)' : ''}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                <div className="ua-settings-two">
                  <Field label="Branch">
                    <input
                      value={settings.branch}
                      onChange={(event) => updateSettings({ branch: event.target.value })}
                    />
                  </Field>
                  <Field label="Path">
                    <input
                      value={settings.path}
                      onChange={(event) => updateSettings({ path: event.target.value })}
                    />
                  </Field>
                </div>
              </>
            ) : (
              <div className="ua-settings-two">
                <Field label="Gist ID">
                  <input
                    value={settings.gistId}
                    onChange={(event) => updateSettings({ gistId: event.target.value })}
                    placeholder="Blank creates one on first push"
                  />
                </Field>
                <Field label="Gist filename">
                  <input
                    value={settings.gistFilename}
                    onChange={(event) => updateSettings({ gistFilename: event.target.value })}
                  />
                </Field>
              </div>
            )}

            <label className="ua-settings-check">
              <input
                type="checkbox"
                checked={settings.autoSync}
                onChange={(event) => updateSettings({ autoSync: event.target.checked })}
              />
              <span>Auto-sync after local code-lab progress changes</span>
            </label>
          </div>

          <div className="ua-settings-actions">
            <button type="button" onClick={() => saveSettings()} disabled={busy !== ''}>
              Save settings
            </button>
            <button
              type="button"
              onClick={() => startGitHubSignIn(settings, window.location.href)}
              disabled={!canUseStorage || busy !== ''}
            >
              Sign in with GitHub
            </button>
            <button type="button" onClick={checkSession} disabled={!canUseStorage || busy !== ''}>
              Check sign-in
            </button>
          </div>

          <div className="ua-settings-actions">
            <button
              type="button"
              onClick={pullRemote}
              disabled={!canSync || busy !== ''}
            >
              Pull remote
            </button>
            <button
              type="button"
              onClick={syncNow}
              disabled={!canSync || busy !== ''}
            >
              Sync now
            </button>
            <button type="button" onClick={disconnect} disabled={busy !== ''}>
              Disconnect
            </button>
          </div>

          <div className="ua-settings-actions ua-settings-local-actions">
            <button type="button" onClick={exportLocalProgress} disabled={busy !== ''}>
              Export JSON
            </button>
            <button type="button" onClick={() => importInputRef.current?.click()} disabled={busy !== ''}>
              Import JSON
            </button>
            <input
              ref={importInputRef}
              className="ua-settings-hidden-input"
              type="file"
              accept="application/json,.json"
              onChange={importLocalProgress}
            />
          </div>

          <StatusLine status={status} />
        </div>

        <aside className="ua-settings-summary">
          <h2>Local Evidence</h2>
          <dl>
            <div>
              <dt>Lesson scopes</dt>
              <dd>{localSummary.scopeCount}</dd>
            </div>
            <div>
              <dt>Passed exercises</dt>
              <dd>{localSummary.passedCount}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{settings.enabled ? 'GitHub sync' : 'Local only'}</dd>
            </div>
            <div>
              <dt>Session</dt>
              <dd>{session?.login || 'Not checked'}</dd>
            </div>
          </dl>
          <p>
            Tokens stay with the GitHub storage service as an HttpOnly session. The browser stores only target settings and local progress metadata.
          </p>
          {settings.lastSyncAt && (
            <p>Last sync: {new Date(settings.lastSyncAt).toLocaleString()}</p>
          )}
        </aside>
      </section>
    </div>
  );
}
