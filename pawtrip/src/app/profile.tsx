import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { useMyProfile } from "@/api/profile";
import type { Profile as ProfileRow } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { Icon } from "@/components/ui/Icon";
import { PersonTraits } from "@/components/PersonTraits";
import { InterestPicker } from "@/components/InterestPicker";
import { ScaleInput } from "@/components/ScaleInput";
import { dietIcon } from "@/components/DietIcon";
import { Avatar } from "@/components/ui/Avatar";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Chip } from "@/components/ui/Chip";
import { BackButton, Header, Screen } from "@/components/ui/Screen";
import { Meta, Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { DIETS, PERSON_SCALES, personScales } from "@/constants/options";
import { useLayout } from "@/hooks/use-layout";
import { useTheme } from "@/hooks/use-theme";
import { useT, type Key } from "@/i18n";
import { goBack } from "@/lib/nav";
import { Reveal } from '@/components/ui/Reveal';
import { ConfirmSheet } from '@/components/ui/Sheet';
import { BENTO_GAP, BentoAction, BentoCard, BentoColumns, Hero } from '@/features/circle/Bento';
import { ProfileEditSheet } from '@/features/profile/ProfileEditSheet';
import { ShareSheet } from '@/components/ShareSheet';

export default function ProfileRoute() {
  const me = useMyProfile();
  const { wide } = useLayout();
  if (!me.data) return <Screen nav size={wide ? "wide" : "narrow"}><PageSkeleton cards={4} /></Screen>;
  return <ProfileView key={me.data.id} profile={me.data} />;
}

/** My page: read-only bento cards; everything is edited in one sheet ("编辑资料"), like the family page. */
function ProfileView({ profile }: { profile: ProfileRow }) {
  const { t } = useT();
  const th = useTheme();
  const toast = useToast();
  const { email, signOut } = useAuth();
  const { wide } = useLayout();
  const [askSignOut, setAskSignOut] = useState(false);
  const [editing, setEditing] = useState(false);
  const [sharingId, setSharingId] = useState(false);
  const scales = personScales(profile);

  async function copyPublicId() {
    try {
      if (!await Clipboard.setStringAsync(profile.handle)) throw new Error("copy_failed");
      toast(t("group.copied"));
    } catch { toast(t("common.saveFailed")); }
  }

  return (
    <Screen nav size={wide ? "wide" : "narrow"} top={<Header title={t("profile.title")} left={<BackButton label={t("nav.back")} onPress={goBack} />} />}>
      <View style={{ gap: BENTO_GAP, marginTop: 8 }}>
        <Hero index={0} minHeight={250} color={th.goldBg} avatar={<Avatar id={profile.id} name={profile.display_name} url={profile.avatar_url} size={92} />} title={profile.display_name} subtitle={`@${profile.handle}`}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <Pressable accessibilityRole="button" accessibilityLabel={t('pf.copyPublicId')} onPress={copyPublicId} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}><Icon name="ui-copy" size={24} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={t('pf.sharePublicId')} onPress={() => setSharingId(true)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}><Icon name="ui-share" size={24} /></Pressable>
            <View style={{ flex: 1 }}><PersonTraits size={12} profile={profile} /></View>
          </View>
        </Hero>
        <BentoColumns
          left={<>
            <BentoCard index={1} title={t("profile.travelStyle")}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {PERSON_SCALES.map((f, n) => (
                  <ScaleInput key={f} index={n} field={f} compact inset readOnly iconSize={28} value={scales[f]} description={scales[f] == null ? undefined : t(`scale.${f}.${scales[f]}.description` as Key)} onChange={() => {}} />
                ))}
              </View>
            </BentoCard>
            <BentoCard index={4} title={t("pf.account")}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Icon name="ui-note" size={24} />
                <View style={{ flex: 1 }}>
                  <Text weight={800}>{t("set.methodEmail")}</Text>
                  <Meta numberOfLines={1}>{email}</Meta>
                </View>
              </View>
            </BentoCard>
          </>}
          right={<>
            <BentoCard index={2} tone="tint" title={t("profile.interests")}>
              <InterestPicker value={profile.interests} readOnly />
            </BentoCard>
            <BentoCard index={3} title={t("profile.diet")}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {[...DIETS, ...profile.diet.filter((d) => !(DIETS as readonly string[]).includes(d))].map((d, n) => (
                  <Reveal key={d} index={n}><Chip icon={dietIcon(d)} label={(DIETS as readonly string[]).includes(d) ? t(`diet.${d}` as Key) : d} on={profile.diet.includes(d)} style={!profile.diet.includes(d) ? { opacity: 0.45 } : undefined} /></Reveal>
                ))}
              </View>
            </BentoCard>
          </>}
        />
        <View style={{ flexDirection: "row", gap: BENTO_GAP }}>
          <BentoAction index={5} icon={<Icon name="ui-pencil" size={56} />} label={t("pf.edit")} onPress={() => setEditing(true)} />
          <BentoAction index={6} danger label={t("profile.signout")} onPress={() => setAskSignOut(true)} />
        </View>
      </View>
      <ProfileEditSheet visible={editing} onClose={() => setEditing(false)} profile={profile} />
      <ShareSheet visible={sharingId} onClose={() => setSharingId(false)} message={t("pf.shareIdMessage", { name: profile.display_name, id: profile.handle })} />
      <ConfirmSheet visible={askSignOut} title={t('profile.signout')} body={t('profile.signoutBody')} confirmLabel={t('profile.signout')} danger
        onConfirm={() => { setAskSignOut(false); signOut(); }} onClose={() => setAskSignOut(false)} />
    </Screen>
  );
}
