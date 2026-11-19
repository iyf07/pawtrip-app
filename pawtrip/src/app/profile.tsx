import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { useMyProfile } from "@/api/profile";
import type { Profile as ProfileRow } from "@/api/types";
import { useAuth } from "@/auth/AuthProvider";
import { Icon } from "@/components/ui/Icon";
import { PersonTraits } from "@/components/PersonTraits";
import { DietBlock, InterestsBlock, ScaleBlock } from "@/components/TraitBlocks";
import { ExpandGroup } from "@/components/ExpandCard";
import { Avatar } from "@/components/ui/Avatar";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { BackButton, Header, Screen } from "@/components/ui/Screen";
import { Meta, Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { PERSON_SCALES, personScales } from "@/constants/options";
import { useLayout } from "@/hooks/use-layout";
import { useTheme } from "@/hooks/use-theme";
import { useT, type Key } from "@/i18n";
import { goBack } from "@/lib/nav";
import { ConfirmSheet } from '@/components/ui/Sheet';
import { BENTO_GAP, BentoAction, BentoCard, BentoColumns, PersonHeader } from '@/features/circle/Bento';
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
        <PersonHeader index={0} color={th.goldBg} avatar={<Avatar id={profile.id} name={profile.display_name} url={profile.avatar_url} size={84} />} title={profile.display_name} subtitle={`@${profile.handle}`}>
          <PersonTraits size={12} profile={profile} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2, marginTop: 2, marginLeft: -6 }}>
            <Pressable accessibilityRole="button" accessibilityLabel={t('pf.copyPublicId')} onPress={copyPublicId} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}><Icon name="ui-copy" size={24} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={t('pf.sharePublicId')} onPress={() => setSharingId(true)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}><Icon name="ui-share" size={24} /></Pressable>
          </View>
        </PersonHeader>
        <ExpandGroup>
          <BentoCard index={1} tone="gold" title={t("profile.travelStyle")}>
            <ScaleBlock id="scales" fields={PERSON_SCALES} values={scales} describe={(f, v) => t(`scale.${f}.${v}.description` as Key)} />
          </BentoCard>
          <BentoColumns
            left={<BentoCard index={2} tone="tint" title={t("profile.interests")}>
              <InterestsBlock id="interests" value={profile.interests} empty={t("friend.emptyInterests")} />
            </BentoCard>}
            right={<BentoCard index={3} tone="butter" title={t("profile.diet")}>
              <DietBlock id="diet" value={profile.diet} empty={t("friend.emptyDiet")} />
            </BentoCard>}
          />
        </ExpandGroup>
        <BentoCard index={4} title={t("pf.account")}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Icon name="ui-note" size={24} />
            <View style={{ flex: 1 }}>
              <Text weight={800}>{t("set.methodEmail")}</Text>
              <Meta numberOfLines={1}>{email}</Meta>
            </View>
          </View>
        </BentoCard>
        <View style={{ flexDirection: "row", gap: BENTO_GAP }}>
          <BentoAction index={5} icon={<Icon name="ui-pencil" size={56} />} label={t("pf.edit")} onPress={() => setEditing(true)} />
          <BentoAction index={6} danger label={t("profile.signout")} onPress={() => setAskSignOut(true)} />
        </View>
      </View>
      <ProfileEditSheet visible={editing} onClose={() => setEditing(false)} profile={profile} />
      <ShareSheet visible={sharingId} onClose={() => setSharingId(false)} message={t("pf.shareIdMessage", { name: profile.display_name, id: profile.handle })} />
      <ConfirmSheet visible={askSignOut} title={t('profile.signout')} body={t('profile.signoutBody')} confirmLabel={t('profile.signout')} danger
        onConfirm={() => { setAskSignOut(false); signOut().catch(() => toast(t('auth.signOutFailed'))); }} onClose={() => setAskSignOut(false)} />
    </Screen>
  );
}
