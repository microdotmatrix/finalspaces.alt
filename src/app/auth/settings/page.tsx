import {
  ChangeEmailCard,
  ChangePasswordCard,
  DeleteAccountCard,
  ProvidersCard,
  SessionsCard,
  UpdateAvatarCard,
  UpdateUsernameCard,
} from "@daveyplate/better-auth-ui";

export default function SettingsPage() {
  return (
    <main className="flex flex-col gap-6 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 [&>form]:flex [&>form]:items-stretch">
        <UpdateAvatarCard
          className="md:col-span-2"
          classNames={{
            avatar: {
              base: "size-full max-h-[12rem] aspect-square",
            },
          }}
        />
        <ProvidersCard />

        <UpdateUsernameCard />
        <ChangeEmailCard
          classNames={{
            content: "flex-1",
          }}
        />
        <ChangePasswordCard
          classNames={{
            header: "flex-1",
          }}
        />
        <SessionsCard />
        <DeleteAccountCard />
      </div>
    </main>
  );
}
