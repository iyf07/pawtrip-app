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
import { InlineFieldRow } from "@/components/ui/InlineFieldRow";
import { dietIcon } from "@/components/DietIcon";
import { InterestPicker } from "@/components/InterestPicker";
import { PersonTraits } from "@/components/PersonTraits";
import { ScaleInput } from "@/components/ScaleInput";
import { Avatar } from "@/components/ui/Avatar";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  BackButton,
  Header,
  Screen,
} from "@/components/ui/Screen";
import { Meta, Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { addDietaryNeed, DIETS, PERSON_SCALES, normalizeInterests, personScales, type PersonScale } from "@/constants/options";
import { useLayout } from "@/hooks/use-layout";
import { useTheme } from "@/hooks/use-theme";
import { useT, type Key } from "@/i18n";
import { goBack } from "@/lib/nav";
import { deletePhotoByUrl } from "@/lib/photos";
import { Reveal } from '@/components/ui/Reveal';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { BENTO_GAP, BentoCard, Hero } from '@/features/circle/Bento';
import { RingButton } from '@/components/ui/RingButton';
import { ShareSheet } from '@/components/ShareSheet';

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
  const [askSignOut, setAskSignOut] = useState(false);
  const update = useUpdateProfile();
  const { wide } = useLayout();
  // everything is read-only until the pencil is tapped; Save / Cancel then end the edit
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

  async function save(animationDone?: Promise<void>) {
    try {
      const patch = editing === "identity"
        ? { display_name: name.trim(), ...(handleChanged ? { handle } : {}) }
        : editing === "style" ? scales
        : editing === "interests" ? { interests: normalizeInterests(interests) }
        : { diet: addDietaryNeed(diet, customDietCode()) };
      await update.mutateAsync(patch);
      await animationDone; // let the ✓ animation finish before the edit mode closes
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
            <View style={{ opacity: canSave ? 1 : 0.45 }}><RingButton kind="save" label={t("pf.saveSection", { section: title })} disabled={!canSave} loading={update.isPending} onPress={(done) => save(done)} /></View>
            <RingButton kind="discard" label={t("pf.discardSection", { section: title })} disabled={update.isPending} onPress={async (done) => { await done; cancel(); }} />
          </>
        ) : (
          <Pressable accessibilityRole="button" accessibilityLabel={section === "identity" ? t("pf.editName") : t("pf.editSection", { section: title })}
            disabled={update.isPending} onPress={() => { if (editing !== null) { toast(t("pf.finishSection")); return; } cancel(); setEditing(section); }}
            accessibilityState={{ disabled: editing !== null }}
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

  const [sharingId, setSharingId] = useState(false);
  const sharePublicId = () => setSharingId(true);

  const identityBlock = (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
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
            <InlineFieldRow label={t("pf.name")}><Field accessibilityLabel={t("pf.name")} containerStyle={{ marginTop: 0 }} value={name} onChangeText={setName} maxLength={60} /></InlineFieldRow>
            <InlineFieldRow index={1} label={t("pf.handle")}><HandleField accessibilityLabel={t("pf.handle")} value={handle} onChangeText={setHandle} onValid={setHandleOk} current={profile.handle} compact /></InlineFieldRow>
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

  function customDietCode() {
    const text = customDiet.trim();
    return DIETS.find((d) => t(`diet.${d}` as Key).toLocaleLowerCase() === text.toLocaleLowerCase()) ?? text;
  }

  function addCustomDiet() {
    setDiet((current) => addDietaryNeed(current, customDietCode()));
    setCustomDiet("");
  }

  const styleBlock = (
    <BentoCard index={1} title={t("profile.travelStyle")} right={editActions("style", t("profile.travelStyle"))}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {PERSON_SCALES.map((f, n) => (
          <ScaleInput
            key={f}
            index={n}
            field={f}
            compact
            inset
            iconSize={28}
            value={scales[f]}
            description={scales[f] == null ? undefined : t(`scale.${f}.${scales[f]}.description` as Key)}
            readOnly={editing !== "style"}
            onChange={(v) => setScales((s) => ({ ...s, [f]: v }))}
          />
        ))}
      </View>
    </BentoCard>
  );

  const interestsBlock = (
    <BentoCard index={2} tone="tint" title={t("profile.interests")} right={editActions("interests", t("profile.interests"))}>
      <InterestPicker value={interests} readOnly={editing !== "interests"} onToggle={(i) => setInterests((c) => toggle(c, i))} />
    </BentoCard>
  );

  const dietBlock = (
    <BentoCard index={3} title={t("profile.diet")} right={editActions("diet", t("profile.diet"))}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {[...DIETS, ...diet.filter((d) => !(DIETS as readonly string[]).includes(d))].map((d, n) => (
          <Reveal key={d} index={n}><Chip
            icon={dietIcon(d)}
            label={(DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d}
            on={diet.includes(d)}
            onPress={editing === "diet" ? () => setDiet((c) => toggle(c, d)) : undefined}
            style={editing !== "diet" && !diet.includes(d) ? { opacity: 0.45 } : undefined}
          /></Reveal>
        ))}
      </View>
      {editing === "diet" ? (
        <Reveal index={0}><View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Field accessibilityLabel={t("pf.customDiet")} placeholder={t("pf.customDiet")} value={customDiet}
              onChangeText={setCustomDiet} maxLength={40} returnKeyType="done" onSubmitEditing={addCustomDiet} />
          </View>
          <Button label={t("pf.addDiet")} onPress={addCustomDiet} disabled={!customDiet.trim()} />
        </View></Reveal>
      ) : null}
    </BentoCard>
  );

  const accountBlock = (
    <BentoCard index={4} title={t("pf.account")}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Icon name="ui-note" size={24} />
        <View style={{ flex: 1 }}>
          <Text weight={800}>{t("set.methodEmail")}</Text>
          <Meta numberOfLines={1}>{email}</Meta>
        </View>
      </View>
    </BentoCard>
  );

  const signOutBlock = (
    <BentoCard index={5}>
      <Button label={t("profile.signout")} variant="danger" block onPress={() => setAskSignOut(true)} />
    </BentoCard>
  );

  return (
    <Screen
      nav
      size="narrow"
      top={
        <Header
          title={t("profile.title")}
          left={<BackButton label={t("nav.back")} onPress={goBack} />}
        />
      }
    >
      <View style={{ gap: BENTO_GAP, marginTop: 8 }}>
        {editing === "identity" ? <BentoCard index={0} tone="gold">{identityBlock}</BentoCard> : (
          <Hero index={0} minHeight={250} color={th.goldBg} avatar={<Avatar id={profile.id} name={profile.display_name} url={profile.avatar_url} size={92} />} title={profile.display_name} subtitle={`@${profile.handle}`} right={editActions("identity", t("pf.name"))}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
              <Pressable accessibilityRole="button" accessibilityLabel={t('pf.copyPublicId')} onPress={copyPublicId} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}><Icon name="ui-copy" size={24} /></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={t('pf.sharePublicId')} onPress={sharePublicId} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}><Icon name="ui-share" size={24} /></Pressable>
              <View style={{ flex: 1 }}><PersonTraits size={12} profile={editing === "style" ? scales : profile} /></View>
            </View>
          </Hero>
        )}
        {styleBlock}
        {interestsBlock}
        {dietBlock}
        {accountBlock}
        {signOutBlock}
      </View>
      <ShareSheet visible={sharingId} onClose={() => setSharingId(false)} message={t("pf.shareIdMessage", { name: profile.display_name, id: profile.handle })} />
      <ConfirmSheet visible={askSignOut} title={t('profile.signout')} body={t('profile.signoutBody')} confirmLabel={t('profile.signout')} danger
        onConfirm={() => { setAskSignOut(false); signOut(); }} onClose={() => setAskSignOut(false)} />
    </Screen>
  );
}
