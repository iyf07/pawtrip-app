import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Pressable, View } from "react-native";

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
  const update = useUpdateProfile();
  const { wide } = useLayout();
  // everything is read-only until the pencil is tapped; Save / Cancel then end the edit
  const [editing, setEditing] = useState<"identity" | "style" | "interests" | "diet" | null>(null);
  const [name, setName] = useState(profile.display_name);
  const [handle, setHandle] = useState(profile.handle);
  const [handleOk, setHandleOk] = useState(true);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [diet, setDiet] = useState<string[]>(profile.diet);
  const [scales, setScales] = useState<Record<PersonScale, number | null>>({
    walking: profile.walking,
    noise: profile.noise,
    morning: profile.morning,
  });

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const handleChanged = handle !== profile.handle;
  const canSave = editing !== "identity" || (name.trim().length > 0 && (!handleChanged || handleOk));

  function cancel() {
    setName(profile.display_name);
    setHandle(profile.handle);
    setHandleOk(true);
    setInterests(profile.interests);
    setDiet(profile.diet);
    setScales({
      walking: profile.walking,
      noise: profile.noise,
      morning: profile.morning,
    });
    setEditing(null);
  }

  async function save() {
    try {
      const patch = editing === "identity"
        ? { display_name: name.trim(), ...(handleChanged ? { handle } : {}) }
        : editing === "style" ? scales
        : editing === "interests" ? { interests }
        : { diet };
      await update.mutateAsync(patch);
      toast(t("toast.saved"));
      setEditing(null);
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
      {editing === "identity" ? (
        <AvatarEditor name={profile.display_name} url={profile.avatar_url} size={wide ? 128 : 84} onChange={changeAvatar} />
      ) : (
        <Avatar id={profile.id} name={profile.display_name} url={profile.avatar_url} size={wide ? 128 : 84} />
      )}
      <View style={{ flex: 1 }}>
        {editing === "identity" ? (
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
                disabled={editing !== null}
                onPress={() => { cancel(); setEditing("identity"); }}
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

  function sectionHeading(title: string, section: "style" | "interests" | "diet") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Text weight={800} size={20}>{title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("pf.editSection", { section: title })}
          disabled={editing !== null}
          onPress={() => { cancel(); setEditing(section); }}
          hitSlop={8}
          style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: "center", justifyContent: "center", opacity: editing && editing !== section ? 0.45 : 1 }}>
          <Icon name="ui-pencil" size={20} />
        </Pressable>
        <View style={{ flex: 1, borderTopWidth: 2, borderStyle: "dashed", borderColor: th.line }} />
      </View>
    );
  }

  const styleBlock = (
    <>
      {sectionHeading(t("profile.travelStyle"), "style")}
      {PERSON_SCALES.map((f) => (
        <ScaleInput
          key={f}
          field={f}
          value={scales[f]}
          readOnly={editing !== "style"}
          onChange={(v) => setScales((s) => ({ ...s, [f]: v }))}
        />
      ))}

    </>
  );

  const interestsBlock = (
    <>
      {sectionHeading(t("profile.interests"), "interests")}
      <View>
        <InterestPicker
          value={interests}
          readOnly={editing !== "interests"}
          onToggle={(i) => setInterests((c) => toggle(c, i))}
        />
      </View>

    </>
  );

  const dietBlock = (
    <>
      {sectionHeading(t("profile.diet"), "diet")}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {DIETS.map((d) => (
          <Chip
            key={d}
            icon={dietIcon(d)}
            label={t(`diet.${d}` as Key)}
            on={diet.includes(d)}
            onPress={editing === "diet" ? () => setDiet((c) => toggle(c, d)) : undefined}
            style={editing !== "diet" && !diet.includes(d) ? { opacity: 0.45 } : undefined}
          />
        ))}
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
      {identityBlock}
      <View style={{ marginTop: 28, padding: wide ? 24 : 16, borderWidth: 2, borderColor: th.line, borderRadius: 24 }}>
        {wide ? (
          <>
            <View style={{ flexDirection: "row", gap: 32, alignItems: "flex-start" }}>
              <View style={{ flex: 1, minWidth: 0 }}>{styleBlock}</View>
              <View style={{ flex: 1, minWidth: 0 }}>{interestsBlock}</View>
            </View>
            <View style={{ flexDirection: "row", gap: 32, marginTop: 28 }}>
              <View style={{ flex: 1, minWidth: 0 }}>{dietBlock}</View>
              <View style={{ flex: 1 }} />
            </View>
          </>
        ) : (
          <>
            {styleBlock}
            <View style={{ marginTop: 28 }}>{interestsBlock}</View>
            <View style={{ marginTop: 28 }}>{dietBlock}</View>
          </>
        )}
      </View>
      <View style={{ marginTop: 12 }}>
        {accountBlock}
        {signOutBlock}
      </View>
    </Screen>
  );
}
