import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import {
  useDeleteTrip,
  useLeaveTrip,
  useRemoveDogFromTrip,
  useUpdateTrip,
} from "@/api/trips";
import { Avatar, DogAvatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/Screen";
import { ConfirmSheet } from "@/components/ui/Sheet";
import { Meta, Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { DogEditSheet } from "@/features/dog/DogEditSheet";
import { AddDogsSheet } from "@/features/dog/AddDogsSheet";
import { AddBuddiesSheet } from "@/features/buddies/AddBuddiesSheet";
import { InviteSheet } from "@/features/trip/InviteSheet";
import { TabBody, useTripCtx } from "@/features/trip/TripContext";
import { useLayout } from "@/hooks/use-layout";
import { useTheme } from "@/hooks/use-theme";
import { useT } from "@/i18n";

export default function Group() {
  const { t } = useT();
  const th = useTheme();
  const { wide } = useLayout();
  const toast = useToast();
  const { trip, userId, isLeader } = useTripCtx();

  const removeDog = useRemoveDogFromTrip();
  const leave = useLeaveTrip();
  const del = useDeleteTrip();
  const update = useUpdateTrip();

  const [editDog, setEditDog] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | "leave" | "delete" | "archive">(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [buddiesOpen, setBuddiesOpen] = useState(false);
  const [dogsOpen, setDogsOpen] = useState(false);


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
      else if (which === "archive") await update.mutateAsync({ tripId: trip.id, patch: { status: "completed" } });
      else await del.mutateAsync(trip.id);
      setConfirm(null);
      toast(which === "leave" ? t("toast.left") : which === "archive" ? t("toast.archived") : t("toast.deleted"));
      router.replace("/");
    } catch {
      setConfirm(null);
      toast(t("common.saveFailed"));
    }
  }

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
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                    <Icon name="ui-crown" size={16} />
                    <Text weight={800} size={11}>
                      {t("group.organizer").replace(/^\S*👑\s*/u, "")}
                    </Text>
                  </View>
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
        <Card dashed onPress={() => setDogsOpen(true)} style={{ alignItems: "center" }}>
          <Text weight={800} color="link">
            {"+ " + t("dogs.addMine")}
          </Text>
        </Card>
      </View>
    </>
  );

  // no code sits on the page: it is created when someone taps the button
  const inviteBlock = (
    <>
      {isLeader ? (
        <Card dashed onPress={() => setBuddiesOpen(true)} style={{ alignItems: "center", marginTop: 12, marginBottom: 10 }}>
          <Text weight={800} color="link">
            {"+ " + t("bd.addMine")}
          </Text>
        </Card>
      ) : null}
      <Button label={t("group.inviteBtn")} icon="ui-invite" block onPress={() => setInviteOpen(true)} style={isLeader ? undefined : { marginTop: 12 }} />
    </>
  );

  // archive / delete / leave sit at the very bottom; each one asks before it does anything
  const dangerBlock = (
    <View style={{ marginTop: 40, gap: 10 }}>
      {isLeader ? (
        <>
          {trip.status !== "completed" ? <Button label={t("group.archive")} icon="ui-archive" variant="ghost" block onPress={() => setConfirm("archive")} /> : null}
          <Pressable
            onPress={() => setConfirm("delete")}
            accessibilityRole="button"
            style={{ minHeight: 48, borderRadius: 24, backgroundColor: th.danger, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon name="ui-trash" size={26} />
              <Text weight={800} style={{ color: "#fff" }}>
                {t("group.delete")}
              </Text>
            </View>
          </Pressable>
        </>
      ) : (
        <Button label={t("group.leave")} variant="danger" block onPress={() => setConfirm("leave")} />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <DogEditSheet dogId={editDog} onClose={() => setEditDog(null)} />
      <TabBody max={1100}>
        {wide ? (
          // desktop: one centered column, the same width as the other pages
          <View style={{ width: "100%", maxWidth: 560, alignSelf: "center" }}>
            {membersBlock}
            {inviteBlock}
            {dogsBlock}
            {dangerBlock}
          </View>
        ) : (
          <>
            {membersBlock}
            {inviteBlock}
            {dogsBlock}
            {dangerBlock}
          </>
        )}
        <AddDogsSheet visible={dogsOpen} onClose={() => setDogsOpen(false)} trip={trip} />
        <AddBuddiesSheet visible={buddiesOpen} onClose={() => setBuddiesOpen(false)} trip={trip} />
        <InviteSheet visible={inviteOpen} onClose={() => setInviteOpen(false)} trip={trip} isLeader={isLeader} />

        <ConfirmSheet
          visible={confirm !== null}
          title={confirm === "delete" ? t("delete.title") : confirm === "archive" ? t("archive.title") : t("leave.title")}
          body={
            confirm === "delete"
              ? t("delete.body", { name: trip.name })
              : confirm === "archive"
                ? t("archive.body")
                : t("leave.body")
          }
          confirmLabel={
            confirm === "delete" ? t("group.delete") : confirm === "archive" ? t("group.archive") : t("leave.yes")
          }
          danger
          busy={leave.isPending || del.isPending}
          onConfirm={doConfirm}
          onClose={() => setConfirm(null)}
        />
      </TabBody>
    </View>
  );
}
