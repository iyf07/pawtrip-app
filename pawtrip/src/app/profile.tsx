import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { useMyFeedback } from "@/api/feedback";
import { useMyProfile, useUpdateProfile } from "@/api/profile";
import type { Profile as ProfileRow } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { Icon } from "@/components/ui/Icon";
import { AvatarEditor } from "@/components/AvatarEditor";
import { HandleField } from "@/components/HandleField";
import { Field } from "@/components/ui/Field";
import { dietIcon } from "@/components/DietIcon";
import { InterestPicker } from "@/components/InterestPicker";
import { ScaleInput } from "@/components/ScaleInput";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SaveBar } from "@/components/ui/SaveBar";
import {
  BackButton,
  Header,
  Screen,
  SectionTitle,
} from "@/components/ui/Screen";
import { Meta, Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { DIETS, PERSON_SCALES, type PersonScale } from "@/constants/options";
import { useLayout } from "@/hooks/use-layout";
import { useTheme } from "@/hooks/use-theme";
import { useT, type Key } from "@/i18n";
import { goBack } from "@/lib/nav";
import { deletePhotoByUrl } from "@/lib/photos";

export default function ProfileRoute() {
  const me = useMyProfile();
  // Mount the form once the profile is loaded so its fields start from the saved values.
  if (!me.data) return <Screen scroll={false}>{null}</Screen>;
  return <ProfileForm key={me.data.id} profile={me.data} />;
}

function ProfileForm({ profile }: { profile: ProfileRow }) {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const { userId, email, signOut } = useAuth();
  const feedback = useMyFeedback();
  const update = useUpdateProfile();
  const { wide } = useLayout();
  // everything is read-only until the pencil is tapped; Save / Cancel then end the edit
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.display_name);
  const [handle, setHandle] = useState(profile.handle);
  const [handleOk, setHandleOk] = useState(true);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [diet, setDiet] = useState<string[]>(profile.diet);
  const [scales, setScales] = useState<Record<PersonScale, number | null>>({
    walking: profile.walking ?? 3,
    noise: profile.noise ?? 3,
    morning: profile.morning ?? 3,
  });

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const handleChanged = handle !== profile.handle;
  const canSave = name.trim().length > 0 && (!handleChanged || handleOk);

  function cancel() {
    setName(profile.display_name);
    setHandle(profile.handle);
    setHandleOk(true);
    setInterests(profile.interests);
    setDiet(profile.diet);
    setScales({
      walking: profile.walking ?? 3,
      noise: profile.noise ?? 3,
      morning: profile.morning ?? 3,
    });
    setEditing(false);
  }

  async function save() {
    try {
      await update.mutateAsync({
        display_name: name.trim(),
        ...(handleChanged ? { handle } : {}),
        interests,
        diet,
        ...scales,
      });
      toast(t("toast.saved"));
      setEditing(false);
    } catch (e) {
      const code = (e as { code?: string })?.code;
      toast(code === "23505" ? t("pf.handle.taken") : t("common.saveFailed")); // someone took it a moment ago
    }
  }

  async function changeAvatar(url: string | null) {
    const old = profile.avatar_url;
    try {
      await update.mutateAsync({ avatar_url: url });
      await deletePhotoByUrl(old);
    } catch {
      toast(t("common.saveFailed"));
    }
  }

  const identityBlock = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginTop: 4 }}>
      {editing ? (
        <AvatarEditor name={profile.display_name} url={profile.avatar_url} size={wide ? 128 : 84} onChange={changeAvatar} />
      ) : (
        <Avatar id={profile.id} name={profile.display_name} url={profile.avatar_url} size={wide ? 128 : 84} />
      )}
      <View style={{ flex: 1 }}>
        {editing ? (
          <>
            <Field label={t("pf.name")} value={name} onChangeText={setName} maxLength={60} />
            <View style={{ marginTop: 4 }}>
              <HandleField label={t("pf.handle")} value={handle} onChangeText={setHandle} onValid={setHandleOk} current={profile.handle} />
            </View>
          </>
        ) : (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text weight={800} size={wide ? 30 : 22} numberOfLines={1} style={{ flexShrink: 1 }}>
                {profile.display_name}
              </Text>
              <Pressable
                onPress={() => setEditing(true)}
                accessibilityRole="button"
                accessibilityLabel={t("pf.editName")}
                hitSlop={8}
                style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: "center", justifyContent: "center" }}
              >
                <Icon name="ui-pencil" size={20} />
              </Pressable>
            </View>
            <Text weight={700} size={wide ? 17 : 15} color="muted" numberOfLines={1}>
              ID: {profile.handle}
            </Text>
          </>
        )}
      </View>
    </View>
  );

  const styleBlock = (
    <>
      <SectionTitle>{t("profile.travelStyle")}</SectionTitle>
      {PERSON_SCALES.map((f) => (
        <ScaleInput
          key={f}
          field={f}
          value={scales[f]}
          readOnly={!editing}
          onChange={(v) => setScales((s) => ({ ...s, [f]: v }))}
        />
      ))}

      <SectionTitle>{t("profile.interests")}</SectionTitle>
      <View>
        <InterestPicker
          value={interests}
          readOnly={!editing}
          onToggle={(i) => setInterests((c) => toggle(c, i))}
        />
      </View>

      <SectionTitle>{t("profile.diet")}</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {(editing ? DIETS : DIETS.filter((d) => diet.includes(d))).map((d) => (
          <Chip
            key={d}
            icon={dietIcon(d)}
            label={t(`diet.${d}` as Key)}
            on={editing ? diet.includes(d) : false}
            onPress={editing ? () => setDiet((c) => toggle(c, d)) : undefined}
          />
        ))}
        {!editing && diet.length === 0 ? <Meta>—</Meta> : null}
      </View>
    </>
  );

  const accountBlock = (
    <>
      <SectionTitle>{t("pf.account")}</SectionTitle>
      <Card>
        <Meta>{t("set.accountId")}</Meta>
        <Text selectable weight={700} size={14} style={{ marginTop: 4 }}>
          {userId}
        </Text>
        <View style={{ marginTop: 8 }}>
          <Button
            label={t("set.copyId")}
            small
            variant="ghost"
            onPress={async () => {
              await Clipboard.setStringAsync(userId ?? "");
              toast(t("group.copied"));
            }}
          />
        </View>
      </Card>

      <Text weight={800} size={13} style={{ marginTop: 20, marginBottom: 8 }}>
        {t("set.methods")}
      </Text>
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text size={20}>✉️</Text>
          <View style={{ flex: 1 }}>
            <Text weight={800}>{t("set.methodEmail")}</Text>
            <Meta numberOfLines={1}>{email}</Meta>
          </View>
        </View>
      </Card>
    </>
  );

  const feedbackBlock = (
    <>
      {(feedback.data ?? []).length > 0 ? (
        <>
          <SectionTitle>{t("fdbk.mine")}</SectionTitle>
          <View style={{ gap: 10 }}>
            {(feedback.data ?? []).map((f) => {
              const tone =
                f.status === "fixed"
                  ? { bg: th.okBg, fg: th.ok }
                  : f.status === "wontfix"
                    ? { bg: th.line, fg: th.muted }
                    : f.status === "triaged"
                      ? { bg: th.blueBg, fg: th.text }
                      : { bg: th.goldBg, fg: th.link };
              return (
                <Card key={f.id}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <Text size={16}>
                      {f.kind === "bug"
                        ? "🐞"
                        : f.kind === "idea"
                          ? "💡"
                          : "💬"}
                    </Text>
                    <View
                      style={{
                        backgroundColor: tone.bg,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        borderRadius: 12,
                      }}
                    >
                      <Text weight={800} size={11} style={{ color: tone.fg }}>
                        {t(`fdbk.st.${f.status}` as Key)}
                      </Text>
                    </View>
                  </View>
                  <Text numberOfLines={3} style={{ marginTop: 6 }}>
                    {f.message}
                  </Text>
                  {f.resolution ? (
                    <Meta style={{ marginTop: 6 }} weight={700}>
                      ↳ {f.resolution}
                    </Meta>
                  ) : null}
                </Card>
              );
            })}
          </View>
        </>
      ) : null}
    </>
  );

  const signOutBlock = (
    <>
      <Button
        label={t("profile.signout")}
        variant="danger"
        block
        onPress={() => signOut()}
        style={{ marginTop: 28 }}
      />
    </>
  );

  return (
    <Screen
      nav
      size={wide ? "wide" : "narrow"}
      top={
        <Header
          title={t("profile.title")}
          left={<BackButton label={t("nav.back")} onPress={goBack} />}
        />
      }
      bottom={editing ? <SaveBar saving={update.isPending} canSave={canSave} onSave={save} onDiscard={cancel} /> : null}
    >
      {wide ? (
        // desktop: who you are and the account on the left; travel style, interests and feedback on the right
        <View
          style={{ flexDirection: "row", gap: 40, alignItems: "flex-start" }}
        >
          <View style={{ flex: 1 }}>
            {identityBlock}
            {accountBlock}
            {signOutBlock}
          </View>
          <View style={{ flex: 1 }}>
            {styleBlock}
            {feedbackBlock}
          </View>
        </View>
      ) : (
        <>
          {identityBlock}
          {styleBlock}
          {accountBlock}
          {feedbackBlock}
          {signOutBlock}
        </>
      )}
    </Screen>
  );
}
