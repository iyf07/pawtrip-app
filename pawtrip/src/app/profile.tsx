import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, Share, View } from "react-native";

import { useMyProfile, useUpdateProfile } from "@/api/profile";
import type { Profile as ProfileRow } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { Icon } from "@/components/ui/Icon";
import { AvatarEditor } from "@/components/AvatarEditor";
import { HandleField } from "@/components/HandleField";
import { Field } from "@/components/ui/Field";
import { dietIcon } from "@/components/DietIcon";
import { InterestPicker } from "@/components/InterestPicker";
import { PersonTraits } from "@/components/PersonTraits";
import { ScaleInput } from "@/components/ScaleInput";
import { Avatar } from "@/components/ui/Avatar";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProfileTabs } from "@/components/ProfileTabs";
import {
  BackButton,
  Header,
  Screen,
  SectionTitle,
} from "@/components/ui/Screen";
import { Meta, Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { addDietaryNeed, DIETS, PERSON_SCALES, normalizeInterests, personScales, type PersonScale } from "@/constants/options";
import { useLayout } from "@/hooks/use-layout";
import { useTheme } from "@/hooks/use-theme";
import { useT, type Key } from "@/i18n";
import { goBack } from "@/lib/nav";
import { deletePhotoByUrl } from "@/lib/photos";

export default function ProfileRoute() {
  const me = useMyProfile();
  // Mount the form once the profile is loaded so its fields start from the saved values.
  if (!me.data) return <Screen nav size="narrow"><PageSkeleton cards={4} /></Screen>;
  return <ProfileForm key={me.data.id} profile={me.data} />;
}

function ProfileForm({ profile }: { profile: ProfileRow }) {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const { email, signOut } = useAuth();
  const update = useUpdateProfile();
  const { wide } = useLayout();
  // everything is read-only until the pencil is tapped; Save / Cancel then end the edit
  const [profileTab, setProfileTab] = useState<'style' | 'interests' | 'diet' | 'account'>('style');
  const [editing, setEditing] = useState<"identity" | "style" | "interests" | "diet" | null>(null);
  const [name, setName] = useState(profile.display_name);
  const [handle, setHandle] = useState(profile.handle);
  const [handleOk, setHandleOk] = useState(true);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [customDiet, setCustomDiet] = useState("");
  const [diet, setDiet] = useState<string[]>(profile.diet);
  const [scales, setScales] = useState<Record<PersonScale, number | null>>(() => personScales(profile));

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
    setCustomDiet("");
    setScales(personScales(profile));
    setEditing(null);
  }

  async function save() {
    try {
      const patch = editing === "identity"
        ? { display_name: name.trim(), ...(handleChanged ? { handle } : {}) }
        : editing === "style" ? scales
        : editing === "interests" ? { interests: normalizeInterests(interests) }
        : { diet: addDietaryNeed(diet, customDietCode()) };
      await update.mutateAsync(patch);
      if (editing === "diet") { setDiet(addDietaryNeed(diet, customDietCode())); setCustomDiet(""); }
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

  type EditSection = "identity" | "style" | "interests" | "diet";

  function editActions(section: EditSection, title: string) {
    const active = editing === section;
    const actionStyle = { width: 40, height: 40, borderRadius: 20, backgroundColor: th.card, borderWidth: 2, borderColor: th.line, alignItems: "center" as const, justifyContent: "center" as const };
    return (
      <View style={{ flexDirection: "row", gap: 8 }}>
        {active ? (
          <>
            <Pressable accessibilityRole="button" accessibilityLabel={t("pf.saveSection", { section: title })}
              disabled={update.isPending || !canSave} onPress={save}
              style={[actionStyle, { opacity: canSave ? 1 : 0.45 }]}>
              {update.isPending ? <ActivityIndicator color={th.muted} /> : <Icon name="ui-save" size={28} />}
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={t("pf.discardSection", { section: title })}
              disabled={update.isPending} onPress={cancel} style={actionStyle}>
              <Icon name="ui-discard" size={28} />
            </Pressable>
          </>
        ) : (
          <Pressable accessibilityRole="button" accessibilityLabel={section === "identity" ? t("pf.editName") : t("pf.editSection", { section: title })}
            disabled={editing !== null || update.isPending} onPress={() => { cancel(); setEditing(section); }}
            style={[actionStyle, { opacity: editing ? 0.45 : 1 }]}>
            <Icon name="ui-pencil" size={24} />
          </Pressable>
        )}
      </View>
    );
  }

  async function copyPublicId() {
    try {
      if (!await Clipboard.setStringAsync(profile.handle)) throw new Error("copy_failed");
      toast(t("group.copied"));
    } catch { toast(t("common.saveFailed")); }
  }

  async function sharePublicId() {
    const message = t("pf.shareIdMessage", { name: profile.display_name, id: profile.handle });
    try {
      if (Platform.OS === 'web' && !navigator.share) {
        if (!await Clipboard.setStringAsync(message)) throw new Error("copy_failed");
        toast(t("group.copied"));
      } else await Share.share({ message });
    } catch (error) {
      if ((error as { name?: string }).name !== 'AbortError') toast(t("common.saveFailed"));
    }
  }

  const identityBlock = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginTop: 4 }}>
      {editing === "identity" ? (
        <AvatarEditor name={profile.display_name} url={profile.avatar_url} size={wide ? 128 : 84} onChange={changeAvatar} />
      ) : (
        <Avatar id={profile.id} name={profile.display_name} url={profile.avatar_url} size={wide ? 128 : 84} />
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text weight={800} size={wide ? 30 : 22} numberOfLines={1} style={{ flex: 1 }}>{profile.display_name}</Text>
          {editActions("identity", t("pf.name"))}
        </View>
        {editing === "identity" ? (
          <>
            <Field label={t("pf.name")} value={name} onChangeText={setName} maxLength={60} />
            <HandleField label={t("pf.handle")} value={handle} onChangeText={setHandle} onValid={setHandleOk} current={profile.handle} />
          </>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text weight={700} size={wide ? 17 : 15} color="muted" numberOfLines={1}>ID: {profile.handle}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={t('pf.copyPublicId')} onPress={copyPublicId} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ui-copy" size={24} />
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={t('pf.sharePublicId')} onPress={sharePublicId} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ui-share" size={24} />
              </Pressable>
            </View>
            <PersonTraits size={12} profile={editing === "style" ? scales : profile} />
          </>
        )}
      </View>
    </View>
  );

  function sectionHeading(title: string, section: "style" | "interests" | "diet") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Text weight={800} size={20} style={{ flexShrink: 1 }}>{title}</Text>
        <View style={{ flex: 1, borderTopWidth: 2, borderStyle: "dashed", borderColor: th.line }} />
        {editActions(section, title)}
      </View>
    );
  }

  function customDietCode() {
    const text = customDiet.trim();
    return DIETS.find((d) => t(`diet.${d}` as Key).toLocaleLowerCase() === text.toLocaleLowerCase()) ?? text;
  }

  function addCustomDiet() {
    setDiet((current) => addDietaryNeed(current, customDietCode()));
    setCustomDiet("");
  }

  const styleBlock = (
    <>
      {sectionHeading(t("profile.travelStyle"), "style")}
      <View style={!wide ? { flexDirection: "row", flexWrap: "wrap", gap: 10 } : undefined}>
      {PERSON_SCALES.map((f) => (
        <ScaleInput
          key={f}
          field={f}
          compact={!wide}
          iconSize={!wide ? 56 : 44}
          value={scales[f]}
          description={scales[f] == null ? undefined : t(`scale.${f}.${scales[f]}.description` as Key)}
          readOnly={editing !== "style"}
          onChange={(v) => setScales((s) => ({ ...s, [f]: v }))}
        />
      ))}
      </View>
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
        {[...DIETS, ...diet.filter((d) => !(DIETS as readonly string[]).includes(d))].map((d) => (
          <Chip
            key={d}
            icon={dietIcon(d)}
            label={(DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d}
            on={diet.includes(d)}
            onPress={editing === "diet" ? () => setDiet((c) => toggle(c, d)) : undefined}
            style={editing !== "diet" && !diet.includes(d) ? { opacity: 0.45 } : undefined}
          />
        ))}
      </View>
      {editing === "diet" ? (
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Field accessibilityLabel={t("pf.customDiet")} placeholder={t("pf.customDiet")} value={customDiet}
              onChangeText={setCustomDiet} maxLength={40} returnKeyType="done" onSubmitEditing={addCustomDiet} />
          </View>
          <Button label={t("pf.addDiet")} onPress={addCustomDiet} disabled={!customDiet.trim()} />
        </View>
      ) : null}
    </>
  );

  const accountBlock = (
    <>
      <SectionTitle>{t("pf.account")}</SectionTitle>

      <Text weight={800} size={13} style={{ marginTop: 20, marginBottom: 8 }}>
        {t("set.methods")}
      </Text>
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Icon name="ui-note" size={24} />
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
    >
      {identityBlock}
      <View style={{ marginTop: 28 }}>
        {wide ? (
          <>
            <View style={{ flexDirection: "row", gap: 32, alignItems: "flex-start" }}>
              <View style={{ flex: 1, minWidth: 0 }}>{styleBlock}</View>
              <View style={{ flex: 1, minWidth: 0 }}>
                {interestsBlock}
                <View style={{ marginTop: 28 }}>{dietBlock}</View>
              </View>
            </View>
          </>
        ) : (
          <>
            <ProfileTabs value={profileTab} tabs={[
              { value: 'style', label: t('pf.tab.style'), icon: 'scale-walk-4' },
              { value: 'interests', label: t('pf.tab.interests'), icon: 'cat-fun' },
              { value: 'diet', label: t('pf.tab.diet'), icon: 'diet-vegetarian' },
              { value: 'account', label: t('pf.tab.account'), icon: 'ui-key' },
            ]} onChange={(next) => {
              if (editing && next !== profileTab) { toast(t('pf.finishSection')); return; }
              setProfileTab(next);
            }} />
            <View style={{ marginTop: 24 }}>
              {profileTab === 'style' ? styleBlock : profileTab === 'interests' ? interestsBlock : profileTab === 'diet' ? dietBlock : <>{accountBlock}{signOutBlock}</>}
            </View>
          </>
        )}
      </View>
      {wide ? <View style={{ marginTop: 28 }}>
        {accountBlock}
        {signOutBlock}
      </View> : null}
    </Screen>
  );
}
