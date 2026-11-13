import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, Share, View } from "react-native";

import { useMyDogs } from "@/api/dogs";
import {
  useAddDogToTrip,
  useDeleteTrip,
  useLeaveTrip,
  useRemoveDogFromTrip,
  useRotateInviteCode,
  useUpdateTrip,
} from "@/api/trips";
import { Avatar, DogAvatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SaveBar } from "@/components/ui/SaveBar";
import { SectionTitle } from "@/components/ui/Screen";
import { ConfirmSheet } from "@/components/ui/Sheet";
import { Meta, Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { TRIP_INTERESTS } from "@/constants/options";
import { DogEditSheet } from "@/features/dog/DogEditSheet";
import { TabBody, useTripCtx } from "@/features/trip/TripContext";
import { useLayout } from "@/hooks/use-layout";
import { useTheme } from "@/hooks/use-theme";
import { useT, type Key } from "@/i18n";

export default function Group() {
  const { t } = useT();
  const th = useTheme();
  const { wide } = useLayout();
  const toast = useToast();
  const { trip, userId, isLeader } = useTripCtx();
  const myDogs = useMyDogs();

  const rotate = useRotateInviteCode();
  const addDog = useAddDogToTrip();
  const removeDog = useRemoveDogFromTrip();
  const leave = useLeaveTrip();
  const del = useDeleteTrip();
  const update = useUpdateTrip();

  const [editDog, setEditDog] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | "leave" | "delete">(null);
  // the leader's unsaved edit; null = show what is saved
  const [draft, setDraft] = useState<string[] | null>(null);
  const interests = draft ?? trip.interests;

  // invite codes last one hour; keep the countdown fresh
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);
  const msLeft = new Date(trip.invite_expires).getTime() - now;
  const expired = msLeft <= 0;
  const minLeft = Math.max(1, Math.ceil(msLeft / 60_000));
  const linkFor = (code: string) =>
    Platform.OS === "web"
      ? `${window.location.origin}/join?code=${code}`
      : Linking.createURL("/join", { queryParams: { code } });
  // a leader who shares an expired code gets a fresh one first
  const currentCode = async () =>
    expired && isLeader ? await rotate.mutateAsync(trip.id) : trip.invite_code;

  const inTrip = new Set(trip.trip_dogs.map((d) => d.dog_id));
  const mineToAdd = (myDogs.data ?? []).filter((d) => !inTrip.has(d.id));

  async function copyCode() {
    try {
      await Clipboard.setStringAsync(await currentCode());
      toast(t("group.copied"));
    } catch {
      toast(t("common.saveFailed"));
    }
  }

  async function shareInvite() {
    try {
      const code = await currentCode();
      const message = t("group.shareText", {
        name: trip.name,
        link: linkFor(code),
        code,
      });
      if (Platform.OS === "web" && !navigator.share) {
        await Clipboard.setStringAsync(message);
        toast(t("group.copied"));
      } else {
        await Share.share({ message });
      }
    } catch {
      /* dismissed */
    }
  }

  async function run(p: Promise<unknown>, ok?: string) {
    try {
      await p;
      if (ok) toast(ok);
    } catch {
      toast(t("common.saveFailed"));
    }
  }

  async function doConfirm() {
    const which = confirm;
    try {
      if (which === "leave") await leave.mutateAsync(trip.id);
      else await del.mutateAsync(trip.id);
      setConfirm(null);
      toast(which === "leave" ? t("toast.left") : t("toast.deleted"));
      router.replace("/");
    } catch {
      setConfirm(null);
      toast(t("common.saveFailed"));
    }
  }

  const interestsChanged =
    interests.slice().sort().join() !== trip.interests.slice().sort().join();

  const membersBlock = (
    <>
      <SectionTitle>{t("group.members")}</SectionTitle>
      <Card style={{ paddingVertical: 4 }}>
        {trip.trip_members.map((m, i) => {
          const name = m.profiles?.display_name || "?";
          return (
            <View
              key={m.user_id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                minHeight: 56,
                borderTopWidth: i === 0 ? 0 : 1.5,
                borderStyle: "dashed",
                borderColor: th.line,
              }}
            >
              <Avatar
                id={m.user_id}
                name={name}
                url={m.profiles?.avatar_url}
                size={36}
              />
              <View style={{ flex: 1 }}>
                <Text weight={700} numberOfLines={1}>
                  {m.user_id === userId ? t("group.meTag", { name }) : name}
                </Text>
                {m.profiles?.handle ? (
                  <Meta numberOfLines={1}>@{m.profiles.handle}</Meta>
                ) : null}
              </View>
              {m.user_id === trip.creator_id ? (
                <View
                  style={{
                    backgroundColor: th.blueBg,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 12,
                  }}
                >
                  <Text weight={800} size={11}>
                    {t("group.organizer")}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </Card>
    </>
  );

  const dogsBlock = (
    <>
      <SectionTitle>{t("group.dogs")}</SectionTitle>
      <View style={{ gap: 10 }}>
        {trip.trip_dogs.length === 0 ? <Meta>{t("group.noDogs")}</Meta> : null}
        {trip.trip_dogs.map((td) => {
          const dog = td.dogs;
          if (!dog) return null;
          const mine = dog.owner_id === userId;
          const owner = dog.profiles?.display_name || "?";
          return (
            <Card
              key={td.dog_id}
              onPress={mine ? () => setEditDog(dog.id) : undefined}
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <DogAvatar url={dog.photo_url} />
              <View style={{ flex: 1 }}>
                <Text weight={800}>{dog.name}</Text>
                <Meta>{t("group.theirDog", { name: owner })}</Meta>
              </View>
              {mine || isLeader ? (
                <Pressable
                  onPress={() =>
                    run(
                      removeDog.mutateAsync({ tripId: trip.id, dogId: dog.id }),
                    )
                  }
                  accessibilityLabel={t("group.removeDog")}
                  hitSlop={8}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text weight={800} color="muted">
                    ✕
                  </Text>
                </Pressable>
              ) : null}
            </Card>
          );
        })}
        {mineToAdd.map((d) => (
          <Card
            key={d.id}
            dashed
            onPress={() =>
              run(addDog.mutateAsync({ tripId: trip.id, dogId: d.id }))
            }
            style={{ alignItems: "center" }}
          >
            <Text weight={800} color="link">
              {t("group.addMyDog", { name: d.name })}
            </Text>
          </Card>
        ))}
        <Card
          dashed
          onPress={() =>
            router.push({ pathname: "/dog/[id]", params: { id: "new" } })
          }
          style={{ alignItems: "center" }}
        >
          <Text weight={800} color="link">
            {t("group.newDog")}
          </Text>
        </Card>
      </View>
    </>
  );

  const inviteBlock = (
    <>
      <SectionTitle>{t("group.invite")}</SectionTitle>
      <Card>
        <Meta>{t("group.code")}</Meta>
        <Text
          weight={800}
          size={22}
          selectable
          style={{ marginTop: 4, marginBottom: 10, letterSpacing: 0.5 }}
        >
          {trip.invite_code}
        </Text>
        <Meta color={expired ? "danger" : "muted"}>
          {expired
            ? t("group.expired")
            : t("group.expiresIn", { min: minLeft })}
        </Meta>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
          }}
        >
          <Button label={t("group.share")} small onPress={shareInvite} />
          <Button
            label={t("group.copy")}
            small
            variant="ghost"
            onPress={copyCode}
          />
          {isLeader ? (
            <Button
              label={t("group.newCode")}
              small
              variant="ghost"
              loading={rotate.isPending}
              onPress={() =>
                run(rotate.mutateAsync(trip.id), t("toast.newCode"))
              }
            />
          ) : null}
        </View>
      </Card>
    </>
  );

  const settingsBlock = (
    <>
      {isLeader ? (
        <>
          <SectionTitle>{t("group.settings")}</SectionTitle>
          <Text weight={800} size={13}>
            {t("group.interests")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 8,
            }}
          >
            {TRIP_INTERESTS.map((i) => (
              <Chip
                key={i}
                label={t(`int.${i}` as Key)}
                on={interests.includes(i)}
                onPress={() =>
                  setDraft(
                    interests.includes(i)
                      ? interests.filter((x) => x !== i)
                      : [...interests, i],
                  )
                }
              />
            ))}
          </View>
          {trip.status !== "completed" ? (
            <Button
              label={t("group.archive")}
              variant="ghost"
              block
              onPress={async () => {
                await run(
                  update.mutateAsync({
                    tripId: trip.id,
                    patch: { status: "completed" },
                  }),
                );
                router.replace("/");
                toast(t("toast.archived"));
              }}
              style={{ marginTop: 10 }}
            />
          ) : null}
        </>
      ) : null}
    </>
  );

  const dangerBlock = (
    <>
      <View style={{ marginTop: 28 }}>
        {isLeader ? (
          <Button
            label={`🗑️ ${t("group.delete")}`}
            variant="danger"
            block
            onPress={() => setConfirm("delete")}
          />
        ) : (
          <Button
            label={t("group.leave")}
            variant="danger"
            block
            onPress={() => setConfirm("leave")}
          />
        )}
      </View>
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <DogEditSheet dogId={editDog} onClose={() => setEditDog(null)} />
      <TabBody max={1100}>
        {wide ? (
          // desktop: people and dogs on the left, inviting and settings on the right
          <View
            style={{ flexDirection: "row", gap: 32, alignItems: "flex-start" }}
          >
            <View style={{ flex: 1 }}>
              {membersBlock}
              {dogsBlock}
            </View>
            <View style={{ flex: 1 }}>
              {inviteBlock}
              {settingsBlock}
              {dangerBlock}
            </View>
          </View>
        ) : (
          <>
            {membersBlock}
            {dogsBlock}
            {inviteBlock}
            {settingsBlock}
            {dangerBlock}
          </>
        )}

        <ConfirmSheet
          visible={confirm !== null}
          title={confirm === "delete" ? t("delete.title") : t("leave.title")}
          body={
            confirm === "delete"
              ? t("delete.body", { name: trip.name })
              : t("leave.body")
          }
          confirmLabel={
            confirm === "delete" ? t("group.delete") : t("leave.yes")
          }
          danger
          busy={leave.isPending || del.isPending}
          onConfirm={doConfirm}
          onClose={() => setConfirm(null)}
        />
      </TabBody>
      {isLeader && interestsChanged ? (
        <SaveBar
          aboveTabs
          saving={update.isPending}
          onSave={async () => {
            await run(
              update.mutateAsync({ tripId: trip.id, patch: { interests } }),
              t("toast.saved"),
            );
            setDraft(null);
          }}
          onDiscard={() => setDraft(null)}
        />
      ) : null}
    </View>
  );
}
