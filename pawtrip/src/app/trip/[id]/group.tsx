import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { useMyDogs } from "@/api/dogs";
import {
  useAddDogToTrip,
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
  const myDogs = useMyDogs();

  const addDog = useAddDogToTrip();
  const removeDog = useRemoveDogFromTrip();
  const leave = useLeaveTrip();
  const del = useDeleteTrip();
  const update = useUpdateTrip();

  const [editDog, setEditDog] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | "leave" | "delete">(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const inTrip = new Set(trip.trip_dogs.map((d) => d.dog_id));
  const mineToAdd = (myDogs.data ?? []).filter((d) => !inTrip.has(d.id));

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

  // no code sits on the page: it is created when someone taps the button
  const inviteBlock = (
    <>
      <SectionTitle>{t("group.invite")}</SectionTitle>
      <Button label={t("group.inviteBtn")} icon="ui-invite" block onPress={() => setInviteOpen(true)} />
      <Meta style={{ marginTop: 8 }}>{t("group.inviteHint")}</Meta>
    </>
  );

  // destructive actions live together at the very bottom, clearly marked
  const dangerBlock = (
    <View
      style={{
        marginTop: 56,
        padding: 16,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: th.danger,
        backgroundColor: th.dangerBg,
        gap: 10,
      }}
    >
      <Text weight={800} size={16} color="danger">
        {t("group.danger")}
      </Text>
      <Meta>{isLeader ? t("group.dangerBody") : t("leave.body")}</Meta>
      {isLeader ? (
        <View style={{ gap: 8, marginTop: 4 }}>
          {trip.status !== "completed" ? (
            <Button
              label={t("group.archive")}
              icon="ui-archive"
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
            />
          ) : null}
          <Pressable
            onPress={() => setConfirm("delete")}
            accessibilityRole="button"
            style={{
              minHeight: 48,
              borderRadius: 24,
              backgroundColor: th.danger,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon name="ui-trash" size={26} />
              <Text weight={800} style={{ color: "#fff" }}>
                {t("group.delete")}
              </Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <Button
          label={t("group.leave")}
          variant="danger"
          block
          onPress={() => setConfirm("leave")}
        />
      )}
    </View>
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
            </View>
          </View>
        ) : (
          <>
            {membersBlock}
            {dogsBlock}
            {inviteBlock}
          </>
        )}
        {dangerBlock}
        <InviteSheet visible={inviteOpen} onClose={() => setInviteOpen(false)} trip={trip} isLeader={isLeader} />

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
    </View>
  );
}
