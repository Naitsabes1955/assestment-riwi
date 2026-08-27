"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { AuthPanel } from "@/components/auth/auth-panel";
import { ChannelSidebar } from "@/components/channels/channel-sidebar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SearchPanel } from "@/components/search/search-panel";
import { ErrorMessage } from "@/components/ui/error-message";
import { useAssistant } from "@/features/assistant/use-assistant";
import { useApiClient } from "@/features/api/use-api";
import { AuthProvider, useAuth } from "@/features/auth/auth-context";
import { useChannels } from "@/features/channels/use-channels";
import { useChat } from "@/features/chat/use-chat";
import { useMessageSearch } from "@/features/search/use-message-search";
import { dictionaries } from "@/i18n/dictionaries";
import { apiBaseUrl } from "@/lib/config";
import { readStoredLocale, storeLocale } from "@/lib/auth/session-storage";
import type { Locale } from "@/types";

const initialLocale: Locale = "en";

export function MessagingShell() {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const t = dictionaries[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLocaleState(readStoredLocale());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    storeLocale(nextLocale);
  }, []);

  return (
    <AuthProvider
      apiUnavailableMessage={t.errorApiUnavailable}
      sessionExpiredMessage={t.errorExpired}
    >
      <MessagingWorkspace locale={locale} onLocaleChange={setLocale} />
    </AuthProvider>
  );
}

function MessagingWorkspace(props: {
  readonly locale: Locale;
  readonly onLocaleChange: (locale: Locale) => void;
}) {
  const t = dictionaries[props.locale];
  const auth = useAuth();
  const client = useApiClient(t.errorExpired, t.errorApiUnavailable);
  const channels = useChannels(client, t.errorUnexpected);
  const chat = useChat(client, t.errorUnexpected);
  const search = useMessageSearch(client, t.errorUnexpected);
  const assistant = useAssistant(client, t.errorUnexpected);
  const {
    channels: channelItems,
    error: channelsError,
    loadChannels,
    loading: channelsLoading,
    selectedChannelId,
    setSelectedChannelId,
  } = channels;
  const {
    deleteMessage,
    draft,
    error: chatError,
    loadMessages,
    loading: messagesLoading,
    messages,
    sendMessage,
    sending,
    setDraft,
  } = chat;
  const selectedChannel = useMemo(
    () => channelItems.find((channel) => channel.id === selectedChannelId) ?? null,
    [channelItems, selectedChannelId],
  );

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      void loadChannels();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [auth.isAuthenticated, loadChannels]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMessages(selectedChannelId);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadMessages, selectedChannelId]);

  const appError = channelsError ?? chatError ?? search.error ?? assistant.error;

  return (
    <main className="min-h-screen bg-background text-riwi-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6">
        <header className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-riwi-line bg-riwi-panel/95 px-4 py-3 shadow-sm sm:px-5">
          <div>
            <p className="text-base font-semibold tracking-tight text-riwi-primary-strong">
              {t.appName}
            </p>
            <p className="mt-0.5 text-xs text-riwi-muted">{apiBaseUrl}</p>
          </div>
          <LanguageSwitcher locale={props.locale} onChange={props.onLocaleChange} />
        </header>

        {!auth.isAuthenticated || !auth.currentUser ? (
          <AuthPanel t={t} />
        ) : (
          <>
            {appError ? <ErrorMessage message={appError} /> : null}

            <section className="grid flex-1 gap-4 lg:grid-cols-[290px_minmax(0,1fr)_350px]">
              <ChannelSidebar
                channels={channelItems}
                currentUser={auth.currentUser}
                loading={channelsLoading}
                locale={props.locale}
                onLogout={() => void auth.logout()}
                onRefresh={() => void loadChannels()}
                onSelect={setSelectedChannelId}
                selectedChannelId={selectedChannelId}
                t={t}
              />
              <ChatPanel
                channel={selectedChannel}
                currentUserId={auth.currentUser.id}
                draft={draft}
                loading={messagesLoading}
                locale={props.locale}
                messages={messages}
                onDelete={(messageId) => void deleteMessage(selectedChannelId, messageId)}
                onDraftChange={setDraft}
                onSend={(event) => void sendMessage(event, selectedChannelId)}
                sending={sending}
                t={t}
              />
              <aside className="space-y-4">
                <SearchPanel
                  loading={search.loading}
                  locale={props.locale}
                  onQueryChange={search.setQuery}
                  onSearch={search.search}
                  onSelectChannel={setSelectedChannelId}
                  query={search.query}
                  results={search.results}
                  t={t}
                />
                <AssistantPanel
                  channelSelected={Boolean(selectedChannelId)}
                  loading={assistant.loading}
                  onAsk={(event) => void assistant.ask(event, selectedChannelId)}
                  onPromptChange={assistant.setPrompt}
                  prompt={assistant.prompt}
                  response={assistant.response}
                  t={t}
                />
              </aside>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
